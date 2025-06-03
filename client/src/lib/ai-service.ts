import OpenAI from "openai";
import { SKELETON_UNITS } from './constants';
import { CustomGptAssistant } from './custom-gpt';
import { generateContentWithAgent, adaptContentWithAgent } from './agent-service';
import { creatorTemplates } from './creatorTemplates';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true
});

export const UNIT_CONSTRAINTS: Record<string, { maxLength: number; guidelines: string }> = {
  'Hook': {
    maxLength: 150,
    guidelines: `
- Must be delivered in under 5-7 seconds
- Should grab attention immediately
- Focus on one clear, compelling point
- Use strong, impactful language
- Create curiosity or urgency`
  },
  'Intro': {
    maxLength: 250,
    guidelines: `
- Set clear expectations
- Establish your authority/credibility
- Preview key value points
- Keep energy high but controlled`
  },
  'Content Journey': {
    maxLength: 400,
    guidelines: `
- Build progressive narrative
- Include specific examples/details
- Maintain consistent pacing
- Connect points logically`
  },
  'Rehook': {
    maxLength: 150,
    guidelines: `
- Re-engage audience attention
- Reference earlier hook/promise
- Create new curiosity
- Keep it punchy and brief`
  },
  'Outro': {
    maxLength: 200,
    guidelines: `
- Summarize key takeaways
- Clear call-to-action
- End with memorable statement
- Maintain energy through the end`
  }
};

const DEFAULT_CONSTRAINT = {
  maxLength: 300,
  guidelines: `
- Keep content focused and clear
- Include specific examples
- Maintain audience engagement
- End with a strong point`
};

// NEW: Unit-specific questions for each unit type
export const UNIT_SPECIFIC_QUESTIONS: Record<string, string[]> = {
  'Hook': [
    "What are the benefits of this video and why should the viewer stick around to watch it?",
    "What's the most surprising or unexpected thing about your content that will grab attention?",
    "What problem are you solving for the viewer in this video?"
  ],
  'Intro': [
    "What credibility or experience do you have that viewers should know?",
    "What are the main points you'll cover in this video?",
    "How will the viewer be different after watching this content?"
  ],
  'Content Journey': [
    "What are the key steps or points you want to cover?",
    "What examples or stories will you use to illustrate your points?",
    "What potential objections might viewers have and how will you address them?"
  ],
  'Rehook': [
    "What compelling point can you reintroduce to maintain viewer attention?",
    "What promise from your hook needs reinforcement at this point?",
    "What transition will keep viewers engaged for the remainder of the video?"
  ],
  'Outro': [
    "What specific action do you want viewers to take after watching?",
    "What key takeaways should viewers remember?",
    "How can you end with impact that reinforces your main message?"
  ]
};

const DEFAULT_UNIT_QUESTIONS = [
  "What's the main purpose of this unit in your content?",
  "What key information needs to be conveyed here?",
  "How does this connect to your overall content goals?"
];

// Keep the frame type prompts for content generation guidance
export const FRAME_TYPE_PROMPTS: Record<string, { prompt: string }> = {
  'Bold Statement': {
    prompt: `Create a bold, attention-grabbing statement that:
- Challenges common assumptions
- Uses powerful, decisive language
- Creates immediate interest
- Is specific and concrete
Keep it under 2-3 sentences.`
  },
  'Intriguing Question': {
    prompt: `Craft a thought-provoking question that:
- Sparks curiosity
- Relates to common experiences
- Has emotional resonance
- Encourages deeper thinking
Make it personal and engaging.`
  },
  'Promise of Value': {
    prompt: `Create a clear value proposition that:
- Highlights specific benefits
- Addresses a pain point
- Uses concrete numbers or results when possible
- Creates urgency without being pushy
Focus on what the audience will gain.`
  }
};

const DEFAULT_FRAME_TYPE = {
  prompt: `Create content that is:
- Engaging and memorable
- Clear and specific
- Relevant to the audience
- Action-oriented when appropriate
Keep it concise but impactful.`
};

// New function to use custom GPT assistants for content generation
export async function generateContentWithCustomGpt(
  assistant: CustomGptAssistant,
  context: string,
  frameType: string,
  unitType: string,
  answers?: Record<string, string>
): Promise<string> {
  try {
    const unitConstraints = UNIT_CONSTRAINTS[unitType] || DEFAULT_CONSTRAINT;
    const frameTypeData = FRAME_TYPE_PROMPTS[frameType] || DEFAULT_FRAME_TYPE;

    // Format rules as a bullet list
    const rulesText = assistant.rules.map(rule => `- ${rule}`).join('\n');

    // Format the answers if they exist
    const answersContext = answers 
      ? `Context from creator's answers:\n${Object.entries(answers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}`
      : '';

    // Create messages array with system prompt and examples
    const messages = [
      {
        role: "system" as const,
        content: assistant.systemPrompt
      }
    ];

    // Add examples as context if they exist
    if (assistant.examples && assistant.examples.length > 0) {
      for (const example of assistant.examples) {
        messages.push(
          {
            role: "user",
            content: example.input
          },
          {
            role: "assistant",
            content: example.output
          }
        );
      }
    }

    // Add the actual prompt
    messages.push({
      role: "user",
      content: `
Video Context: ${context}

${answersContext}

Create ${frameType} content for the ${unitType} section of a video.

Frame Type Guidelines: 
${frameTypeData.prompt}

Unit Type Guidelines:
${unitConstraints.guidelines}

Custom Assistant Rules:
${rulesText}

Maximum Length: ${unitConstraints.maxLength} characters

Generate engaging, authentic content for this section now:
`
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 200
    });

    let content = completion.choices[0].message.content || "Could not generate content. Please try again.";

    if (content.length > unitConstraints.maxLength) {
      content = content.substring(0, unitConstraints.maxLength) + "...";
    }

    return content;
  } catch (error) {
    console.error('Error generating content with custom GPT:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

// Enhanced content adaptation with more sophisticated tone and filter processing
export async function adaptFrameContent(
  content: string,
  tone: string,
  filter: string,
  frameType: string,
  unitType: string,
  answers?: Record<string, string> // Answers to unit-specific questions
): Promise<string> {
  // First, check if we have content to adapt
  if (!content || content.trim() === '') {
    throw new Error('No content provided to adapt');
  }

  try {
    // Use the Agent 2.0 implementation for content adaptation
    return await adaptContentWithAgent(content, tone, filter, unitType);
  } catch (error) {
    console.error('Error adapting content with Agent 2.0:', error);

    // Fallback to the legacy implementation if Agent 2.0 fails
    try {
      const frameTypeData = FRAME_TYPE_PROMPTS[frameType] || DEFAULT_FRAME_TYPE;
      const answersContext = answers 
        ? `Unit-specific context based on answers:
${Object.entries(answers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}`
        : '';

      const prompt = `
Original Content: "${content}"

${answersContext}

Tone Adjustment (${tone}):
- Adapt emotional resonance and delivery style
- Use language that reflects the tone while maintaining authenticity
- Ensure tone supports the frame's purpose

Style Filter (${filter}):
- Apply ${filter} stylistic elements
- Enhance presentation while preserving core message
- Maintain natural flow and authenticity

Frame Type: ${frameType}
${frameTypeData.prompt}

Unit Type: ${unitType}
${UNIT_CONSTRAINTS[unitType]?.guidelines || DEFAULT_CONSTRAINT.guidelines}

Generate adapted content that:
- Incorporates unit-specific context
- Applies tone and style adjustments
- Maintains original message integrity
- Stays within character limit

Response:`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system" as const,
            content: "You are an expert content adapter, skilled at maintaining core messages while adjusting tone and style. Your adaptations should feel natural and enhance the original content's impact."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const adaptedContent = completion.choices[0].message.content || content;
      const unitConstraints = UNIT_CONSTRAINTS[unitType] || DEFAULT_CONSTRAINT;

      if (adaptedContent.length > unitConstraints.maxLength) {
        return adaptedContent.substring(0, unitConstraints.maxLength) + "...";
      }

      return adaptedContent;
    } catch (fallbackError) {
      console.error('Error in fallback content adaptation:', fallbackError);
      return content; // Return original content on error
    }
  }
}

export async function generateFrameContent(
  frameType: string,
  unitType: string,
  context: string,
  answers?: Record<string, string> ,
  customAssistant?: CustomGptAssistant
): Promise<string> {
  try {
    // Use the Agent 2.0 implementation for content generation
    return generateContentWithAgent(frameType, unitType, context, answers, customAssistant);
  } catch (error) {
    console.error('Error generating content with Agent 2.0:', error);

    // Fallback to the legacy implementation if Agent 2.0 fails
    try {
      const frameTypeData = FRAME_TYPE_PROMPTS[frameType] || DEFAULT_FRAME_TYPE;
      const unitConstraints = UNIT_CONSTRAINTS[unitType] || DEFAULT_CONSTRAINT;

      const answersContext = answers 
        ? `Unit-specific context based on answers:
${Object.entries(answers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}`
        : '';

      if (customAssistant) {
        return generateContentWithCustomGpt(customAssistant, context, frameType, unitType, answers);
      } else {
        const prompt = `
Video Context: ${context}

${answersContext}

Frame Type: ${frameType}
${frameTypeData.prompt}

Unit Type: ${unitType}
${unitConstraints.guidelines}

Maximum Length: ${unitConstraints.maxLength} characters

Generate the content using the above constraints and context:`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a professional content creation assistant, specializing in creating engaging video content scripts. Your outputs should be concise, impactful, and perfectly tailored to the specific frame type, unit type, and video context."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        });

        let content = completion.choices[0].message.content || "Could not generate content. Please try again.";

        if (content.length > unitConstraints.maxLength) {
          content = content.substring(0, unitConstraints.maxLength) + "...";
        }

        return content;
      }
    } catch (fallbackError) {
      console.error('Error in fallback content generation:', fallbackError);
      throw new Error('Failed to generate content. Please try again.');
    }
  }
}

// Helper function to get unit-specific questions
export function getUnitQuestions(unitType: string): string[] {
  return UNIT_SPECIFIC_QUESTIONS[unitType] || DEFAULT_UNIT_QUESTIONS;
}

// Combined method to get all unit type questions together
export function getAllUnitQuestions(): Record<string, string[]> {
  return UNIT_SPECIFIC_QUESTIONS;
}