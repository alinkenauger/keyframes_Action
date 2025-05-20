import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Frame from './Frame';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, GripVertical } from 'lucide-react';
import type { Frame as FrameType } from '@/types';
import React, { useState, useEffect, useRef } from 'react';

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
    }
  });

  // Width management state
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle starting the resize operation
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  // Handle the resize movement
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // Set minimum width to prevent column from getting too small
    setWidth(Math.max(200, newWidth));
  };
  
  // Handle ending the resize operation
  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // Cleanup event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "h-full flex flex-col transition-all duration-200 relative",
        isOver && "ring-2 ring-primary/40 bg-primary/10",
        isResizing && "select-none"
      )}
      style={{ width: `${width}px` }}
      data-unit-type={name}
    >
      {/* Resize handle */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center",
          "hover:bg-primary/10 active:bg-primary/20 z-10",
          isResizing && "bg-primary/20"
        )}
        onMouseDown={handleResizeStart}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      
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

      {/* Frames area with proper scrolling */}
      <div 
        className="flex-1 overflow-auto" 
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {unitFrames.length === 0 ? (
          <div className={cn(
            "flex items-center justify-center h-full text-muted-foreground text-sm",
            isOver ? "opacity-100" : "opacity-70"
          )}>
            <p className="text-center px-4">Drop frames here</p>
          </div>
        ) : (
          <div className="p-2">
            <SortableContext
              items={unitFrames.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {unitFrames.map((frame) => (
                  <Frame 
                    key={frame.id} 
                    frame={frame}
                    onDelete={onDeleteFrame}
                    dimmed={isOver}
                    unitWidth={width}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}