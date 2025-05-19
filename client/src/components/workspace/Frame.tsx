import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripHorizontal, X, Edit } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Frame as FrameType } from '@/types';
import FrameDialog from './FrameDialog';
import { useWorkspace } from '@/lib/store';
import { FRAME_CATEGORY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { adaptFrameContent } from '@/lib/ai-service';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useTouchGestures } from '@/hooks/use-touch-gestures';

interface FrameProps {
  frame: FrameType;
  onDelete?: (id: string) => void;
  dimmed?: boolean; // Whether to dim the frame (when parent unit is being dragged over)
  unitWidth?: number; // The width of the parent unit for responsive sizing
}

export default function Frame({ frame, onDelete, dimmed = false, unitWidth }: FrameProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { activeSkeletonId, updateFrameContent } = useWorkspace();
  const [isAdapting, setIsAdapting] = useState(false);
  const [contentScale, setContentScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: frame.id,
    data: {
      type: 'frame',
      frame
    }
  });

  // Add droppable areas for tone and filter
  const { setNodeRef: setToneRef, isOver: isToneOver } = useDroppable({
    id: `${frame.id}-tone`,
    data: {
      type: 'tone-target',
      frameId: frame.id,
      accepts: ['tone']
    }
  });

  const { setNodeRef: setFilterRef, isOver: isFilterOver } = useDroppable({
    id: `${frame.id}-filter`,
    data: {
      type: 'filter-target',
      frameId: frame.id,
      accepts: ['filter']
    }
  });

  // Use touch gesture hook for content section of the frame
  const { touchAction, scale } = useTouchGestures(contentRef, {
    onPinch: (scale) => {
      // Only allow pinch zoom for content, not for the whole frame
      // (to avoid interfering with dragging)
      setContentScale(Math.min(Math.max(scale, 1), 2.5)); // Limit zoom between 1x and 2.5x
      setIsZoomed(scale > 1.1);
    }
  });

  // Reset zoom when touch action changes
  useEffect(() => {
    if (touchAction === 'none' && isZoomed) {
      // Add a small delay before resetting the zoom
      const timer = setTimeout(() => {
        setContentScale(1);
        setIsZoomed(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [touchAction, isZoomed]);

  // Effect to adapt content when tone or filter changes
  useEffect(() => {
    const adaptContent = async () => {
      if (!frame.content || isAdapting) return;

      // Only proceed if we have either tone or filter
      if (!frame.tone && !frame.filter) return;

      setIsAdapting(true);
      try {
        const adaptedContent = await adaptFrameContent(
          frame.content,
          frame.tone || '',
          frame.filter || '',
          frame.type || '',
          frame.unitType || ''
        );

        // Update frame content through workspace store
        if (adaptedContent !== frame.content && activeSkeletonId) {
          updateFrameContent(activeSkeletonId, frame.id, adaptedContent);
        }
      } catch (error) {
        console.error('Error adapting content:', error);
      } finally {
        setIsAdapting(false);
      }
    };

    adaptContent();
  }, [frame.tone, frame.filter, activeSkeletonId, frame.id, frame.content, frame.type, frame.unitType, updateFrameContent]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // We need to handle frame type color mapping differently
  // Since we're now using more specific frame names rather than generic categories
  // Get appropriate colors for the frame type
  let frameTypeColors = { bg: 'bg-gray-100', text: 'text-gray-800' };

  // Try to determine the color based on unitType or fallback to a type-based mapping
  if (frame.unitType) {
    if (frame.unitType.toLowerCase().includes('hook')) {
      frameTypeColors = { bg: 'bg-blue-100', text: 'text-blue-800' };
    } else if (frame.unitType.toLowerCase().includes('intro')) {
      frameTypeColors = { bg: 'bg-green-100', text: 'text-green-800' };
    } else if (frame.unitType.toLowerCase().includes('content')) {
      frameTypeColors = { bg: 'bg-emerald-100', text: 'text-emerald-800' };
    } else if (frame.unitType.toLowerCase().includes('rehook')) {
      frameTypeColors = { bg: 'bg-purple-100', text: 'text-purple-800' };
    } else if (frame.unitType.toLowerCase().includes('outro')) {
      frameTypeColors = { bg: 'bg-orange-100', text: 'text-orange-800' };
    }
  }

  if (!activeSkeletonId) return null;

  // Custom CSS for touch feedback
  const touchIndicatorClasses = cn(
    "absolute inset-0 pointer-events-none transition-opacity duration-300",
    touchAction !== 'none' ? "opacity-20" : "opacity-0",
    (touchAction === 'swipe-left' || touchAction === 'swipe-right') && "bg-blue-300",
    touchAction === 'pinch' && "bg-green-300"
  );

  return (
    <>
      <Card 
        ref={setNodeRef}
        style={{
          ...style,
          width: unitWidth ? `${unitWidth - 24}px` : 'auto', // Adjust width based on parent unit minus padding
        }}
        className={cn(
          "relative mb-4 hover:shadow-md transition-shadow cursor-move group touch-manipulation",
          frameTypeColors.text.replace('text-', 'border-l-4 border-l-'),
          dimmed && "opacity-40"
        )}
      >
        <div {...attributes} {...listeners} className="absolute right-10 top-3 cursor-move">
          <GripHorizontal className="h-4 w-4 text-gray-400" />
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(frame.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <CardContent className="pt-8 pb-4">
          {/* Frame Type Tag - Display frame.name instead of frame.type */}
          <div className={cn("inline-block px-2 py-1 rounded", frameTypeColors.bg, frameTypeColors.text)}>
            <span className="text-sm font-medium">{frame.name || frame.type}</span>
          </div>

          {/* Content section with touch zoom support */}
          <div 
            className="mt-3 relative" 
            ref={contentRef}
            style={{
              touchAction: "none", // Disable browser touch actions in this area
            }}
          >
            {/* Touch indicator overlay */}
            <div className={touchIndicatorClasses}></div>

            {frame.content ? (
              <div style={{ transform: `scale(${contentScale})`, transformOrigin: "0 0", transition: contentScale === 1 ? "transform 0.3s ease-out" : "none" }}>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <p className="text-sm text-gray-600 line-clamp-3 cursor-pointer hover:text-gray-800">
                      {frame.content}
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4 bg-card border shadow-lg">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-primary">
                          {frame.unitType}: {frame.name || frame.type}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {frame.tone && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {frame.tone}
                            </span>
                          )}
                          {frame.filter && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                              {frame.filter}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="border-t pt-2">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                          {frame.script || frame.content}
                        </p>
                      </div>
                      {/* Show a small edit link at the bottom */}
                      <div className="text-right">
                        <button 
                          className="text-xs text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDialog(true);
                          }}
                        >
                          Edit content
                        </button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Click to add content</p>
            )}
          </div>

          {/* Tone Drop Area */}
          <div
            ref={setToneRef}
            className={cn(
              "mt-2 min-h-[28px] rounded border border-dashed transition-colors",
              isToneOver ? "border-blue-500 bg-blue-50" : "border-gray-200",
              !frame.tone && "p-2"
            )}
            onClick={e => e.stopPropagation()}
          >
            {frame.tone ? (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {frame.tone}
              </span>
            ) : (
              <p className="text-xs text-gray-400 text-center">Drop tone here</p>
            )}
          </div>

          {/* Filter Drop Area */}
          <div
            ref={setFilterRef}
            className={cn(
              "mt-2 min-h-[28px] rounded border border-dashed transition-colors",
              isFilterOver ? "border-purple-500 bg-purple-50" : "border-gray-200",
              !frame.filter && "p-2"
            )}
            onClick={e => e.stopPropagation()}
          >
            {frame.filter ? (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {frame.filter}
              </span>
            ) : (
              <p className="text-xs text-gray-400 text-center">Drop filter here</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setShowDialog(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {frame.unitType && (
        <FrameDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          frame={{
            id: frame.id,
            type: frame.type || '',
            content: frame.content || '',
            unitType: frame.unitType,
            script: frame.script || '' 
          }}
          skeletonId={activeSkeletonId}
        />
      )}
    </>
  );
}