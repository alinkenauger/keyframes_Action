import { useState } from 'react';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SkeletonUnit from './SkeletonUnit';
import type { Frame as FrameType } from '@/types';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface UnitManagerProps {
  units: Array<{
    id: string;
    name: string;
    frames: FrameType[];
  }>;
  onReorderUnits: (newOrder: string[]) => void;
  onDeleteFrame?: (frameId: string) => void;
  onReorderFrames?: (fromId: string, toId: string, unitType: string) => void;
  onDuplicateUnit?: (unitName: string) => void;
  onDeleteUnit?: (unitName: string) => void;
  selectedFrameId?: string | null;
  onSelectFrame?: (frameId: string) => void;
}

// Sortable Unit Component
function SortableUnit({
  unit,
  onDeleteFrame,
  onReorderFrames,
  onDuplicateUnit,
  onDeleteUnit,
  selectedFrameId,
  onSelectFrame,
}: {
  unit: { id: string; name: string; frames: FrameType[] };
  onDeleteFrame?: (frameId: string) => void;
  onReorderFrames?: (fromId: string, toId: string, unitType: string) => void;
  onDuplicateUnit?: (unitName: string) => void;
  onDeleteUnit?: (unitName: string) => void;
  selectedFrameId?: string | null;
  onSelectFrame?: (frameId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: unit.id,
    data: {
      type: 'skeleton-unit',
      unit: unit
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "opacity-30 z-50"
      )}
    >
      <SkeletonUnit
        {...unit}
        onDeleteFrame={onDeleteFrame}
        onReorderFrames={onReorderFrames}
        onDuplicateUnit={onDuplicateUnit}
        onDeleteUnit={onDeleteUnit}
        selectedFrameId={selectedFrameId}
        onSelectFrame={onSelectFrame}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
        isDragging={isDragging}
      />
    </div>
  );
}

export function UnitManager({
  units,
  onReorderUnits,
  onDeleteFrame,
  onReorderFrames,
  onDuplicateUnit,
  onDeleteUnit,
  selectedFrameId,
  onSelectFrame
}: UnitManagerProps) {

  return (
    <div className="flex gap-2 p-2 pl-8 rounded-lg border bg-background h-full" 
         style={{ minHeight: "calc(100vh - 180px)" }}>
      <SortableContext
        items={units.map(u => u.id)}
        strategy={horizontalListSortingStrategy}
      >
        {units.map((unit) => (
          <SortableUnit
            key={unit.id}
            unit={unit}
            onDeleteFrame={onDeleteFrame}
            onReorderFrames={onReorderFrames}
            onDuplicateUnit={onDuplicateUnit}
            onDeleteUnit={onDeleteUnit}
            selectedFrameId={selectedFrameId}
            onSelectFrame={onSelectFrame}
          />
        ))}
      </SortableContext>
    </div>
  );
}