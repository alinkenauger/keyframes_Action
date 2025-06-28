import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import SkeletonUnit from './SkeletonUnit';
import type { Frame as FrameType } from '@/types';

interface SimpleDraggableUnitProps {
  unit: {
    id: string;
    name: string;
    frames: FrameType[];
  };
  index: number;
  onDragStart: (unitId: string, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (targetIndex: number) => void;
  isDragging: boolean;
  dragOverIndex: number | null;
  onDeleteFrame?: (frameId: string) => void;
  onReorderFrames?: (fromId: string, toId: string, unitType: string) => void;
  onDuplicateUnit?: (unitName: string) => void;
  onDeleteUnit?: (unitName: string) => void;
  selectedFrameId?: string | null;
  onSelectFrame?: (frameId: string) => void;
}

export function SimpleDraggableUnit({
  unit,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  dragOverIndex,
  onDeleteFrame,
  onReorderFrames,
  onDuplicateUnit,
  onDeleteUnit,
  selectedFrameId,
  onSelectFrame
}: SimpleDraggableUnitProps) {
  const [showHandle, setShowHandle] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(unit.id, index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(index);
  };

  return (
    <div
      className={cn(
        "relative group h-full",
        isDragging && "opacity-50",
        dragOverIndex === index && "ring-2 ring-primary"
      )}
      onMouseEnter={() => setShowHandle(true)}
      onMouseLeave={() => setShowHandle(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag handle */}
      <div
        draggable
        onDragStart={handleDragStart}
        className={cn(
          "absolute left-0 top-2 z-30 cursor-grab active:cursor-grabbing",
          "bg-white dark:bg-gray-800 border rounded-md shadow-sm",
          "p-1.5 opacity-0 transition-opacity",
          showHandle && "opacity-100"
        )}
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>

      <SkeletonUnit
        {...unit}
        onDeleteFrame={onDeleteFrame}
        onReorderFrames={onReorderFrames}
        onDuplicateUnit={onDuplicateUnit}
        onDeleteUnit={onDeleteUnit}
        selectedFrameId={selectedFrameId}
        onSelectFrame={onSelectFrame}
      />
    </div>
  );
}