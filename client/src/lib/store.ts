import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { WorkspaceState, Skeleton, Frame } from '@/types';

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  skeletons: [],
  activeSkeletonId: null,
  videoContexts: {}, // Map of skeletonId to video context

  addSkeleton: (skeleton) => {
    const newSkeleton = { ...skeleton };
    set((state) => ({
      skeletons: [...state.skeletons, newSkeleton],
    }));
    return newSkeleton;
  },

  setVideoContext: (skeletonId: string, context: string) => set((state) => ({
    videoContexts: {
      ...state.videoContexts,
      [skeletonId]: context
    }
  })),

  getVideoContext: (skeletonId: string) => {
    return get().videoContexts[skeletonId] || '';
  },

  updateSkeleton: (id, skeleton) => set((state) => ({
    skeletons: state.skeletons.map((s) =>
      s.id === id ? { ...s, ...skeleton } : s
    ),
  })),

  addFrame: (skeletonId, frame) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? { ...skeleton, frames: [...skeleton.frames, { ...frame, id: nanoid() }] }
        : skeleton
    ),
  })),

  updateFrameOrder: (skeletonId, frames) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? { ...skeleton, frames }
        : skeleton
    ),
  })),

  updateFrameTone: (skeletonId, frameId, tone) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? {
            ...skeleton,
            frames: skeleton.frames.map((frame) =>
              frame.id === frameId ? { ...frame, tone } : frame
            ),
          }
        : skeleton
    ),
  })),

  updateFrameFilter: (skeletonId, frameId, filter) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? {
            ...skeleton,
            frames: skeleton.frames.map((frame) =>
              frame.id === frameId ? { ...frame, filter } : frame
            ),
          }
        : skeleton
    ),
  })),
  
  updateContentType: (skeletonId, contentType) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? { ...skeleton, contentType }
        : skeleton
    ),
  })),

  updateFrameScript: (skeletonId: string, frameId: string, script: string) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? {
            ...skeleton,
            frames: skeleton.frames.map((frame) =>
              frame.id === frameId ? { ...frame, script } : frame
            ),
          }
        : skeleton
    ),
  })),

  updateFrameContent: (skeletonId: string, frameId: string, content: string) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? {
            ...skeleton,
            frames: skeleton.frames.map((frame) =>
              frame.id === frameId ? { ...frame, content } : frame
            ),
          }
        : skeleton
    ),
  })),
  
  updateFrameTransition: (skeletonId: string, frameId: string, transition: 'smooth' | 'pattern-interrupt' | 'content-shift') => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? {
            ...skeleton,
            frames: skeleton.frames.map((frame) =>
              frame.id === frameId ? { ...frame, transition } : frame
            ),
          }
        : skeleton
    ),
  })),

  // New function to update the units array of a skeleton
  updateSkeletonUnits: (skeletonId: string, units: string[]) => set((state) => ({
    skeletons: state.skeletons.map((skeleton) =>
      skeleton.id === skeletonId
        ? { ...skeleton, units }
        : skeleton
    ),
  })),

  setActiveSkeletonId: (id) => set({ activeSkeletonId: id }),
}));