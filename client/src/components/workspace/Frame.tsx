import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripHorizontal, X, Edit, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Frame as FrameType } from '@/types';
import FrameDialog from './FrameDialog';
import { useWorkspace } from '@/lib/store';
import { FRAME_CATEGORY_COLORS, TONES, FILTERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { adaptFrameContent } from '@/lib/ai-service';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { useToast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FrameDropIndicator from './FrameDropIndicator';

interface FrameProps {
  frame: FrameType;
  onDelete?: (id: string) => void;
  dimmed?: boolean; // Whether to dim the frame (when parent unit is being dragged over)
  unitWidth?: number; // The width of the parent unit for responsive sizing
  isSelected?: boolean; // Whether this frame is selected
  onSelect?: (id: string) => void; // Callback when frame is selected
}

export default function Frame({ frame, onDelete, dimmed = false, unitWidth, isSelected = false, onSelect }: FrameProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const { 
    activeSkeletonId, 
    updateFrameContent, 
    updateFrameTone, 
    updateFrameFilter,
    updateFrameTransition,
    getVideoContext
  } = useWorkspace();
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
    isDragging,
    over
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
      
      // Skip adaptation for template-created frames
      // We identify them by checking if they're from a creator template
      // These frames should preserve their original example content
      const isTemplateFrame = frame.isTemplateExample === true;
      if (isTemplateFrame) return;

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
  }, [frame.tone, frame.filter, activeSkeletonId, frame.id, frame.content, frame.type, frame.unitType, updateFrameContent, frame.isTemplateExample]);

  // Determine drop position for visual indicators
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | null>(null);
  
  // Cache for getBoundingClientRect to improve performance
  const rectCacheRef = useRef<DOMRect | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Invalidate cache on scroll or resize
  useEffect(() => {
    const invalidateCache = () => {
      rectCacheRef.current = null;
    };
    
    window.addEventListener('scroll', invalidateCache, true);
    window.addEventListener('resize', invalidateCache);
    
    return () => {
      window.removeEventListener('scroll', invalidateCache, true);
      window.removeEventListener('resize', invalidateCache);
    };
  }, []);
  
  // Update drop position when dragging over this frame (throttled with delay)
  useEffect(() => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    if (!over || over.id !== frame.id || isDragging) {
      setDropPosition(null);
      rectCacheRef.current = null;
      return;
    }
    
    // Add 100ms delay before showing drop zone to reduce flickering
    hoverTimeoutRef.current = setTimeout(() => {
      // Throttle updates to 60fps (16ms)
      const now = Date.now();
      if (now - lastUpdateRef.current < 16) {
        return;
      }
      lastUpdateRef.current = now;
      
      // Calculate if the cursor is in the top, middle, or bottom section of the frame
      const overData = over.data.current;
      if (overData && overData.type === 'frame') {
        // Use cached rect or get new one
        if (!rectCacheRef.current) {
          rectCacheRef.current = document.getElementById(frame.id)?.getBoundingClientRect() || null;
        }
        
        const rect = rectCacheRef.current;
        if (rect) {
          // Get mouse position from the over data
          const mouseY = (over as any).activatorEvent?.clientY || (over as any).rect?.top || 0;
          const frameCenterY = rect.top + (rect.height / 2);
          
          // Simple 50/50 split for clearer drop zones
          if (mouseY < frameCenterY) {
            setDropPosition('top');
          } else {
            setDropPosition('bottom');
          }
        }
      }
    }, 100); // 100ms delay
    
    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [over, frame.id, isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
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

  // Only try to use activeSkeletonId for actions that require it, but not for component rendering
  // This allows frames to show even when no skeleton is active

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
        {...attributes}
        {...listeners}
        style={{
          ...style,
          width: unitWidth ? `${unitWidth - 24}px` : '100%', // Ensure cards are visible
          willChange: isDragging ? 'transform' : 'auto',
        }}
        className={cn(
          "relative hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group touch-manipulation min-h-[80px]",
          // Consistent margin for grid-like alignment
          "mb-3",
          frameTypeColors.text.replace('text-', 'border-l-4 border-l-'),
          dimmed && "opacity-40",
          isDragging && "shadow-lg ring-2 ring-blue-400",
          !isDragging && over && over.id === frame.id ? "ring-2 ring-primary shadow-md" : "",
          // Add background highlight based on drop position
          !isDragging && over && over.id === frame.id && dropPosition === 'top' && "bg-gradient-to-b from-primary/20 to-transparent",
          !isDragging && over && over.id === frame.id && dropPosition === 'bottom' && "bg-gradient-to-t from-primary/20 to-transparent",
          "hover:border hover:border-blue-300",
          // Selection styling
          isSelected && "ring-2 ring-orange-500 shadow-lg bg-orange-50/30"
        )}
        onClick={(e) => {
          // Only select if not dragging and not clicking on interactive elements
          if (!isDragging && onSelect && !(e.target as HTMLElement).closest('button')) {
            onSelect(frame.id);
          }
        }}
      >
        {/* Drop position indicator */}
        {!isDragging && over && over.id === frame.id && (
          <FrameDropIndicator position={dropPosition} />
        )}
        <div 
          className="absolute left-1/2 top-1 -translate-x-1/2 p-1 rounded-md bg-gray-100 z-10"
        >
          <GripHorizontal className="h-4 w-4 text-gray-500" />
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
              <div 
                style={{ transform: `scale(${contentScale})`, transformOrigin: "0 0", transition: contentScale === 1 ? "transform 0.3s ease-out" : "none" }}
                onClick={() => setShowDialog(true)}
                className="cursor-pointer"
              >
                <p className="text-sm text-gray-600 line-clamp-3 hover:text-gray-800">
                  {frame.content}
                </p>
              </div>
            ) : (
              <p 
                className="text-sm text-gray-400 italic cursor-pointer"
                onClick={() => setShowDialog(true)}
              >
                Click to add content
              </p>
            )}
          </div>

          {/* Magic wand dropdown - only visible on hover */}
          <div className="mt-2">
            <div className="group flex flex-col">
              <div className="transition-opacity opacity-0 group-hover:opacity-100 self-start">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2 py-1 h-8">
                      <span className="text-lg mr-1">🪄</span>
                      <span className="text-xs">Enhance</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-3" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-3">
                      <h4 className="font-medium text-xs">Enhance your content</h4>
                      
                      {/* Tone selector */}
                      <div className="space-y-1">
                        <label className="text-xs">Tone</label>
                        <Select
                          value={frame.tone || ""}
                          onValueChange={async (value) => {
                            if (activeSkeletonId) {
                              // Handle the "none" case by setting tone to empty string
                              const actualValue = value === "none" ? "" : value;
                              updateFrameTone(activeSkeletonId, frame.id, actualValue);
                              
                              // Only adapt content if both tone and filter are present
                              if (actualValue && frame.filter) {
                                setIsAdapting(true);
                                try {
                                  const adaptedContent = await adaptFrameContent(
                                    frame.content || '',
                                    actualValue,
                                    frame.filter,
                                    frame.type || '',
                                    frame.unitType || '',
                                  );
                                  
                                  if (adaptedContent) {
                                    updateFrameContent(activeSkeletonId, frame.id, adaptedContent);
                                  }
                                } catch (error) {
                                  console.error("Error adapting content:", error);
                                } finally {
                                  setIsAdapting(false);
                                }
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            {frame.tone && <SelectItem value="none">None</SelectItem>}
                            {TONES.map(tone => (
                              <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Filter selector */}
                      <div className="space-y-1">
                        <label className="text-xs">Filter</label>
                        <Select
                          value={frame.filter || ""}
                          onValueChange={async (value) => {
                            if (activeSkeletonId) {
                              // Handle the "none" case by setting filter to empty string
                              const actualValue = value === "none" ? "" : value;
                              updateFrameFilter(activeSkeletonId, frame.id, actualValue);
                              
                              // Only adapt content if both tone and filter are present
                              if (actualValue && frame.tone) {
                                setIsAdapting(true);
                                try {
                                  const adaptedContent = await adaptFrameContent(
                                    frame.content || '',
                                    frame.tone,
                                    actualValue,
                                    frame.type || '',
                                    frame.unitType || '',
                                  );
                                  
                                  if (adaptedContent) {
                                    updateFrameContent(activeSkeletonId, frame.id, adaptedContent);
                                  }
                                } catch (error) {
                                  console.error("Error adapting content:", error);
                                } finally {
                                  setIsAdapting(false);
                                }
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Select filter" />
                          </SelectTrigger>
                          <SelectContent>
                            {frame.filter && <SelectItem value="none">None</SelectItem>}
                            {FILTERS.map(filter => (
                              <SelectItem key={filter} value={filter}>{filter}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Transition selector */}
                      <div className="space-y-1">
                        <label className="text-xs">Transition</label>
                        <Select
                          value={frame.transition || ""}
                          onValueChange={(value) => {
                            if (activeSkeletonId) {
                              // Handle the "none" case by setting transition to empty string
                              const actualValue = value === "none" ? "" : value;
                              // Handle empty transition
                              if (actualValue === '') {
                                // Use 'smooth' as a default when clearing to avoid type errors
                                updateFrameTransition(activeSkeletonId, frame.id, 'smooth');
                              } else {
                                updateFrameTransition(
                                  activeSkeletonId, 
                                  frame.id, 
                                  actualValue as 'smooth' | 'pattern-interrupt' | 'content-shift'
                                );
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Select transition" />
                          </SelectTrigger>
                          <SelectContent>
                            {frame.transition && <SelectItem value="none">None</SelectItem>}
                            <SelectItem value="smooth">Smooth / Natural</SelectItem>
                            <SelectItem value="pattern-interrupt">Pattern Interrupt</SelectItem>
                            <SelectItem value="content-shift">Content Shift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Adapt content button */}
                      <Button 
                        className="w-full mt-2" 
                        size="sm"
                        disabled={isAdapting || !frame.tone || !frame.filter}
                        onClick={async () => {
                          if (!activeSkeletonId || !frame.tone || !frame.filter) return;
                          
                          // Check if we have video context information
                          const videoContext = getVideoContext(activeSkeletonId);
                          if (!videoContext) {
                            toast({
                              title: "Missing Video Context",
                              description: "Please add context about your video in the skeleton settings first.",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          setIsAdapting(true);
                          try {
                            const adaptedContent = await adaptFrameContent(
                              frame.content || '',
                              frame.tone,
                              frame.filter,
                              frame.type || '',
                              frame.unitType || '',
                            );
                            
                            if (adaptedContent) {
                              updateFrameContent(activeSkeletonId, frame.id, adaptedContent);
                              toast({
                                title: "Content Enhanced",
                                description: `Applied ${frame.tone} tone and ${frame.filter} filter to your content.`
                              });
                            }
                          } catch (error) {
                            console.error("Error adapting content:", error);
                            toast({
                              title: "Enhancement Failed",
                              description: "There was an issue enhancing your content. Please try again.",
                              variant: "destructive"
                            });
                          } finally {
                            setIsAdapting(false);
                          }
                        }}
                      >
                        {isAdapting ? "Adapting..." : "Adapt Content with AI"}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Display indicators for selected attributes */}
              <div className="flex flex-wrap gap-1 mt-2">
                {frame.tone && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {frame.tone}
                  </span>
                )}
                {frame.filter && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    {frame.filter}
                  </span>
                )}
              </div>
            </div>
            
            {/* Show transition as a full-width bar at the bottom */}
            {frame.transition && (
              <div className={cn(
                "mt-2 w-full rounded-b-md py-1 text-center text-xs font-medium",
                frame.transition === 'smooth' ? 'bg-amber-100 text-amber-800' : 
                frame.transition === 'pattern-interrupt' ? 'bg-blue-100 text-blue-800' : 
                'bg-purple-100 text-purple-800'
              )}>
                {frame.transition === 'smooth' ? 'Smooth' : 
                 frame.transition === 'pattern-interrupt' ? 'Pattern Interrupt' : 
                 'Content Shift'} Transition
              </div>
            )}
          </div>
          
          {/* Hidden drop areas for compatibility */}
          <div ref={setToneRef} className="hidden" />
          <div ref={setFilterRef} className="hidden" />

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
          skeletonId={activeSkeletonId || ''}
        />
      )}
    </>
  );
}