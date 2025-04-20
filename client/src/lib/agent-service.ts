import OpenAI from "openai";
import { UNIT_CONSTRAINTS, FRAME_TYPE_PROMPTS } from './ai-service';
import { CustomGptAssistant } from './custom-gpt';

// Create OpenAI client with API key
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true
});

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
 */
export async function generateContentWithAgent(
  frameType: string,
  unitType: string,
  context: string,
  answers?: Record<string, string>,
  customAssistant?: CustomGptAssistant
): Promise<string> {
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
      content: userMessage
    });

    // Create a new thread for this content generation
    const thread = await openai.beta.threads.create();
    
    // Add messages to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage
    });

    // Run the assistant
    const assistantId = customAssistant?.id || "assistant_agent";
    const runParams: any = {
      assistant_id: assistantId,
      tools: contentGenerationTools,
    };

    // If using a custom ID, create a temporary assistant
    let temporaryAssistant;
    if (!customAssistant) {
      temporaryAssistant = await openai.beta.assistants.create({
        name: "Content Generation Assistant",
        instructions: systemMessage,
        tools: contentGenerationTools,
        model: "gpt-4o"
      });
      runParams.assistant_id = temporaryAssistant.id;
    }

    // Run the assistant
    let run = await openai.beta.threads.runs.create(thread.id, runParams);
    
    // Poll until the run completes
    while (run.status !== "completed" && run.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      // Handle tool calls if required
      if (run.status === "requires_action") {
        const toolCalls = run.required_action?.submit_tool_outputs.tool_calls || [];
        const toolOutputs: Array<{tool_call_id: string, output: string}> = [];
        
        for (const toolCall of toolCalls) {
          if (toolCall.function.name === "generate_content") {
            // Parse the arguments
            const args = JSON.parse(toolCall.function.arguments);
            
            // Use the content directly from the tool
            let content = args.content || "Could not generate content. Please try again.";
            
            // Ensure content doesn't exceed max length
            if (content.length > unitConstraints.maxLength) {
              content = content.substring(0, unitConstraints.maxLength) + "...";
            }
            
            // Add to tool outputs
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify({ success: true })
            });
            
            // Clean up temporary assistant if created
            if (temporaryAssistant) {
              await openai.beta.assistants.del(temporaryAssistant.id);
            }
            
            // Return the generated content
            return content;
          }
        }
        
        // Submit tool outputs if any
        if (toolOutputs.length > 0) {
          await openai.beta.threads.runs.submitToolOutputs(
            thread.id,
            run.id,
            { tool_outputs: toolOutputs }
          );
        }
      }
    }
    
    // If we get here, fallback to getting messages from the thread
    const messages_response = await openai.beta.threads.messages.list(thread.id);
    const assistant_messages = messages_response.data.filter(
      msg => msg.role === "assistant" && msg.content[0].type === "text"
    );
    
    // Get the latest assistant message
    let content = "";
    if (assistant_messages.length > 0) {
      const latestMessage = assistant_messages[0];
      content = latestMessage.content[0].type === "text" 
        ? latestMessage.content[0].text.value 
        : "Could not generate content. Please try again.";
    } else {
      content = "Could not generate content. Please try again.";
    }
    
    // Ensure content doesn't exceed max length
    if (content.length > unitConstraints.maxLength) {
      content = content.substring(0, unitConstraints.maxLength) + "...";
    }
    
    // Clean up temporary assistant if created
    if (temporaryAssistant) {
      await openai.beta.assistants.del(temporaryAssistant.id);
    }
    
    return content;
  } catch (error) {
    console.error('Error generating content with agent:', error);
    throw new Error('Failed to generate content with Agent 2.0. Please try again.');
  }
}

/**
 * Adapt content based on tone and filter using Agent 2.0
 */
export async function adaptContentWithAgent(
  content: string,
  tone: string,
  filter: string,
  unitType: string
): Promise<string> {
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
    
    // Create a new thread for this content adaptation
    const thread = await openai.beta.threads.create();
    
    // Add message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage
    });
    
    // Create temporary assistant
    const assistant = await openai.beta.assistants.create({
      name: "Content Adaptation Assistant",
      instructions: systemMessage,
      model: "gpt-4o"
    });
    
    // Run the assistant
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });
    
    // Poll until the run completes
    while (run.status !== "completed" && run.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    // Get the messages from the thread
    const messages_response = await openai.beta.threads.messages.list(thread.id);
    const assistant_messages = messages_response.data.filter(
      msg => msg.role === "assistant" && msg.content[0].type === "text"
    );
    
    // Get the latest assistant message
    let adaptedContent = content; // Default to original content
    if (assistant_messages.length > 0) {
      const latestMessage = assistant_messages[0];
      adaptedContent = latestMessage.content[0].type === "text" 
        ? latestMessage.content[0].text.value 
        : content;
    }
    
    // Ensure content doesn't exceed max length
    if (adaptedContent.length > unitConstraints.maxLength) {
      adaptedContent = adaptedContent.substring(0, unitConstraints.maxLength) + "...";
    }
    
    // Clean up temporary assistant
    await openai.beta.assistants.del(assistant.id);
    
    return adaptedContent;
  } catch (error) {
    console.error('Error adapting content with agent:', error);
    return content; // Return original content on error
  }
}