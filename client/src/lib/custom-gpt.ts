import { FRAME_CATEGORIES, CONTENT_SUBCATEGORIES } from './frameLibrary';
import { nanoid } from 'nanoid';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Define the structure for custom GPT assistants
export interface CustomGptAssistant {
  id: string;
  name: string;
  description: string;
  unitType: string;    // Which unit type this assistant is for (Hook, Content, Outro)
  subType?: string;    // Optional subtype for content (e.g., Informational, Storytelling)
  systemPrompt: string; // The system message for the assistant
  examples: CustomGptExample[];
  rules: string[];     // Guidelines or rules for the assistant to follow
  createdAt: string;
  updatedAt: string;
}

// Examples to help train the assistant
export interface CustomGptExample {
  id: string;
  input: string;      // Example user input or context
  output: string;     // Example assistant response
}

// Default system prompts for each unit type
export const DEFAULT_SYSTEM_PROMPTS: Record<string, string> = {
  'Hook': `You are an expert hook writer for video content. 
Your goal is to create attention-grabbing hooks that instantly capture viewer interest.
Focus on being concise, surprising, and creating curiosity that compels viewers to keep watching.`,

  'Content': `You are an expert content strategist for video creators.
Your goal is to craft engaging, clear, and value-packed content sections.
Focus on maintaining viewer interest while delivering key information in an accessible way.`,

  'Outro': `You are an expert at creating powerful video conclusions.
Your goal is to craft engaging outros that reinforce key messages and drive viewer action.
Focus on summarizing value, creating memorable final impressions, and clear calls to action.`,
};

// Initial example templates for each unit type
export const INITIAL_EXAMPLES: Record<string, CustomGptExample[]> = {
  'Hook': [
    {
      id: nanoid(),
      input: "Create a hook for a video about productivity tips for remote workers",
      output: "The average remote worker wastes 2 hours daily on distractions – but that's about to change. In the next 5 minutes, I'll show you the three counter-intuitive techniques that helped me double my output while working less."
    },
    {
      id: nanoid(),
      input: "Generate a surprising hook for a fitness video targeting beginners",
      output: "Did you know that 83% of fitness beginners quit within two weeks? I was one of them – six times in a row. But then I discovered a psychological hack that made consistent exercise almost automatic, and I haven't missed a workout in 3 years."
    }
  ],
  'Content': [
    {
      id: nanoid(),
      input: "Create a content section explaining the benefits of meditation",
      output: "Let's break down exactly what happens in your brain when you meditate regularly. First, your prefrontal cortex – responsible for focus and decision-making – actually becomes more active over time. This is why longtime meditators report fewer 'mental tabs' open and sharper concentration. Second, your amygdala – the brain's stress center – shows reduced activity, explaining the documented 31% drop in anxiety levels after just 8 weeks of consistent practice."
    },
    {
      id: nanoid(),
      input: "Write a content section for explaining how to use a DSLR camera",
      output: "Let's get hands-on with your camera settings. Aperture controls how much light enters your lens, shown as f-numbers like f/1.8 or f/11. Lower numbers create that beautiful background blur photographers love. Watch what happens when I adjust from f/16 to f/2.8 – see how the background gets creamy while our subject stays sharp? This is your secret weapon for professional-looking portraits."
    }
  ],
  'Outro': [
    {
      id: nanoid(),
      input: "Create an outro for a video about investing for beginners",
      output: "So there you have it – the three fundamental principles that can transform you from a financial novice to a confident investor. Remember: start small, stay consistent, and let compound interest work its magic. If you implement just the asset allocation strategy we covered today, you'll already be ahead of 70% of beginners. Drop a comment with your first investment goal, and I'll personally respond with tailored advice. And if you want my free Investment Starter Kit with all the templates we discussed, click the link in the description."
    },
    {
      id: nanoid(),
      input: "Generate an outro for a cooking tutorial video",
      output: "And just like that, you've mastered a restaurant-quality pasta dish that costs less than $5 per serving. Take a photo when you make this at home – I genuinely get excited seeing your creations. If you enjoyed this simplified cooking approach, hit subscribe for a new 15-minute recipe every Tuesday. Until next time, remember: amazing food doesn't need to be complicated. Happy cooking!"
    }
  ]
};

// Initial rule templates for each unit type
export const INITIAL_RULES: Record<string, string[]> = {
  'Hook': [
    "Always create a sense of urgency or curiosity within the first 5 seconds",
    "Include a promise of value that will be delivered in the video",
    "Keep hooks under 20 seconds (approximately 40-60 words)",
    "Address potential objections or skepticism proactively",
    "Use concrete numbers or statistics when possible for credibility"
  ],
  'Content': [
    "Structure content with clear transitions between points",
    "Include specific examples, stories, or demonstrations",
    "Anticipate and address viewer questions as you explain",
    "Balance information density with engaging delivery",
    "Use analogies to simplify complex concepts"
  ],
  'Outro': [
    "Reinforce the main value proposition or key takeaways",
    "Include a clear, specific call-to-action",
    "Express gratitude for viewer attention",
    "Create a sense of community or ongoing relationship",
    "End with a memorable statement or question"
  ]
};

// Create default custom GPT assistants
export function createDefaultAssistants(): CustomGptAssistant[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: nanoid(),
      name: "Hook Specialist",
      description: "Expert at creating attention-grabbing video hooks",
      unitType: FRAME_CATEGORIES.HOOK,
      systemPrompt: DEFAULT_SYSTEM_PROMPTS['Hook'],
      examples: [...INITIAL_EXAMPLES['Hook']],
      rules: [...INITIAL_RULES['Hook']],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: nanoid(),
      name: "Content Expert",
      description: "Specialized in crafting engaging video content sections",
      unitType: FRAME_CATEGORIES.CONTENT,
      systemPrompt: DEFAULT_SYSTEM_PROMPTS['Content'],
      examples: [...INITIAL_EXAMPLES['Content']],
      rules: [...INITIAL_RULES['Content']],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: nanoid(),
      name: "Outro Specialist",
      description: "Focused on creating powerful video conclusions and calls-to-action",
      unitType: FRAME_CATEGORIES.OUTRO,
      systemPrompt: DEFAULT_SYSTEM_PROMPTS['Outro'],
      examples: [...INITIAL_EXAMPLES['Outro']],
      rules: [...INITIAL_RULES['Outro']],
      createdAt: now,
      updatedAt: now,
    }
  ];
}

// Custom hook to manage GPT assistants
export function useCustomGptAssistants() {
  const [assistants, setAssistants] = useLocalStorage<CustomGptAssistant[]>(
    'custom-gpt-assistants',
    [] // Initial empty array, we'll check and populate defaults
  );

  // Initialize with default assistants if none exist
  const initializeDefaultAssistants = () => {
    if (assistants.length === 0) {
      setAssistants(createDefaultAssistants());
    }
  };

  // Add a new assistant
  const addAssistant = (assistant: Omit<CustomGptAssistant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAssistant: CustomGptAssistant = {
      ...assistant,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    
    setAssistants([...assistants, newAssistant]);
    return newAssistant;
  };

  // Update an existing assistant
  const updateAssistant = (id: string, updates: Partial<Omit<CustomGptAssistant, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updatedAssistants = assistants.map(assistant => {
      if (assistant.id === id) {
        return {
          ...assistant,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return assistant;
    });
    
    setAssistants(updatedAssistants);
  };

  // Delete an assistant
  const deleteAssistant = (id: string) => {
    setAssistants(assistants.filter(assistant => assistant.id !== id));
  };

  // Get assistants by unit type
  const getAssistantsByUnitType = (unitType: string) => {
    return assistants.filter(assistant => assistant.unitType === unitType);
  };

  // Get a specific assistant
  const getAssistant = (id: string) => {
    return assistants.find(assistant => assistant.id === id);
  };

  return {
    assistants,
    initializeDefaultAssistants,
    addAssistant,
    updateAssistant,
    deleteAssistant,
    getAssistantsByUnitType,
    getAssistant
  };
}
