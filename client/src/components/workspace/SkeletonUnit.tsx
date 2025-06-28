import { useDroppable, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Frame from './Frame';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, GripVertical } from 'lucide-react';
import type { Frame as FrameType } from '@/types';
import React, { useState, useEffect, useRef, useMemo } from 'react';

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
  dragHandleProps?: any; // Props for drag handle
  isDragging?: boolean; // Whether this unit is being dragged
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
  onSelectFrame,
  dragHandleProps,
  isDragging
}: SkeletonUnitProps) {
  const unitFrames = frames.filter(frame => {
    return frame.unitType && 
           frame.unitType.toLowerCase().trim() === name.toLowerCase().trim();
  });

  const { setNodeRef, isOver, active, over, rect } = useDroppable({
    id: name,
    data: {
      type: 'unit',
      accepts: ['frame', 'template'],
      name,
    },
    // Make sure the droppable area is active - needed for cross-unit drag and drop
    disabled: false
  });

  // State for tracking where the placeholder should appear
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState(0);
  const frameRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Width management state
  const MIN_WIDTH = 300;
  const BREAKPOINT_FOR_HORIZONTAL = 600; // Width at which frames go horizontal
  const [width, setWidth] = useState(MIN_WIDTH);
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
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // Set minimum width to prevent column from getting too small
    setWidth(Math.max(MIN_WIDTH, newWidth));
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

  // Track mouse position and calculate placeholder position when dragging over
  useEffect(() => {
    if (!isOver || !active) {
      setPlaceholderIndex(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
      
      // Calculate where the placeholder should appear
      let newIndex = 0;
      const frameElements = Array.from(frameRefs.current.values());
      
      for (let i = 0; i < frameElements.length; i++) {
        const rect = frameElements[i].getBoundingClientRect();
        const midPoint = rect.top + rect.height / 2;
        
        if (e.clientY > midPoint) {
          newIndex = i + 1;
        } else {
          break;
        }
      }
      
      setPlaceholderIndex(newIndex);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isOver, active, unitFrames.length]);
  
  // Check if we're dragging a frame from a different unit
  const isDraggingFromOtherUnit = active && active.data.current?.type === 'frame' && 
    active.data.current?.frame?.unitType && 
    active.data.current.frame.unitType.toLowerCase().trim() !== name.toLowerCase().trim();

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        if (node) containerRef.current = node;
      }}
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
      {/* Resize handle - positioned on the right edge */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-2 cursor-col-resize",
          "hover:bg-primary/20 active:bg-primary/30 transition-colors",
          "group/resize",
          isResizing && "bg-primary/30"
        )}
        onMouseDown={handleResizeStart}
        title="Drag to resize column"
      >
        <div className="absolute inset-y-0 -left-1 -right-1 w-4" />
        <div className="h-full w-full bg-gray-300 dark:bg-gray-600 group-hover/resize:bg-primary/40 transition-colors" />
      </div>
      
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-2 py-1 border-b transition-colors duration-200 relative group",
        isOver && isDraggingFromOtherUnit ? "bg-green-50 border-green-300" : "bg-background"
      )}>
        {/* Drag handle - positioned to the left of the title */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className={cn(
              "absolute -left-6 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
              isDragging && "opacity-100"
            )}
            title="Drag to reorder column"
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "text-base font-medium transition-colors duration-200",
            isOver && isDraggingFromOtherUnit && "text-green-700"
          )}>{name}</h3>
        </div>
        <div className="flex items-center gap-1 mr-2">
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

      {/* Improved scrollable frames area with responsive layout */}
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
            {/* Show placeholder even when empty */}
            {isOver && active && (
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2">
                <div className="h-20 bg-primary/20 border-2 border-dashed border-primary rounded-lg animate-pulse" />
              </div>
            )}
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
              <div 
                className={cn(
                  "pb-32", // Increased padding to 1.5x card height
                  width > BREAKPOINT_FOR_HORIZONTAL 
                    ? "grid grid-cols-2 gap-3" 
                    : "flex flex-col gap-3"
                )}
              >
                {unitFrames.map((frame, index) => {
                  const showPlaceholderBefore = isOver && placeholderIndex === index;
                  const showPlaceholderAfter = isOver && placeholderIndex === unitFrames.length && index === unitFrames.length - 1;
                  
                  return (
                    <React.Fragment key={frame.id}>
                      {/* Placeholder before frame */}
                      {showPlaceholderBefore && (
                        <div 
                          className={cn(
                            "transition-all duration-300 ease-out",
                            width > BREAKPOINT_FOR_HORIZONTAL ? "col-span-2" : ""
                          )}
                          style={{
                            height: isOver ? '80px' : '0px',
                            opacity: isOver ? 1 : 0,
                            marginBottom: isOver ? '12px' : '0px'
                          }}
                        >
                          <div className="h-full bg-primary/20 border-2 border-dashed border-primary rounded-lg animate-pulse" />
                        </div>
                      )}
                      
                      {/* The actual frame with transform animation */}
                      <div 
                        ref={(el) => {
                          if (el) frameRefs.current.set(frame.id, el);
                          else frameRefs.current.delete(frame.id);
                        }}
                        className="relative transition-transform duration-300 ease-out"
                        style={{
                          transform: isOver && placeholderIndex !== null && index >= placeholderIndex 
                            ? 'translateY(92px)' // 80px placeholder + 12px gap
                            : 'translateY(0px)'
                        }}
                      >
                        <Frame 
                          frame={frame}
                          onDelete={onDeleteFrame}
                          dimmed={isOver && isDraggingFromOtherUnit}
                          unitWidth={width}
                          isSelected={selectedFrameId === frame.id}
                          onSelect={onSelectFrame}
                        />
                      </div>
                      
                      {/* Placeholder after last frame */}
                      {showPlaceholderAfter && (
                        <div 
                          className={cn(
                            "transition-all duration-300 ease-out",
                            width > BREAKPOINT_FOR_HORIZONTAL ? "col-span-2" : ""
                          )}
                          style={{
                            height: isOver ? '80px' : '0px',
                            opacity: isOver ? 1 : 0,
                            marginTop: isOver ? '12px' : '0px'
                          }}
                        >
                          <div className="h-full bg-primary/20 border-2 border-dashed border-primary rounded-lg animate-pulse" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                
                {/* Show placeholder when dragging over empty space at the bottom */}
                {isOver && placeholderIndex === unitFrames.length && unitFrames.length > 0 && (
                  <div 
                    className={cn(
                      "transition-all duration-300 ease-out",
                      width > BREAKPOINT_FOR_HORIZONTAL ? "col-span-2" : ""
                    )}
                    style={{
                      height: '80px',
                      opacity: 1
                    }}
                  >
                    <div className="h-full bg-primary/20 border-2 border-dashed border-primary rounded-lg animate-pulse" />
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}