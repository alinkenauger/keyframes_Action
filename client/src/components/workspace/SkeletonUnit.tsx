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
  activeDragOver?: boolean; // Whether a frame is being dragged over this unit
  selectedFrameId?: string | null; // Currently selected frame
  onSelectFrame?: (frameId: string) => void; // Frame selection callback
}

export default function SkeletonUnit({ 
  id, 
  name, 
  frames, 
  onDeleteFrame, 
  onReorderFrames,
  onDuplicateUnit,
  onDeleteUnit,
  selectedFrameId,
  onSelectFrame
}: SkeletonUnitProps) {
  const unitFrames = frames.filter(frame => {
    return frame.unitType && 
           frame.unitType.toLowerCase().trim() === name.toLowerCase().trim();
  });

  const { setNodeRef, isOver, active } = useDroppable({
    id: name,
    data: {
      type: 'unit',
      accepts: ['frame', 'template'],
      name,
    },
    // Make sure the droppable area is active - needed for cross-unit drag and drop
    disabled: false
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
  
  // Check if we're dragging a frame from a different unit
  const isDraggingFromOtherUnit = active && active.data.current?.type === 'frame' && 
    active.data.current?.frame?.unitType && 
    active.data.current.frame.unitType.toLowerCase().trim() !== name.toLowerCase().trim();

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col transition-all duration-200 relative max-h-full",
        isOver && !isDraggingFromOtherUnit && "ring-2 ring-primary/40 bg-primary/10",
        isOver && isDraggingFromOtherUnit && "ring-2 ring-green-500/60 bg-green-50/50 shadow-lg",
        isResizing && "select-none"
      )}
      style={{ 
        width: `${width}px`,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
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
      <div className={cn(
        "flex items-center justify-between px-2 py-1 border-b transition-colors duration-200",
        isOver && isDraggingFromOtherUnit ? "bg-green-50 border-green-300" : "bg-background"
      )}>
        <h3 className={cn(
          "text-base font-medium transition-colors duration-200",
          isOver && isDraggingFromOtherUnit && "text-green-700"
        )}>{name}</h3>
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

      {/* Improved scrollable frames area with better overflow handling */}
      <div className="flex-grow flex flex-col overflow-auto" style={{minHeight: "300px"}}>
        {unitFrames.length === 0 ? (
          <div className={cn(
            "flex items-center justify-center h-full text-sm transition-all duration-200",
            isOver && isDraggingFromOtherUnit ? "text-green-600 scale-105" : "text-muted-foreground",
            isOver ? "opacity-100" : "opacity-70"
          )}>
            <p className="text-center px-4">
              {isOver && isDraggingFromOtherUnit ? "Drop to move frame here" : "Drop frames here"}
            </p>
          </div>
        ) : (
          <div 
            className="overflow-y-auto overflow-x-hidden h-full p-2" 
            style={{
              overscrollBehavior: "contain", 
              maxHeight: "100%",
              display: "block",
              // Ensure smooth scrolling for auto-scroll
              scrollBehavior: "smooth"
            }}
            // Add data attribute for auto-scroll targeting
            data-dnd-auto-scroll-container>
            <SortableContext
              items={unitFrames.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3 pb-8">
                {unitFrames.map((frame, index) => (
                  <div key={frame.id} className="relative">
                    <Frame 
                      frame={frame}
                      onDelete={onDeleteFrame}
                      dimmed={isOver && isDraggingFromOtherUnit}
                      unitWidth={width}
                      isSelected={selectedFrameId === frame.id}
                      onSelect={onSelectFrame}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}