import { useCallback } from 'react';
import { useWorkspace } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { arrayMove } from '@dnd-kit/sortable';
import type { Frame } from '@/types';

export function useFrameMovement(skeletonId: string | null) {
  const { skeletons, updateFrameOrder, updateFrame } = useWorkspace();
  const { toast } = useToast();

  const moveFrame = useCallback((frameId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    if (!skeletonId) return { success: false, message: 'No skeleton selected' };

    const skeleton = skeletons.find(s => s.id === skeletonId);
    if (!skeleton) return { success: false, message: 'Skeleton not found' };

    const frameIndex = skeleton.frames.findIndex(f => f.id === frameId);
    if (frameIndex === -1) return { success: false, message: 'Frame not found' };

    const frame = skeleton.frames[frameIndex];
    const units = skeleton.units || [];

    // Handle vertical movement (up/down within same unit)
    if (direction === 'up' || direction === 'down') {
      const unitFrames = skeleton.frames.filter(f => f.unitType === frame.unitType);
      const unitFrameIndex = unitFrames.findIndex(f => f.id === frameId);

      if (direction === 'up' && unitFrameIndex > 0) {
        const targetFrame = unitFrames[unitFrameIndex - 1];
        const targetIndex = skeleton.frames.findIndex(f => f.id === targetFrame.id);
        const newFrames = arrayMove(skeleton.frames, frameIndex, targetIndex);
        updateFrameOrder(skeletonId, newFrames);

        toast({
          title: 'Frame moved up',
          description: `${frame.type} moved up in ${frame.unitType}`,
        });

        return { success: true, message: 'Moved up' };
      } else if (direction === 'down' && unitFrameIndex < unitFrames.length - 1) {
        const targetFrame = unitFrames[unitFrameIndex + 1];
        const targetIndex = skeleton.frames.findIndex(f => f.id === targetFrame.id);
        const newFrames = arrayMove(skeleton.frames, frameIndex, targetIndex);
        updateFrameOrder(skeletonId, newFrames);

        toast({
          title: 'Frame moved down',
          description: `${frame.type} moved down in ${frame.unitType}`,
        });

        return { success: true, message: 'Moved down' };
      }

      return { success: false, message: `Cannot move ${direction}` };
    }

    // Handle horizontal movement (left/right between units)
    if (direction === 'left' || direction === 'right') {
      const currentUnitIndex = units.findIndex(u => u === frame.unitType);
      const targetUnitIndex = direction === 'left' ? currentUnitIndex - 1 : currentUnitIndex + 1;

      if (targetUnitIndex >= 0 && targetUnitIndex < units.length) {
        const targetUnit = units[targetUnitIndex];
        
        // Update frame's unit type
        updateFrame(skeletonId, frameId, { unitType: targetUnit });

        toast({
          title: 'Frame moved to new unit',
          description: `${frame.type} moved to ${targetUnit}`,
        });

        // Scroll the unit into view
        setTimeout(() => {
          const unitElement = document.querySelector(`[data-unit-type="${targetUnit}"]`);
          unitElement?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }, 100);

        return { success: true, message: `Moved to ${targetUnit}` };
      }

      return { success: false, message: `Cannot move ${direction}` };
    }

    return { success: false, message: 'Invalid direction' };
  }, [skeletonId, skeletons, updateFrameOrder, updateFrame, toast]);

  const canMoveFrame = useCallback((frameId: string, direction: 'up' | 'down' | 'left' | 'right'): boolean => {
    if (!skeletonId) return false;

    const skeleton = skeletons.find(s => s.id === skeletonId);
    if (!skeleton) return false;

    const frame = skeleton.frames.find(f => f.id === frameId);
    if (!frame) return false;

    const units = skeleton.units || [];
    const unitFrames = skeleton.frames.filter(f => f.unitType === frame.unitType);
    const unitFrameIndex = unitFrames.findIndex(f => f.id === frameId);
    const currentUnitIndex = units.findIndex(u => u === frame.unitType);

    switch (direction) {
      case 'up':
        return unitFrameIndex > 0;
      case 'down':
        return unitFrameIndex < unitFrames.length - 1;
      case 'left':
        return currentUnitIndex > 0;
      case 'right':
        return currentUnitIndex < units.length - 1;
      default:
        return false;
    }
  }, [skeletonId, skeletons]);

  const duplicateFrame = useCallback((frameId: string) => {
    if (!skeletonId) return;

    const skeleton = skeletons.find(s => s.id === skeletonId);
    if (!skeleton) return;

    const frame = skeleton.frames.find(f => f.id === frameId);
    if (!frame) return;

    const newFrame: Frame = {
      ...frame,
      id: `frame-${Date.now()}`,
      content: frame.content ? `${frame.content} (Copy)` : 'Copy',
    };

    const frameIndex = skeleton.frames.findIndex(f => f.id === frameId);
    const newFrames = [...skeleton.frames];
    newFrames.splice(frameIndex + 1, 0, newFrame);

    updateFrameOrder(skeletonId, newFrames);

    toast({
      title: 'Frame duplicated',
      description: `${frame.type} has been duplicated`,
    });
  }, [skeletonId, skeletons, updateFrameOrder, toast]);

  return {
    moveFrame,
    canMoveFrame,
    duplicateFrame,
  };
}