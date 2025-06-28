import { useState } from 'react';
import { GripVertical, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SkeletonUnit from './SkeletonUnit';
import type { Frame as FrameType } from '@/types';

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Add a custom drag image
    const dragElement = e.currentTarget as HTMLElement;
    const rect = dragElement.getBoundingClientRect();
    e.dataTransfer.setDragImage(dragElement, rect.width / 2, 20);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder units
    const newOrder = [...units];
    const [movedUnit] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, movedUnit);
    
    // Call the reorder handler with new unit names
    onReorderUnits(newOrder.map(u => u.name));
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex gap-2 p-2 rounded-lg border bg-background h-full" 
         style={{ minHeight: "calc(100vh - 180px)" }}>
      {units.map((unit, index) => (
        <div
          key={unit.id}
          className={cn(
            "relative group transition-all duration-200",
            draggedIndex === index && "opacity-30",
            dragOverIndex === index && "ring-2 ring-primary"
          )}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
        >
          {/* Unit wrapper with drag handle */}
          <div className="relative h-full">
            {/* Drag handle - absolutely positioned */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "absolute -left-2 top-2 z-40 cursor-grab active:cursor-grabbing",
                "bg-white dark:bg-gray-800 border rounded-md shadow-sm",
                "p-1 opacity-0 group-hover:opacity-100 transition-opacity",
                "hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
              title="Drag to reorder unit"
            >
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>

            {/* The actual unit */}
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
        </div>
      ))}
    </div>
  );
}