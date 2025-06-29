export type AgentType = 
  | 'partner'      // Main content creation partner
  | 'hook'         // Hook/Intro specialist
  | 'content'      // Content journey expert
  | 'entertainment'// Entertainment specialist
  | 'howto'        // How-to guide expert
  | 'cta'          // Call-to-action expert
  | 'custom';      // User-created custom agent

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    frameId?: string;
    unitType?: string;
    actionType?: string;
    suggestions?: string[];
    promptSegment?: string;
    error?: string;
  };
}

export interface Conversation {
  id: string;
  agentType: AgentType;
  context?: {
    frameId?: string;
    unitType?: string;
    skeletonId?: string;
    tone?: string;
    filter?: string;
    channelProfile?: ChannelProfile;
  };
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface ChannelProfile {
  id: string;
  userId: string;
  name: string;
  niche: string;
  contentTypes: string[];
  targetAudience: AudiencePersona;
  inspirations: Inspiration[];
  goals: string[];
  focusAreas: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AudiencePersona {
  demographics: {
    ageRange?: string;
    location?: string[];
    interests?: string[];
  };
  painPoints: string[];
  desires: string[];
  behavior: string[];
}

export interface Inspiration {
  type: 'channel' | 'video' | 'creator';
  name: string;
  url?: string;
  notes?: string;
}

export interface WorkflowState {
  currentPhase: 'setup' | 'planning' | 'content' | 'review' | 'final';
  currentUnit?: string;
  currentFrame?: string;
  completedFrames: string[];
  aggregatedPrompts: PromptSegment[];
  scriptDraft?: string;
}

export interface PromptSegment {
  frameId: string;
  unitType: string;
  content: string;
  order: number;
}