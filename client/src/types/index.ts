export interface Frame {
  id: string;
  name?: string;       // Added name property to store the specific frame name
  type: string;
  content: string;
  tone?: string;
  filter?: string;
  unitType?: string; // For organizing frames under units
  script?: string;   // Added script property for AI-generated content
  isTemplateExample?: boolean; // Flag to prevent automatic AI adaptation for template examples
}

export interface Skeleton {
  id: string;
  name: string;
  frames: Frame[];
  tone?: string;
  filter?: string;
  units?: string[]; // Added units property to store the unit order
}

export interface WorkspaceState {
  skeletons: Skeleton[];
  activeSkeletonId: string | null;
  videoContexts: Record<string, string>; // Map of skeletonId to video context

  // Actions
  addSkeleton: (skeleton: Skeleton) => void;
  updateSkeleton: (id: string, skeleton: Partial<Skeleton>) => void;
  addFrame: (skeletonId: string, frame: Omit<Frame, 'id'>) => void;
  updateFrameOrder: (skeletonId: string, frames: Frame[]) => void;
  updateFrameTone: (skeletonId: string, frameId: string, tone: string) => void;
  updateFrameFilter: (skeletonId: string, frameId: string, filter: string) => void;
  setActiveSkeletonId: (id: string | null) => void;
  updateSkeletonUnits: (skeletonId: string, units: string[]) => void; // New action for unit reordering

  // Video context methods
  setVideoContext: (skeletonId: string, context: string) => void;
  getVideoContext: (skeletonId: string) => string;

  // Frame content methods
  updateFrameScript: (skeletonId: string, frameId: string, script: string) => void;
  updateFrameContent: (skeletonId: string, frameId: string, content: string) => void;
}