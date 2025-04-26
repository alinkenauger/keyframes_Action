import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Frame from './Frame';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import type { Frame as FrameType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SkeletonUnitProps {
  id: string;
  name: string;
  frames: FrameType[];
  onDeleteFrame?: (frameId: string) => void;
  onReorderFrames?: (fromId: string, toId: string, unitType: string) => void;
  onDuplicateUnit?: (unitName: string) => void;
  onDeleteUnit?: (unitName: string) => void;
}

export default function SkeletonUnit({ 
  id, 
  name, 
  frames, 
  onDeleteFrame, 
  onReorderFrames,
  onDuplicateUnit,
  onDeleteUnit 
}: SkeletonUnitProps) {
  const unitFrames = frames.filter(frame => {
    return frame.unitType && 
           frame.unitType.toLowerCase().trim() === name.toLowerCase().trim();
  });

  const { setNodeRef, isOver } = useDroppable({
    id: name,
    data: {
      type: 'unit',
      accepts: ['frame', 'template'],
      name,
      unitType: name
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "h-full flex flex-col transition-all duration-200",
        isOver && "ring-2 ring-primary/20 bg-primary/5"
      )}
      data-unit-type={name}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 border-b bg-background">
        <h3 className="text-base font-medium">{name}</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            onClick={() => onDuplicateUnit?.(name)}
            title="Duplicate unit"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDeleteUnit?.(name)}
            title="Delete unit"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Frames area */}
      <div 
        className={cn(
          "flex-1 min-h-[200px] flex flex-col overflow-hidden relative",
          isOver && "ring-inset ring-2 ring-primary/30 bg-primary/5"
        )}
      >
        {/* Extra drop indicator area when empty */}
        {unitFrames.length === 0 && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center text-muted-foreground text-sm pointer-events-none z-0",
            isOver ? "opacity-100" : "opacity-70"
          )}>
            <p className="text-center px-4">Drop frames here</p>
          </div>
        )}

        <ScrollArea 
          className="flex-1 p-2 w-full"
        >
          <SortableContext
            items={unitFrames.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3 min-h-[150px] w-full">
              {unitFrames.map((frame) => (
                <Frame 
                  key={frame.id} 
                  frame={frame}
                  onDelete={onDeleteFrame}
                />
              ))}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </div>
  );
}