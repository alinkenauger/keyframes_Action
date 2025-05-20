export type ContentType = 'short' | 'long';

export interface Frame {
  id: string;
  name: string;
  type: string;
  content: string;
  unitType: string;
  tone?: string;
  filter?: string;
  transition?: 'smooth' | 'pattern-interrupt' | 'content-shift';
  script?: string;
  isTemplateExample?: boolean;
}

export interface Skeleton {
  id: string;
  name: string;
  frames: Frame[];
  units?: string[];
  contentType?: ContentType;
}

export interface WorkspaceState {
  skeletons: Skeleton[];
  activeSkeletonId: string | null;
  videoContexts: Record<string, string>;
  
  addSkeleton: (skeleton: Skeleton) => Skeleton;
  setVideoContext: (skeletonId: string, context: string) => void;
  getVideoContext: (skeletonId: string) => string;
  updateSkeleton: (id: string, skeleton: Partial<Skeleton>) => void;
  addFrame: (skeletonId: string, frame: Omit<Frame, 'id'>) => void;
  updateFrameOrder: (skeletonId: string, frames: Frame[]) => void;
  updateFrameTone: (skeletonId: string, frameId: string, tone: string) => void;
  updateFrameFilter: (skeletonId: string, frameId: string, filter: string) => void;
  updateContentType: (skeletonId: string, contentType: ContentType) => void;
  updateFrameScript: (skeletonId: string, frameId: string, script: string) => void;
  updateFrameContent: (skeletonId: string, frameId: string, content: string) => void;
  updateFrameTransition: (skeletonId: string, frameId: string, transition: 'smooth' | 'pattern-interrupt' | 'content-shift') => void;
  updateSkeletonUnits: (skeletonId: string, units: string[]) => void;
  setActiveSkeletonId: (id: string | null) => void;
}