import { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '@/lib/store';
import Skeleton from './Skeleton';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import Frame from './Frame';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Smartphone, Monitor } from 'lucide-react';
import ScriptViewer from './ScriptViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useMobileView } from '@/hooks/use-mobile';
import { useTouchGestures } from '@/hooks/use-touch-gestures';

interface WorkspaceProps {
  activeId: string | null;
  activeDragData: any;
  onDeleteFrame: (frameId: string) => void;
  onUpdateFrameAttribute: (frameId: string, type: 'tone' | 'filter', value: string) => void;
}

export default function Workspace({ activeId, activeDragData, onDeleteFrame, onUpdateFrameAttribute }: WorkspaceProps) {
  const { toast } = useToast();
  const { skeletons, activeSkeletonId, updateFrameOrder, updateSkeletonUnits } = useWorkspace();
  const activeSkeleton = skeletons.find((s) => s.id === activeSkeletonId);
  const [showScriptView, setShowScriptView] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("skeleton");
  const { isMobile, toggleMobilePreview, previewMode } = useMobileView();
  const [zoomLevel, setZoomLevel] = useState(1);
  const skeletonContainerRef = useRef<HTMLDivElement>(null);
  const initialTouchDistance = useRef<number>(0);

  // Handle horizontal scrolling with mouse wheel and Ctrl/Cmd + wheel zoom
  useEffect(() => {
    if (!skeletonContainerRef.current) return;

    const container = skeletonContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      // Handle zooming with Ctrl/Cmd + wheel
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newZoom = Math.min(Math.max(0.5, zoomLevel + delta), 1.5);
        setZoomLevel(newZoom);

        // Show toast only when significant zoom changes occur
        if (Math.abs(newZoom - zoomLevel) > 0.1) {
          toast({
            title: 'Zoom Level',
            description: `${Math.round(newZoom * 100)}%`,
            duration: 1000
          });
        }
        return;
      }

      // Handle horizontal scrolling
      if (e.shiftKey || e.deltaX !== 0) {
        e.preventDefault();
        const scrollAmount = e.deltaX || e.deltaY;
        const targetScroll = container.scrollLeft + scrollAmount;

        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoomLevel]);

  // Handle pinch-to-zoom gestures
  useEffect(() => {
    if (!skeletonContainerRef.current) return;

    const container = skeletonContainerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialTouchDistance.current = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        if (initialTouchDistance.current > 0) {
          const delta = (currentDistance - initialTouchDistance.current) * 0.005;
          const newZoom = Math.min(Math.max(0.5, zoomLevel + delta), 1.5);
          setZoomLevel(newZoom);

          // Show toast only when significant zoom changes occur
          if (Math.abs(newZoom - zoomLevel) > 0.1) {
            toast({
              title: 'Zoom Level',
              description: `${Math.round(newZoom * 100)}%`,
              duration: 1000
            });
          }
        }
      }
    };

    const handleTouchEnd = () => {
      initialTouchDistance.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [zoomLevel]);

  const handleReorderFrames = (fromId: string, toId: string, unitType: string) => {
    if (!activeSkeletonId) return;

    const skeleton = skeletons.find(s => s.id === activeSkeletonId);
    if (!skeleton) return;

    // Find the frames
    const fromIndex = skeleton.frames.findIndex(f => f.id === fromId);
    const toIndex = skeleton.frames.findIndex(f => f.id === toId);

    if (fromIndex === -1) return;

    // Create a copy of frames
    const newFrames = [...skeleton.frames];

    // Update the frame's unitType if it's being moved to a different unit
    newFrames[fromIndex] = {
      ...newFrames[fromIndex],
      unitType
    };

    // If we're reordering within the same unit, update the position
    if (toIndex !== -1 && newFrames[toIndex].unitType === unitType) {
      const [movedFrame] = newFrames.splice(fromIndex, 1);
      newFrames.splice(toIndex, 0, movedFrame);
    }

    // Update the frames
    updateFrameOrder(activeSkeletonId, newFrames);
  };

  // Handle unit reordering when a unit is dragged and dropped
  const handleReorderUnits = (fromIndex: number, toIndex: number) => {
    if (!activeSkeletonId) return;

    const skeleton = skeletons.find(s => s.id === activeSkeletonId);
    if (!skeleton) return;

    // Get the current units from the skeleton
    const currentUnits = skeleton.units ||
      (skeleton.frames.length > 0
        ? Array.from(new Set(skeleton.frames.filter(f => f.unitType).map(f => f.unitType as string)))
        : ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Outro']);

    // Avoid reordering if the indexes are the same
    if (fromIndex === toIndex) return;

    // Create a new array with the reordered units
    const newUnits = [...currentUnits];
    const [movedUnit] = newUnits.splice(fromIndex, 1);
    newUnits.splice(toIndex, 0, movedUnit);

    // Update the skeleton's units
    updateSkeletonUnits(activeSkeletonId, newUnits);

    toast({
      title: 'Unit Reordered',
      description: `${movedUnit} unit has been reordered`,
    });
  };

  if (!activeSkeleton) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select or create a skeleton to begin</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-65px)] overflow-hidden">
      <div className="flex-1 p-2 md:p-6">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-center">{activeSkeleton.name}</h2>
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            Drag frames from the sidebar and drop them into the units below
          </p>
        </div>

        {/* Mobile/Desktop view toggle */}
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobilePreview}
            className="hidden md:flex items-center"
            aria-label={`Switch to ${previewMode === 'desktop' ? 'mobile' : 'desktop'} preview`}
          >
            {previewMode === 'desktop' ? (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Preview
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4 mr-2" />
                Desktop Preview
              </>
            )}
          </Button>
        </div>

        <div className="mb-4 flex justify-end space-x-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="skeleton">Skeleton Board</TabsTrigger>
                <TabsTrigger value="script">Full Script</TabsTrigger>
                <TabsTrigger value="combined" className="hidden md:inline-flex">Combined View</TabsTrigger>
              </TabsList>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScriptView(!showScriptView)}
                  className="md:hidden"
                >
                  {showScriptView ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Script
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Script
                    </>
                  )}
                </Button>
              </div>
            </div>

            <TabsContent value="skeleton" className="mt-0">
              <ScrollArea
                ref={skeletonContainerRef}
                className={cn(
                  "w-full overflow-x-auto overscroll-x-contain touch-pan-x",
                  "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400",
                  "scroll-smooth",
                  previewMode === 'mobile' && !isMobile ? "max-w-[425px] mx-auto border border-dashed rounded-md" : ""
                )}
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                }}
              >
                <div 
                  className={cn(
                    "min-w-max pb-4 transform-gpu transition-transform duration-200",
                    previewMode === 'mobile' && !isMobile ? "scale-[0.85] origin-top" : ""
                  )}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    width: 'fit-content'
                  }}
                >
                  <Skeleton
                    skeleton={activeSkeleton!}
                    onDeleteFrame={onDeleteFrame}
                    onReorderFrames={handleReorderFrames}
                    onReorderUnits={handleReorderUnits}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="script" className="mt-0">
              <ScriptViewer id="script-viewer" fullWidth={true} />
            </TabsContent>

            <TabsContent value="combined" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <ScrollArea className="w-full overflow-x-auto touch-pan-x">
                    <Skeleton
                      skeleton={activeSkeleton!}
                      onDeleteFrame={onDeleteFrame}
                      onReorderFrames={handleReorderFrames}
                      onReorderUnits={handleReorderUnits}
                    />
                  </ScrollArea>
                </div>
                <div className="col-span-1">
                  <ScriptViewer fullWidth={true} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {showScriptView && (
          <div className="md:hidden mt-4">
            <ScriptViewer />
          </div>
        )}

        <DragOverlay dropAnimation={{
          duration: 350,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeId && activeDragData?.type === 'template' ? (
            <Frame
              frame={{
                id: activeId,
                type: activeDragData.frame.type,
                content: activeDragData.frame.content,
                unitType: ''
              }}
            />
          ) : activeId && (activeDragData?.type === 'tone' || activeDragData?.type === 'filter') ? (
            <div className={cn(
              'px-2 py-1 rounded',
              activeDragData.type === 'tone' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            )}>
              {activeDragData.value}
            </div>
          ) : activeId && activeDragData?.type === 'skeleton-unit' ? (
            <div className="bg-white border rounded-md shadow-md p-4 w-48">
              <p className="font-medium">{activeDragData.unit.name}</p>
            </div>
          ) : activeId ? (
            <Frame
              frame={activeSkeleton?.frames.find(f => f.id === activeId)!}
            />
          ) : null}
        </DragOverlay>
      </div>
    </div>
  );
}