import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/lib/store';
import Workspace from '@/components/workspace/Workspace';
import Sidebar from '@/components/sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Keyboard } from 'lucide-react';
import CreateSkeletonDialog from '@/components/skeleton/CreateSkeletonDialog';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  DndContext, 
  DragStartEvent, 
  DragEndEvent,
  DragOverEvent, 
  closestCenter,
  rectIntersection,
  pointerWithin,
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  CollisionDetection,
  getFirstCollision
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import type { FrameTemplate } from '@/lib/frameLibrary';
import { useKeyboardShortcuts, KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '@/components/ui/keyboard-shortcuts-help';
import { useToast } from '@/hooks/use-toast';
import PartnerAgent from '@/components/agent/PartnerAgent';
import { useIsMobile } from '@/hooks/use-mobile';

// Type definitions for drag data
type DragDataType = 'frame' | 'template' | 'skeleton-unit' | 'tone' | 'filter';

interface BaseDragData {
  type: DragDataType;
}

interface FrameDragData extends BaseDragData {
  type: 'frame';
  frame: any; // Frame type from your schema
}

interface TemplateDragData extends BaseDragData {
  type: 'template';
  frame: FrameTemplate;
}

interface SkeletonUnitDragData extends BaseDragData {
  type: 'skeleton-unit';
  unitName: string;
}

interface ToneDragData extends BaseDragData {
  type: 'tone';
  value: string;
}

interface FilterDragData extends BaseDragData {
  type: 'filter';
  value: string;
}

type DragData = FrameDragData | TemplateDragData | SkeletonUnitDragData | ToneDragData | FilterDragData;

// Mouse position tracking during drag
interface DragMousePosition {
  x: number;
  y: number;
}

export default function Home() {
  const { toast } = useToast();
  const { addSkeleton, setActiveSkeletonId, updateFrameOrder, skeletons, activeSkeletonId, updateFrameTone, updateFrameFilter, updateSkeletonUnits } = useWorkspace();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage('has-seen-welcome', false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<DragData | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  
  // Check if this is the first time user is visiting and show welcome screen
  useEffect(() => {
    if (skeletons.length === 0) {
      setShowWelcomeScreen(true);
    }
  }, [skeletons.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Instead of auto-creating a skeleton, let's show the welcome screen
  // to guide users in selecting their first skeleton template

  // Move frame up or down within its unit
  const moveFrameWithKeyboard = (direction: 'up' | 'down') => {
    if (!selectedFrameId || !activeSkeletonId) {
      toast({
        title: 'No frame selected',
        description: 'Click on a frame to select it first',
        variant: 'destructive'
      });
      return;
    }
    
    const activeSkeleton = skeletons.find(s => s.id === activeSkeletonId);
    if (!activeSkeleton) return;
    
    const frameIndex = activeSkeleton.frames.findIndex(f => f.id === selectedFrameId);
    if (frameIndex === -1) {
      // Frame no longer exists, clear selection
      setSelectedFrameId(null);
      return;
    }
    
    const selectedFrame = activeSkeleton.frames[frameIndex];
    const unitFrames = activeSkeleton.frames.filter(f => f.unitType === selectedFrame.unitType);
    const unitFrameIndex = unitFrames.findIndex(f => f.id === selectedFrameId);
    
    if (direction === 'up' && unitFrameIndex > 0) {
      const targetFrame = unitFrames[unitFrameIndex - 1];
      const targetIndex = activeSkeleton.frames.findIndex(f => f.id === targetFrame.id);
      const newFrames = arrayMove(activeSkeleton.frames, frameIndex, targetIndex);
      updateFrameOrder(activeSkeletonId, newFrames);
      
      toast({
        title: 'Frame Moved',
        description: 'Frame moved up',
      });
      
      // Scroll the frame into view
      setTimeout(() => {
        document.getElementById(selectedFrameId)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    } else if (direction === 'down' && unitFrameIndex < unitFrames.length - 1) {
      const targetFrame = unitFrames[unitFrameIndex + 1];
      const targetIndex = activeSkeleton.frames.findIndex(f => f.id === targetFrame.id);
      const newFrames = arrayMove(activeSkeleton.frames, frameIndex, targetIndex);
      updateFrameOrder(activeSkeletonId, newFrames);
      
      toast({
        title: 'Frame Moved',
        description: 'Frame moved down',
      });
      
      // Scroll the frame into view
      setTimeout(() => {
        document.getElementById(selectedFrameId)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };
  
  // Move frame to previous or next unit
  const moveFrameToUnit = (direction: 'prev' | 'next') => {
    if (!selectedFrameId || !activeSkeletonId) {
      toast({
        title: 'No frame selected',
        description: 'Click on a frame to select it first',
        variant: 'destructive'
      });
      return;
    }
    
    const activeSkeleton = skeletons.find(s => s.id === activeSkeletonId);
    if (!activeSkeleton) return;
    
    const frame = activeSkeleton.frames.find(f => f.id === selectedFrameId);
    if (!frame) {
      // Frame no longer exists, clear selection
      setSelectedFrameId(null);
      return;
    }
    
    const units = activeSkeleton.units || [];
    const currentUnitIndex = units.findIndex(u => u.toLowerCase() === frame.unitType?.toLowerCase());
    
    let targetUnitIndex = -1;
    if (direction === 'prev' && currentUnitIndex > 0) {
      targetUnitIndex = currentUnitIndex - 1;
    } else if (direction === 'next' && currentUnitIndex < units.length - 1) {
      targetUnitIndex = currentUnitIndex + 1;
    }
    
    if (targetUnitIndex !== -1) {
      const newFrames = activeSkeleton.frames.map(f => 
        f.id === selectedFrameId ? { ...f, unitType: units[targetUnitIndex] } : f
      );
      updateFrameOrder(activeSkeletonId, newFrames);
      
      toast({
        title: 'Frame Moved',
        description: `Frame moved to ${units[targetUnitIndex]}`,
      });
      
      // Scroll the frame into view in its new unit
      setTimeout(() => {
        document.getElementById(selectedFrameId)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  // Enhanced collision detection for reliable drops
  const customCollisionDetection: CollisionDetection = args => {
    const { active, droppableContainers, draggableRect, droppableRects, collisionRect, pointerCoordinates } = args;
    
    // Ignore skeleton-unit dragging as it's handled separately
    if (active.data.current?.type === 'skeleton-unit') {
      return [];
    }
    
    // For frame/template dragging from external sources (sidebar or other units)
    if (active.data.current?.type === 'frame' || active.data.current?.type === 'template') {
      // First check for unit collisions
      const unitContainers = droppableContainers.filter(container => 
        container.data.current?.type === 'unit'
      );
      
      // Find which unit we're over
      let targetUnit = null;
      if (pointerCoordinates) {
        for (const container of unitContainers) {
          const rect = droppableRects.get(container.id);
          if (rect) {
            // Use normal hit area for units
            if (pointerCoordinates.x >= rect.left && 
                pointerCoordinates.x <= rect.right &&
                pointerCoordinates.y >= rect.top && 
                pointerCoordinates.y <= rect.bottom) {
              targetUnit = container;
              break;
            }
          }
        }
      }
      
      // If we're over a unit, always return it
      // This ensures the unit gets isOver=true for placeholder animations
      if (targetUnit) {
        return [{id: targetUnit.id, data: targetUnit.data}];
      }
      
      // If not over any unit, use closestCenter as fallback
      return closestCenter(args);
    }
    
    // For all other drag types, use simple closestCenter
    return closestCenter(args);
  };

  // Define keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      action: () => setShowCreateDialog(true),
      description: 'Create new skeleton',
      category: 'Skeletons'
    },
    {
      key: 'h',
      action: () => {
        if (activeSkeletonId) {
          toast({
            title: 'Keyboard Shortcut',
            description: 'Hook frame section focused',
          });
          // Scroll to hook section (implementation depends on your DOM structure)
          document.querySelector('[data-unit-type="Hook"]')?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      description: 'Focus Hook section',
      category: 'Navigation'
    },
    {
      key: 'c',
      action: () => {
        if (activeSkeletonId) {
          toast({
            title: 'Keyboard Shortcut',
            description: 'Content frame section focused',
          });
          // Scroll to content section (implementation depends on your DOM structure)
          document.querySelector('[data-unit-type="Content"]')?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      description: 'Focus Content section',
      category: 'Navigation'
    },
    {
      key: 'o',
      action: () => {
        if (activeSkeletonId) {
          toast({
            title: 'Keyboard Shortcut',
            description: 'Outro frame section focused',
          });
          // Scroll to outro section (implementation depends on your DOM structure)
          document.querySelector('[data-unit-type="Outro"]')?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      description: 'Focus Outro section',
      category: 'Navigation'
    },
    {
      key: 'escape',
      action: () => {
        if (showCreateDialog) {
          setShowCreateDialog(false);
        }
        // Clear selected frame
        setSelectedFrameId(null);
      },
      description: 'Close current dialog / Clear selection',
      category: 'General'
    },
    // Frame movement shortcuts
    {
      key: 'alt+arrowup',
      action: () => moveFrameWithKeyboard('up'),
      description: 'Move selected frame up',
      category: 'Frame Movement'
    },
    {
      key: 'alt+arrowdown',
      action: () => moveFrameWithKeyboard('down'),
      description: 'Move selected frame down',
      category: 'Frame Movement'
    },
    {
      key: 'alt+arrowleft',
      action: () => moveFrameToUnit('prev'),
      description: 'Move frame to previous unit',
      category: 'Frame Movement'
    },
    {
      key: 'alt+arrowright',
      action: () => moveFrameToUnit('next'),
      description: 'Move frame to next unit',
      category: 'Frame Movement'
    }
  ];

  // Use the keyboard shortcuts hook
  const { helpVisible, setHelpVisible, shortcutsByCategory } = useKeyboardShortcuts(shortcuts);

  const handleDragStart = (event: DragStartEvent) => {
    const { active, activatorEvent } = event;
    setActiveId(active.id as string);
    setActiveDragData(active.data.current);
    
    // Store initial mouse position for immediate placeholder calculation
    if (activatorEvent && 'clientY' in activatorEvent) {
      (window as any).__dndKitPointerY = activatorEvent.clientY;
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Update pointer position for live tracking
    const { activatorEvent } = event;
    if (activatorEvent && 'clientY' in activatorEvent) {
      (window as any).__dndKitPointerY = activatorEvent.clientY;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Debug logging
    console.log('🎯 Drag end:', {
      activeType: active.data.current?.type,
      activeId: active.id,
      overId: over?.id,
      overType: over?.data.current?.type,
      overName: over?.data.current?.name,
      isUnit: over?.data.current?.type === 'unit'
    });

    // Only clear activeId after a brief delay to improve the transition visually
    setTimeout(() => {
      setActiveId(null);
      setActiveDragData(null);
      // Clean up window pointer tracking
      if ((window as any).__dndKitPointerY) {
        delete (window as any).__dndKitPointerY;
      }
    }, 50);

    if (!over) {
      console.log('❌ No drop target found');
      return;
    }

    const activeSkeleton = skeletons.find((s) => s.id === activeSkeletonId);
    if (!activeSkeleton) return;

    // Skip skeleton unit handling as it's now handled by UnitManager
    if (active.data.current?.type === 'skeleton-unit') {
      return;
    }

    // Handle tone or filter drops on frames
    if ((active.data.current?.type === 'tone' || active.data.current?.type === 'filter') && 
        over.data.current?.type === `${active.data.current.type}-target`) {
      const frameId = over.data.current.frameId;
      const value = active.data.current.value;

      if (activeSkeletonId) { // Add null check
        if (active.data.current.type === 'tone') {
          updateFrameTone(activeSkeletonId, frameId, value);
        } else {
          updateFrameFilter(activeSkeletonId, frameId, value);
        }
      }
      return;
    }

    const newFrames = [...activeSkeleton.frames];

    // Handle frame drops on other frames (both same unit and cross-unit)
    if ((active.data.current?.type === 'frame' || active.data.current?.type === 'template') && 
        over.data.current?.type === 'frame') {
      const overFrame = newFrames.find(f => f.id === over.id);
      if (!overFrame) return;

      // Get mouse position to determine if we should place above or below
      const overRect = document.getElementById(over.id as string)?.getBoundingClientRect();
      const mouseY = event.activatorEvent?.clientY || 0;
      const shouldPlaceBefore = overRect ? mouseY < (overRect.top + overRect.height / 2) : true;

      if (active.data.current?.type === 'template') {
        // Create new frame from template
        const template = active.data.current.frame as FrameTemplate;
        const newFrame = {
          id: nanoid(),
          name: template.name,
          type: template.name,
          content: template.example,
          unitType: overFrame.unitType, // Use the target frame's unit
          tone: '',
          filter: ''
        };

        // Find the index where to insert the new frame
        const overIndex = newFrames.findIndex(f => f.id === over.id);
        const insertIndex = shouldPlaceBefore ? overIndex : overIndex + 1;
        
        // Insert the new frame at the calculated position
        newFrames.splice(insertIndex, 0, newFrame);
        
        toast({
          title: 'Frame Added',
          description: `${template.name} added to ${overFrame.unitType}`,
        });
      } else {
        // Handle existing frame movement
        const activeFrame = newFrames.find(f => f.id === active.id);
        if (!activeFrame) return;

        const activeIndex = newFrames.findIndex(f => f.id === active.id);
        const overIndex = newFrames.findIndex(f => f.id === over.id);

        if (activeFrame.unitType === overFrame.unitType) {
          // Same unit reordering
          let targetIndex = shouldPlaceBefore ? overIndex : overIndex + 1;
          if (activeIndex < overIndex && shouldPlaceBefore) targetIndex--;
          if (activeIndex > overIndex && !shouldPlaceBefore) targetIndex--;
          
          const reorderedFrames = arrayMove(newFrames, activeIndex, targetIndex);
          updateFrameOrder(activeSkeleton.id, reorderedFrames);
          
          toast({
            title: 'Frame Repositioned',
            description: `Frame reordered within ${activeFrame.unitType}`,
          });
        } else {
          // Cross-unit movement
          // Remove from current position
          const frameToMove = newFrames.splice(activeIndex, 1)[0];
          
          // Update the unit type
          frameToMove.unitType = overFrame.unitType;
          
          // Find new position (accounting for the removal)
          let insertIndex = newFrames.findIndex(f => f.id === over.id);
          if (!shouldPlaceBefore) insertIndex++;
          
          // Insert at new position
          newFrames.splice(insertIndex, 0, frameToMove);
          
          updateFrameOrder(activeSkeleton.id, newFrames);
          
          toast({
            title: 'Frame Moved',
            description: `Frame moved to ${overFrame.unitType}`,
          });
        }
      }
      return;
    }

    // Handle frame drops on unit containers
    const unitType = over.data.current?.name;
    if (!unitType) return;

    // Get all frames in the target unit to determine insertion position
    const targetUnitFrames = newFrames.filter(f => 
      f.unitType && f.unitType.toLowerCase().trim() === unitType.toLowerCase().trim()
    );

    // Calculate insertion position based on mouse Y position
    let insertionIndex = newFrames.length; // Default to end
    
    if (event.activatorEvent && 'clientY' in event.activatorEvent) {
      const mouseY = event.activatorEvent.clientY;
      
      // Find the appropriate insertion point
      for (let i = 0; i < targetUnitFrames.length; i++) {
        const frameElement = document.getElementById(targetUnitFrames[i].id);
        if (frameElement) {
          const rect = frameElement.getBoundingClientRect();
          if (mouseY < rect.top + rect.height / 2) {
            // Insert before this frame
            insertionIndex = newFrames.findIndex(f => f.id === targetUnitFrames[i].id);
            break;
          } else if (i === targetUnitFrames.length - 1) {
            // Insert after the last frame
            insertionIndex = newFrames.findIndex(f => f.id === targetUnitFrames[i].id) + 1;
          }
        }
      }
    }

    if (active.data.current?.type === 'template') {
      // Create new frame from template
      const template = active.data.current.frame as FrameTemplate;
      const newFrame = {
        id: nanoid(),
        name: template.name,
        type: template.name,
        content: template.example,
        unitType,
        tone: '',
        filter: ''
      };

      // Insert at calculated position
      newFrames.splice(insertionIndex, 0, newFrame);
    } 
    else if (active.data.current?.type === 'frame') {
      const frameId = active.id as string;
      const currentIndex = newFrames.findIndex(f => f.id === frameId);

      if (currentIndex !== -1) {
        // Remove from current position
        const [movedFrame] = newFrames.splice(currentIndex, 1);
        
        // Update unit type
        movedFrame.unitType = unitType;
        
        // Adjust insertion index if we removed before it
        if (currentIndex < insertionIndex) {
          insertionIndex--;
        }
        
        // Insert at new position
        newFrames.splice(insertionIndex, 0, movedFrame);
      }
    }

    updateFrameOrder(activeSkeleton.id, newFrames);
  };

  const handleUpdateFrameAttribute = (frameId: string, type: 'tone' | 'filter', value: string) => {
    if (activeSkeletonId) { // Add null check
      if (type === 'tone') {
        updateFrameTone(activeSkeletonId, frameId, value);
      } else {
        updateFrameFilter(activeSkeletonId, frameId, value);
      }
    }
  };

  const deleteFrame = (frameId: string) => {
    const activeSkeleton = skeletons.find((s) => s.id === activeSkeletonId);
    if (!activeSkeleton) return;

    const newFrames = activeSkeleton.frames.filter(f => f.id !== frameId);
    updateFrameOrder(activeSkeleton.id, newFrames);
    
    // Clear selection if the deleted frame was selected
    if (selectedFrameId === frameId) {
      setSelectedFrameId(null);
    }
  };

  // Use mobile detection
  const mobileCheck = useIsMobile();
  const isMobile = mobileCheck.isMobile;

  // Import the mobile layout components
  const MobileLayout = React.lazy(() => import('../components/mobile/MobileLayout'));
  const SafeAreaProvider = React.lazy(() => import('../components/ui/safe-area').then(m => ({ default: m.SafeAreaProvider })));
  
  // Auto-scroll configuration for drag and drop
  const autoScrollOptions = {
    // Enable auto-scrolling
    enabled: true,
    // Speed and acceleration
    threshold: {
      x: 0.2, // 20% from edge
      y: 0.2  // 20% from edge
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      autoScroll={autoScrollOptions}
    >
      {isMobile ? (
        // Mobile layout
        <React.Suspense fallback={<div className="p-4 text-center">Loading mobile view...</div>}>
          <SafeAreaProvider />
          <div className="mobile-layout">
            <MobileLayout onDeleteFrame={deleteFrame} />
            <CreateSkeletonDialog 
              open={showCreateDialog} 
              onOpenChange={setShowCreateDialog}
            />
          </div>
        </React.Suspense>
      ) : (
        // Desktop layout
        <div className="flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">

            <div className="flex-1 overflow-auto">
              <Workspace 
                activeId={activeId}
                activeDragData={activeDragData}
                onDeleteFrame={deleteFrame}
                onUpdateFrameAttribute={handleUpdateFrameAttribute}
                onOpenCreateDialog={() => setShowCreateDialog(true)}
                selectedFrameId={selectedFrameId}
                onSelectFrame={setSelectedFrameId}
              />
            </div>
          </div>
          <CreateSkeletonDialog 
            open={showCreateDialog} 
            onOpenChange={setShowCreateDialog}
          />
          <WelcomeScreen
            open={showWelcomeScreen}
            onOpenChange={setShowWelcomeScreen}
            onShowSkeletonCreator={() => {
              setShowWelcomeScreen(false);
              setShowCreateDialog(true);
            }}
          />
          <KeyboardShortcutsHelp
            open={helpVisible}
            onOpenChange={setHelpVisible}
            shortcutsByCategory={shortcutsByCategory}
          />
          <PartnerAgent />
        </div>
      )}
    </DndContext>
  );
}