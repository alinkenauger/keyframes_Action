import OpenAI from "openai";
import { Skeleton, Frame } from '@/types';
import { SKELETON_UNITS, TONES, FILTERS } from './constants';

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true
});

// Interface for B-roll recommendations
export interface BRollRecommendation {
  description: string;
  purpose: string;
  timing: string;
}

// Interface for transition recommendations
export interface TransitionRecommendation {
  description: string;
  type: 'smooth' | 'pattern-interrupt' | 'content-shift';
  visualEffect?: string;
  audioEffect?: string;
}

// Interface for script section
export interface ScriptSection {
  frameId: string;
  frameType: string;
  content: string;
  voiceDirection: string;
  bRoll: BRollRecommendation[];
  transition?: TransitionRecommendation;
}

// Interface for complete script
export interface VideoScript {
  title: string;
  description: string;
  targetDuration: string;
  sections: ScriptSection[];
  hooks: {
    thumbnail: string[];
    title: string[];
  };
  notes: string[];
}

// Function to organize frames into a clear unit structure
function organizeFramesByUnit(skeleton: Skeleton): Record<string, Frame[]> {
  const framesByUnit: Record<string, Frame[]> = {};
  
  // Initialize units with empty arrays
  SKELETON_UNITS.forEach(unit => {
    framesByUnit[unit] = [];
  });
  
  // Organize frames
  skeleton.frames.forEach(frame => {
    if (frame.unitType && SKELETON_UNITS.includes(frame.unitType)) {
      framesByUnit[frame.unitType].push(frame);
    }
  });
  
  return framesByUnit;
}

// Get transition between two frames
function determineTransition(currentFrame: Frame, nextFrame: Frame | null): TransitionRecommendation | undefined {
  if (!nextFrame) return undefined;
  
  const type = currentFrame.transition || 'smooth';
  
  return {
    description: `Transition from ${currentFrame.type} to ${nextFrame.type}`,
    type: type
  };
}

/**
 * Generates a complete video script based on a skeleton
 * Includes:
 * - Actual script content for each frame
 * - B-roll recommendations
 * - Smooth transitions between frames
 * - Timing recommendations
 * - Title and thumbnail suggestions
 */
export async function generateVideoScript(skeleton: Skeleton): Promise<VideoScript> {
  try {
    const videoContext = skeleton.name || "Video";
    const framesByUnit = organizeFramesByUnit(skeleton);
    
    // Build context for the script generation
    const scriptContext = {
      videoTitle: skeleton.name,
      videoTone: skeleton.tone || "Conversational",
      videoFilter: skeleton.filter || "Educational",
      units: Object.entries(framesByUnit).map(([unitType, frames]) => ({
        type: unitType,
        frames: frames.map(frame => ({
          id: frame.id,
          type: frame.type,
          name: frame.name,
          content: frame.content,
          tone: frame.tone || skeleton.tone,
          filter: frame.filter || skeleton.filter,
          transition: frame.transition
        }))
      }))
    };

    // Prompt for the AI to generate the script
    const prompt = `
    You are an expert YouTube scriptwriter with experience in creating engaging, professional video scripts.
    
    I need you to create a complete video script based on this content structure:
    
    ${JSON.stringify(scriptContext, null, 2)}
    
    For each frame, provide:
    1. Natural-sounding dialogue that fits the tone/filter
    2. Voice direction (emotion, pace, emphasis)
    3. 2-3 B-roll recommendations with timing
    4. Smooth transitions between frames based on the transition type
    
    Also provide:
    - An optimized title for the video
    - A compelling description
    - Target duration (recommended natural length between 5-20 minutes)
    - 3 thumbnail suggestions
    - 3 title variations
    
    The script should flow naturally, consider the transition types:
    - "smooth": Natural progression with connecting words/ideas
    - "pattern-interrupt": Surprising direction change to regain attention
    - "content-shift": Clear topic change with appropriate transition phrase
    
    Format your response as structured JSON following this format exactly:
    {
      "title": "Main video title",
      "description": "SEO-optimized description",
      "targetDuration": "X minutes",
      "sections": [
        {
          "frameId": "id",
          "frameType": "type",
          "content": "Actual script content to read",
          "voiceDirection": "How to deliver this section",
          "bRoll": [
            {
              "description": "Visual to show",
              "purpose": "Why this shot works",
              "timing": "When to show this"
            }
          ],
          "transition": {
            "description": "How to transition to next section",
            "type": "transition-type",
            "visualEffect": "Optional visual transition technique",
            "audioEffect": "Optional audio transition technique"
          }
        }
      ],
      "hooks": {
        "thumbnail": ["Thumbnail idea 1", "Thumbnail idea 2", "Thumbnail idea 3"],
        "title": ["Title variation 1", "Title variation 2", "Title variation 3"]
      },
      "notes": ["Additional notes or recommendations"]
    }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert YouTube scriptwriter and video strategist." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Failed to generate script: No content in response");
    }

    try {
      return JSON.parse(responseContent) as VideoScript;
    } catch (e) {
      console.error("Failed to parse script JSON:", e);
      throw new Error("The script was generated but couldn't be properly formatted");
    }
  } catch (error) {
    console.error("Script generation error:", error);
    throw new Error(`Failed to generate video script: ${error.message}`);
  }
}

/**
 * Adjust the script length to target a specific duration
 * Can expand or compress the script while maintaining quality
 */
export async function adjustScriptLength(
  script: VideoScript, 
  targetDuration: string
): Promise<VideoScript> {
  try {
    const prompt = `
    You are an expert YouTube scriptwriter. I have a video script that I need to adjust to be approximately ${targetDuration} in length.
    
    Original script:
    ${JSON.stringify(script, null, 2)}
    
    Please adjust the script content to target a ${targetDuration} duration while:
    1. Maintaining the overall flow and key points
    2. Keeping the same frame structure
    3. Adjusting content length proportionally across all sections
    4. Preserving the tone and style
    
    If expanding:
    - Add more detail, examples, or stories
    - Elaborate on complex points
    - Include more specifics and context
    
    If condensing:
    - Focus on the most essential points
    - Tighten language to be more concise
    - Remove redundancies while keeping key information
    
    Format the response as the same JSON structure as the input.
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert YouTube scriptwriter and video editor." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Failed to adjust script: No content in response");
    }

    try {
      return JSON.parse(responseContent) as VideoScript;
    } catch (e) {
      console.error("Failed to parse adjusted script JSON:", e);
      throw new Error("The script was adjusted but couldn't be properly formatted");
    }
  } catch (error) {
    console.error("Script adjustment error:", error);
    throw new Error(`Failed to adjust video script: ${error.message}`);
  }
}