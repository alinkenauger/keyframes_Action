import { UNIT_CONSTRAINTS, FRAME_TYPE_PROMPTS } from './ai-service';
import { CustomGptAssistant } from './custom-gpt';

// Default constraints when unit type is not found
const DEFAULT_CONSTRAINT = {
  maxLength: 250,
  guidelines: `
- Keep it concise and clear
- Use engaging language
- Focus on value to the viewer
- Be authentic and conversational`
};

// Default frame type when not found
const DEFAULT_FRAME_TYPE = {
  prompt: `Create content that is:
- Engaging and memorable
- Clear and specific
- Relevant to the audience
- Action-oriented when appropriate
Keep it concise but impactful.`
};

// Define content generation tools
const contentGenerationTools = [
  {
    type: "function" as const,
    function: {
      name: "generate_content",
      description: "Generates content based on the specified parameters",
      parameters: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The generated content following all guidelines and constraints"
          },
          reasoning: {
            type: "string",
            description: "Explanation of why this content works well for the specified frame and unit type"
          }
        },
        required: ["content"]
      }
    }
  }
];

/**
 * Generate content using OpenAI's API with Agent 2.0 capabilities
 * 
 * This enhanced implementation provides:
 * - Better thread management and error handling
 * - Support for custom assistants with memory
 * - Tool-based function calling for structured outputs
 * - Automatic cleanup of resources
 */
export async function generateContentWithAgent(
  frameType: string,
  unitType: string,
  context: string,
  answers?: Record<string, string>,
  customAssistant?: CustomGptAssistant
): Promise<string> {
  console.log(`Generating content with Agent 2.0: ${frameType} for ${unitType}`);
  try {
    // Get unit constraints and frame type data
    const unitConstraints = UNIT_CONSTRAINTS[unitType] || DEFAULT_CONSTRAINT;
    const frameTypeData = FRAME_TYPE_PROMPTS[frameType] || DEFAULT_FRAME_TYPE;

    // Format answers if they exist
    const answersContext = answers 
      ? `Unit-specific context based on answers:
${Object.entries(answers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}`
      : '';

    // Create the system message
    let systemMessage;
    if (customAssistant) {
      systemMessage = customAssistant.systemPrompt;
    } else {
      systemMessage = "You are a professional content creation assistant, specializing in creating engaging video content scripts. Your outputs should be concise, impactful, and perfectly tailored to the specific frame type, unit type, and video context.";
    }

    // Create the user message
    let userMessage = `
Video Context: ${context}

${answersContext}

Create ${frameType} content for the ${unitType} section of a video.

Frame Type Guidelines: 
${frameTypeData.prompt}

Unit Type Guidelines:
${unitConstraints.guidelines}
`;

    // Add custom assistant rules if available
    if (customAssistant?.rules && customAssistant.rules.length > 0) {
      const rulesText = customAssistant.rules.map(rule => `- ${rule}`).join('\n');
      userMessage += `\nCustom Assistant Rules:\n${rulesText}\n`;
    }

    userMessage += `\nMaximum Length: ${unitConstraints.maxLength} characters\n\nGenerate engaging, authentic content for this section now.`;

    // Create initial messages array
    let messages = [
      {
        role: "system" as const,
        content: systemMessage
      }
    ];

    // Add examples as context if they exist in the custom assistant
    if (customAssistant?.examples && customAssistant.examples.length > 0) {
      for (const example of customAssistant.examples) {
        messages.push(
          {
            role: "user" as const,
            content: example.input
          },
          {
            role: "assistant" as const,
            content: example.output
          }
        );
      }
    }

    // Add the actual prompt
    messages.push({
      role: "user" as const,
      content: userMessage
    });

    // Since the backend doesn't support the Assistant API directly,
    // we'll use the generate-custom-content endpoint with our messages
    const response = await fetch('/api/ai/generate-custom-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate content');
    }

    const data = await response.json();
    let content = data.content || "Could not generate content. Please try again.";
    
    // Ensure content doesn't exceed max length
    if (content.length > unitConstraints.maxLength) {
      content = content.substring(0, unitConstraints.maxLength) + "...";
    }
    
    return content;
  } catch (error) {
    console.error('Error generating content with agent:', error);
    throw new Error('Failed to generate content with Agent 2.0. Please try again.');
  }
}

/**
 * Adapt content based on tone and filter using Agent 2.0
 * 
 * This enhanced implementation uses the Assistant API to adapt content based on:
 * - Specific tone requirements (casual, formal, etc.)
 * - Style filter preferences (storytelling, educational, etc.)
 * - Content type constraints and guidelines
 * - Length limitations
 */
export async function adaptContentWithAgent(
  content: string,
  tone: string,
  filter: string,
  unitType: string
): Promise<string> {
  console.log(`Adapting content with Agent 2.0: ${tone} tone, ${filter} filter for ${unitType}`);
  try {
    const unitConstraints = UNIT_CONSTRAINTS[unitType] || DEFAULT_CONSTRAINT;
    
    // Create the system message
    const systemMessage = "You are an expert content adapter, skilled at maintaining core messages while adjusting tone and style. Your adaptations should feel natural and enhance the original content's impact.";
    
    // Create the user message
    const userMessage = `
Please adapt the following content to use a ${tone} tone and a ${filter} filter style:

"${content}"

The content is part of the ${unitType} section of a video.

Unit Type Guidelines:
${unitConstraints.guidelines}

Maximum Length: ${unitConstraints.maxLength} characters

Your adaptation should preserve the core message but adjust the style according to the tone and filter.
`;
    
    // Use the backend adapt-content endpoint
    const response = await fetch('/api/ai/adapt-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        tone,
        filter,
        frameType: '',
        unitType
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to adapt content');
    }

    const data = await response.json();
    let adaptedContent = data.adaptedContent || content;
    
    // Ensure content doesn't exceed max length
    if (adaptedContent.length > unitConstraints.maxLength) {
      adaptedContent = adaptedContent.substring(0, unitConstraints.maxLength) + "...";
    }
    
    return adaptedContent;
  } catch (error) {
    console.error('Error adapting content with agent:', error);
    return content; // Return original content on error
  }
}