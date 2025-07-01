import { Router, Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import { aiRateLimiter, premiumAiRateLimiter, createRateLimiter } from '../middleware/rateLimiting-simple';
import { authenticateToken } from '../middleware/auth';
import { db } from '../../db/index.js';
import { channelProfiles } from '../../db/schema.js';
import { userApiKeys } from '../../db/schema/userApiKeys.js';
import { eq, and } from 'drizzle-orm';
import { EncryptionService } from '../services/encryption.service.js';

// Extend Request to include user
interface AuthRequest extends Request {
  user?: {
    id?: number;
    userId?: number;
    email: string;
    username: string;
  };
}

const router = Router();

// Initialize OpenAI with server-side API key as fallback
console.log('Initializing OpenAI with key:', process.env.OPENAI_API_KEY ? 'Key exists' : 'NO KEY FOUND');
const serverOpenai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Helper function to get user's OpenAI API key and create client
async function getUserOpenAIClient(userId: number | undefined): Promise<{ client: OpenAI | null, userApiKeyId: number | null }> {
  if (!userId) {
    return { client: null, userApiKeyId: null };
  }

  try {
    const [userApiKey] = await db
      .select()
      .from(userApiKeys)
      .where(
        and(
          eq(userApiKeys.userId, userId),
          eq(userApiKeys.provider, 'openai'),
          eq(userApiKeys.isActive, true)
        )
      )
      .limit(1);

    if (userApiKey) {
      const decryptedKey = EncryptionService.decrypt(userApiKey.apiKey);
      return {
        client: new OpenAI({ apiKey: decryptedKey }),
        userApiKeyId: userApiKey.id
      };
    }
  } catch (error) {
    console.error('Error fetching user API key:', error);
  }

  return { client: null, userApiKeyId: null };
}

// Helper function to update lastUsed timestamp
async function updateApiKeyLastUsed(apiKeyId: number) {
  try {
    await db
      .update(userApiKeys)
      .set({ lastUsed: new Date(), updatedAt: new Date() })
      .where(eq(userApiKeys.id, apiKeyId));
  } catch (error) {
    console.error('Error updating API key lastUsed:', error);
  }
}

// Helper function to get OpenAI client (user's or server's)
async function getOpenAIClient(userId: number | undefined): Promise<{ client: OpenAI, userApiKeyId: number | null }> {
  const { client: userClient, userApiKeyId } = await getUserOpenAIClient(userId);
  
  if (userClient) {
    return { client: userClient, userApiKeyId };
  }
  
  // Fall back to server API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('No API key available. Please configure your own OpenAI API key in settings.');
  }
  
  return { client: serverOpenai, userApiKeyId: null };
}

// Simple data extraction helper
function extractDataFromResponse(response: string, step: number, history: any[]): any {
  const lowerResponse = response.toLowerCase();
  const fullConversation = history.map(h => h.content).join(' ') + ' ' + response;
  
  try {
    switch (step) {
      case 0: // Channel basics
        const channelNameMatch = fullConversation.match(/(?:my channel is|channel name is|it's called|i call it)\s+["']?([^"',.!?]+)["']?/i);
        const nicheMatch = fullConversation.match(/(?:about|focus on|create|make)\s+([^,.!?]+)\s+(?:content|videos|video)/i);
        
        return {
          channelName: channelNameMatch?.[1]?.trim(),
          niche: nicheMatch?.[1]?.trim(),
          contentTypes: [] // Will be enhanced later
        };
        
      case 1: // Target audience
        return {
          targetAudience: 'Extracted from conversation',
          painPoints: []
        };
        
      case 2: // Goals
        return {
          goals: [],
          uploadSchedule: 'Weekly',
          uniqueValue: 'Extracted from conversation'
        };
        
      default:
        return {};
    }
  } catch (e) {
    console.error('Data extraction error:', e);
    return {};
  }
}

// Middleware to optionally authenticate user for premium rate limits
router.use((req: Request, res: Response, next) => {
  // Try to authenticate but don't require it
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    authenticateToken(req, res, () => {
      // If authenticated, apply premium rate limiter
      if ((req as any).user) {
        premiumAiRateLimiter(req, res, next);
      } else {
        aiRateLimiter(req, res, next);
      }
    });
  } else {
    // No auth header, apply standard rate limiter
    aiRateLimiter(req, res, next);
  }
});

// Endpoint for adapting frame content
router.post('/adapt-content', async (req: AuthRequest, res: Response) => {
  try {
    const { content, tone, filter, frameType, unitType } = req.body;
    const userId = req.user?.userId || req.user?.id;
    
    // Basic validation
    if (!content || !tone || !filter) {
      return res.status(400).json({ 
        error: 'Missing required fields: content, tone, and filter are required' 
      });
    }

    // Validate content length
    if (content.length > 5000) {
      return res.status(400).json({ 
        error: 'Content too long. Maximum 5000 characters allowed.' 
      });
    }
    
    const systemPrompt = `You are a video content specialist. Adapt the given frame content to match the specified tone and filter while maintaining the core message. Frame type: ${frameType || 'general'}, Unit type: ${unitType || 'general'}.`;
    
    const userPrompt = `Please adapt this content with the following parameters:
    - Tone: ${tone}
    - Filter: ${filter}
    
    Original content: ${content}
    
    Provide only the adapted content without any explanations or metadata.`;

    // Get appropriate OpenAI client
    const { client: openai, userApiKeyId } = await getOpenAIClient(userId);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    // Update lastUsed if using user's API key
    if (userApiKeyId) {
      await updateApiKeyLastUsed(userApiKeyId);
    }

    const adaptedContent = response.choices[0]?.message?.content || content;
    
    res.json({ adaptedContent });
  } catch (error) {
    console.error('Error adapting content:', error);
    
    // Don't expose internal errors to client
    if (error instanceof Error && error.message.includes('API key')) {
      return res.status(500).json({ error: 'AI service configuration error. Please configure your OpenAI API key in settings.' });
    }
    
    res.status(500).json({ error: 'Failed to adapt content' });
  }
});

// Endpoint for generating video scripts
router.post('/generate-script', async (req: AuthRequest, res: Response) => {
  try {
    const { frames, duration } = req.body;
    const userId = req.user?.userId || req.user?.id;
    
    // Validation
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ 
        error: 'Frames array is required and must not be empty' 
      });
    }

    if (!duration || duration < 15 || duration > 300) {
      return res.status(400).json({ 
        error: 'Duration must be between 15 and 300 seconds' 
      });
    }

    // Prepare frames data for the prompt
    const framesData = frames.map((frame: any, index: number) => 
      `Frame ${index + 1} (${frame.unitType || 'General'}): ${frame.content || 'No content'}`
    ).join('\n');

    const systemPrompt = `You are a professional video script writer. Create a natural, engaging video script based on the provided frames that fits within the specified duration.`;
    
    const userPrompt = `Create a ${duration}-second video script based on these frames:
    
    ${framesData}
    
    Requirements:
    - Write in a natural, conversational tone
    - Include timing markers
    - Ensure smooth transitions between sections
    - Keep within the ${duration}-second limit
    
    Format the response as a clean script with timing markers.`;

    // Get appropriate OpenAI client
    const { client: openai, userApiKeyId } = await getOpenAIClient(userId);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    // Update lastUsed if using user's API key
    if (userApiKeyId) {
      await updateApiKeyLastUsed(userApiKeyId);
    }

    const script = response.choices[0]?.message?.content || 'Script generation failed';
    
    res.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

// Endpoint for AI agent operations
router.post('/agent', async (req: AuthRequest, res: Response) => {
  try {
    const { command, context } = req.body;
    const userId = req.user?.userId || req.user?.id;
    
    if (!command) {
      return res.status(400).json({ 
        error: 'Command is required' 
      });
    }

    const systemPrompt = `You are an AI assistant helping with video content creation. Respond concisely and helpfully.`;
    
    const userPrompt = context 
      ? `Context: ${context}\n\nCommand: ${command}`
      : `Command: ${command}`;

    // Get appropriate OpenAI client
    const { client: openai, userApiKeyId } = await getOpenAIClient(userId);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // Update lastUsed if using user's API key
    if (userApiKeyId) {
      await updateApiKeyLastUsed(userApiKeyId);
    }

    const result = response.choices[0]?.message?.content || 'No response generated';
    
    res.json({ result });
  } catch (error) {
    console.error('Error processing agent command:', error);
    res.status(500).json({ error: 'Failed to process command' });
  }
});

// Endpoint for generating custom content
router.post('/generate-custom-content', async (req: AuthRequest, res: Response) => {
  try {
    const { model, messages, temperature, max_tokens } = req.body;
    const userId = req.user?.userId || req.user?.id;
    
    // Validate required fields
    if (!model || !messages) {
      return res.status(400).json({ 
        error: 'Missing required fields: model and messages are required' 
      });
    }

    // Validate messages is an array
    if (!Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages must be an array' 
      });
    }

    // Validate messages array is not empty
    if (messages.length === 0) {
      return res.status(400).json({ 
        error: 'Messages array cannot be empty' 
      });
    }

    // Validate message structure
    const isValidMessageStructure = messages.every((msg: any) => 
      typeof msg === 'object' && 
      msg !== null &&
      'role' in msg && 
      'content' in msg &&
      ['system', 'user', 'assistant'].includes(msg.role) &&
      typeof msg.content === 'string'
    );

    if (!isValidMessageStructure) {
      return res.status(400).json({ 
        error: 'Invalid message structure. Each message must have a role (system, user, or assistant) and content (string)' 
      });
    }

    // Validate temperature if provided
    if (temperature !== undefined && (typeof temperature !== 'number' || temperature < 0 || temperature > 2)) {
      return res.status(400).json({ 
        error: 'Temperature must be a number between 0 and 2' 
      });
    }

    // Validate max_tokens if provided
    if (max_tokens !== undefined && (typeof max_tokens !== 'number' || max_tokens < 1)) {
      return res.status(400).json({ 
        error: 'max_tokens must be a positive number' 
      });
    }

    // Validate model
    const validModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview', 'gpt-4o'];
    if (!validModels.includes(model)) {
      return res.status(400).json({ 
        error: `Invalid model. Supported models: ${validModels.join(', ')}` 
      });
    }

    // Get appropriate OpenAI client
    const { client: openai, userApiKeyId } = await getOpenAIClient(userId);
    
    // Call OpenAI with the provided parameters
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature !== undefined ? temperature : 0.7,
      max_tokens: max_tokens !== undefined ? max_tokens : 1000
    });
    
    // Update lastUsed if using user's API key
    if (userApiKeyId) {
      await updateApiKeyLastUsed(userApiKeyId);
    }

    const content = response.choices[0]?.message?.content || '';
    
    res.json({ content });
  } catch (error) {
    console.error('Error generating custom content:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(500).json({ error: 'AI service configuration error. Please configure your OpenAI API key in settings.' });
      }
      if (error.message.includes('rate limit')) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      }
      if (error.message.includes('model')) {
        return res.status(400).json({ error: 'Invalid model specified' });
      }
    }
    
    res.status(500).json({ error: 'Failed to generate custom content' });
  }
});

// Agent conversation endpoint
router.post('/agent/conversation', 
  // Make auth optional in development
  (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development' && !req.headers.authorization) {
      (req as any).user = { userId: 1, email: 'dev@example.com', username: 'dev' };
      return next();
    }
    authenticateToken(req, res, next);
  },
  createRateLimiter('ai'),
  async (req: AuthRequest, res: Response) => {
    try {
      console.log('Conversation endpoint called');
      console.log('User:', req.user);
      console.log('Body:', req.body);
      
      const { conversationId, message, agentType, context, history } = req.body;
      const userId = req.user?.userId || req.user?.id;
      
      // Validate inputs
      if (!message || !agentType) {
        return res.status(400).json({ error: 'Message and agent type are required' });
      }
      
      // We'll check for API key availability later when getting the client
      
      // Get user's channel profile if authenticated
      let channelProfile = null;
      if (userId) {
        const [profile] = await db
          .select()
          .from(channelProfiles)
          .where(eq(channelProfiles.userId, userId))
          .limit(1);
        channelProfile = profile;
      }
      
      // Build system prompt based on agent type
      let systemPrompt = '';
      
      switch (agentType) {
        case 'partner':
          systemPrompt = `You are Buzzy 🐝, the enthusiastic AI content creation partner for KeyFrames! You help creators build amazing videos by understanding their unique voice and audience.

Your personality:
- Friendly, energetic, and encouraging (like a supportive friend)
- Use bee puns occasionally but don't overdo it
- Professional but warm and approachable
- Show genuine excitement about their content ideas

${context?.isOnboarding ? `
ONBOARDING MODE - You're meeting a new creator! Follow these steps:

Step 1: Channel Basics
- Ask for their channel name
- What type of content excites them most
- Their content niche/category

Step 2: Target Audience
- Who watches their content (age, interests)
- What problems their audience faces
- What their audience desires/wants

Step 3: Goals & Vision
- Their channel goals (subscribers, impact, revenue)
- Upload schedule plans
- What makes their content unique

Step 4: Competition & Inspiration
- Channels they admire or compete with
- What they do differently/better
- Their unique value proposition

Step 5: Content Focus
- Main topics they'll cover
- Types of videos they'll create
- Key messages they want to share

After gathering info, help them choose the perfect skeleton structure for their first video based on their answers.

Important: Ask ONE question at a time, keep it conversational, and show enthusiasm about their responses!` : `

Regular conversation mode - help with content creation while referencing their channel profile when relevant.`}

${channelProfile ? `
CHANNEL PROFILE:
- Channel Name: ${channelProfile.channelName}
- Niche: ${channelProfile.niche}
- Content Types: ${channelProfile.contentTypes?.join(', ')}
- Target Audience: ${channelProfile.targetAudience}
- Goals: ${channelProfile.goals?.join(', ')}
- Unique Value: ${channelProfile.uniqueValue}

Use this information to provide personalized advice and suggestions that align with their channel's identity and goals.` : ''}`;
          break;
          
        case 'hook':
          systemPrompt = `You are the Hook Master, an expert in creating attention-grabbing openings for videos. You understand the psychology of stopping scrollers and know exactly how to craft hooks that compel viewers to keep watching.

Key principles:
- First 3 seconds are crucial
- Create curiosity gaps
- Use pattern interrupts
- Promise clear value
- Maximum 150 characters for hooks

${channelProfile ? `Channel Context: Creating hooks for ${channelProfile.channelName} (${channelProfile.niche}) targeting ${channelProfile.targetAudience}` : ''}`;
          break;
          
        case 'content':
          systemPrompt = `You are the Content Expert, specializing in creating engaging content journeys that keep viewers watching. You understand story structure, pacing, and how to deliver value while maintaining entertainment.

Focus on:
- Clear narrative flow
- Engaging examples
- Smooth transitions
- Value delivery
- Maximum 400 characters per frame

${channelProfile ? `Channel Context: Creating content for ${channelProfile.channelName} (${channelProfile.niche}) with focus on ${channelProfile.focusAreas?.join(', ')}` : ''}`;
          break;
          
        case 'cta':
          systemPrompt = `You are the CTA Expert, a master at crafting compelling calls-to-action that drive results. You know how to motivate viewers to take the next step without being pushy.

Expertise in:
- Clear next steps
- Value reinforcement  
- Urgency without pressure
- Multiple CTA options
- Maximum 200 characters

${channelProfile ? `Channel Context: CTAs for ${channelProfile.channelName} aligned with goals: ${channelProfile.goals?.join(', ')}` : ''}`;
          break;
          
        default:
          systemPrompt = `You are an AI assistant helping with ${agentType} content creation in the KeyFrames system.`;
      }
      
      // Add context to system prompt
      if (context) {
        systemPrompt += `\n\nCurrent context:
- Frame Type: ${context.frameType || 'Unknown'}
- Unit Type: ${context.unitType || 'Unknown'}
- Tone: ${context.tone || 'Not set'}
- Filter: ${context.filter || 'Not set'}`;
      }
      
      // Prepare messages for OpenAI
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map((msg: any) => ({
          role: msg.role === 'agent' ? 'assistant' : msg.role,
          content: msg.content
        })),
        { role: 'user', content: message }
      ];
      
      // Call OpenAI
      let responseContent = '';
      let extractedData = null;
      
      try {
        // Get appropriate OpenAI client
        const { client: openai, userApiKeyId } = await getOpenAIClient(userId);
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
          max_tokens: 500
        });
        
        // Update lastUsed if using user's API key
        if (userApiKeyId) {
          await updateApiKeyLastUsed(userApiKeyId);
        }
        
        responseContent = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
        
        // Simple data extraction for onboarding
        if (context?.isOnboarding && agentType === 'partner') {
          const currentStep = context.step || 0;
          extractedData = extractDataFromResponse(responseContent, currentStep, history);
        }
      } catch (openAIError: any) {
        console.error('OpenAI API error:', openAIError);
        if (openAIError.message && openAIError.message.includes('API key')) {
          responseContent = 'I need an OpenAI API key to help you. Please configure your API key in the settings.';
        } else {
          responseContent = 'I\'m having trouble connecting right now. Please try again in a moment.';
        }
      }
      
      // Always return a valid response
      res.json({
        content: responseContent,
        metadata: {
          agentType,
          conversationId,
          timestamp: new Date(),
          extractedData
        }
      });
      
    } catch (error: any) {
      console.error('Agent conversation error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Failed to process conversation',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Save channel profile endpoint
router.post('/channel-profile',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        console.error('User not found in request:', req.user);
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const profileData = req.body;
      
      // Check if profile already exists
      const existingProfile = await db
        .select()
        .from(channelProfiles)
        .where(eq(channelProfiles.userId, userId))
        .limit(1);
      
      if (existingProfile.length > 0) {
        // Update existing profile
        const [updatedProfile] = await db
          .update(channelProfiles)
          .set({
            ...profileData,
            updatedAt: new Date()
          })
          .where(eq(channelProfiles.userId, userId))
          .returning();
        
        res.json({ 
          success: true, 
          message: 'Channel profile updated successfully',
          profile: updatedProfile
        });
      } else {
        // Create new profile
        const [newProfile] = await db
          .insert(channelProfiles)
          .values({
            userId,
            ...profileData,
            hasCompletedOnboarding: true
          })
          .returning();
        
        res.json({ 
          success: true, 
          message: 'Channel profile created successfully',
          profile: newProfile
        });
      }
    } catch (error) {
      console.error('Channel profile error:', error);
      res.status(500).json({ error: 'Failed to save channel profile' });
    }
  }
);

// Get channel profile endpoint
router.get('/channel-profile',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        console.error('User not found in request:', req.user);
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const [profile] = await db
        .select()
        .from(channelProfiles)
        .where(eq(channelProfiles.userId, userId))
        .limit(1);
      
      res.json({ 
        profile: profile || null,
        hasCompletedOnboarding: !!profile
      });
    } catch (error) {
      console.error('Get channel profile error:', error);
      res.status(500).json({ error: 'Failed to retrieve channel profile' });
    }
  }
);

export default router;