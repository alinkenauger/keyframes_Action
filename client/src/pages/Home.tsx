import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/lib/store';
import Workspace from '@/components/workspace/Workspace';
import Sidebar from '@/components/sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Keyboard } from 'lucide-react';
import CreateSkeletonDialog from '@/components/skeleton/CreateSkeletonDialog';
import { DndContext, DragStartEvent, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import type { FrameTemplate } from '@/lib/frameLibrary';
import { useKeyboardShortcuts, KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '@/components/ui/keyboard-shortcuts-help';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const { toast } = useToast();
  const { addSkeleton, setActiveSkeletonId, updateFrameOrder, skeletons, activeSkeletonId, updateFrameTone, updateFrameFilter, updateSkeletonUnits } = useWorkspace();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    // Create an empty default skeleton with no pre-loaded frames
    const skeleton = {
      id: nanoid(),
      name: "Emma Chamberlain's Lifestyle & Comedy",
      frames: [], // Empty frames array - no pre-loaded frames
    };
    addSkeleton(skeleton);
  }, []);

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
      },
      description: 'Close current dialog',
      category: 'General'
    }
  ];

  // Use the keyboard shortcuts hook
  const { helpVisible, setHelpVisible, shortcutsByCategory } = useKeyboardShortcuts(shortcuts);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveDragData(active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Only clear activeId after a brief delay to improve the transition visually
    setTimeout(() => {
      setActiveId(null);
      setActiveDragData(null);
    }, 50);

    if (!over) return;

    const activeSkeleton = skeletons.find((s) => s.id === activeSkeletonId);
    if (!activeSkeleton) return;

    // Handle skeleton unit reordering
    if (active.data.current?.type === 'skeleton-unit' && over.data.current?.type === 'skeleton-unit') {
      const fromId = active.id as string;
      const toId = over.id as string;

      // Find the units in the array
      const units = activeSkeleton.units || [];
      const fromIndex = units.findIndex(unitName => {
        const unitId = unitName.toLowerCase().replace(' ', '-');
        return unitId === fromId;
      });

      const toIndex = units.findIndex(unitName => {
        const unitId = unitName.toLowerCase().replace(' ', '-');
        return unitId === toId;
      });

      if (fromIndex !== -1 && toIndex !== -1 && activeSkeletonId) { // Add null check here
        // Reorder the units
        const newUnits = [...units];
        const [movedUnit] = newUnits.splice(fromIndex, 1);
        newUnits.splice(toIndex, 0, movedUnit);

        // Update the skeleton with new unit order
        updateSkeletonUnits(activeSkeletonId, newUnits);

        toast({
          title: 'Unit Reordered',
          description: `${movedUnit} unit has been moved`,
        });

        return;
      }
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

    // Handle frame reordering within the same unit
    if (active.data.current?.type === 'frame' && over.data.current?.type === 'frame') {
      const activeFrame = newFrames.find(f => f.id === active.id);
      const overFrame = newFrames.find(f => f.id === over.id);

      // Only reorder if both frames are from the same unit
      if (activeFrame && overFrame && activeFrame.unitType === overFrame.unitType) {
        const activeIndex = newFrames.findIndex(f => f.id === active.id);
        const overIndex = newFrames.findIndex(f => f.id === over.id);

        // Use arrayMove from dnd-kit to reorder the frames
        const reorderedFrames = arrayMove(newFrames, activeIndex, overIndex);
        updateFrameOrder(activeSkeleton.id, reorderedFrames);

        // Show a toast notification
        toast({
          title: 'Frame Reordered',
          description: `Frame reordered within ${activeFrame.unitType}`,
        });
        return;
      }
    }

    // Handle frame drops on unit containers
    const unitType = over.data.current?.name;
    if (!unitType) return;

    if (active.data.current?.type === 'template') {
      // Create new frame from template, preserving the original frame's properties
      const template = active.data.current.frame as FrameTemplate;
      const newFrame = {
        id: nanoid(),
        name: template.name,           // Keep the original frame name (e.g., "Bold Statement")
        type: template.name,       // Use the template name as the type (e.g., "Bold Statement")
        content: template.example,     // Use the example as initial content
        unitType,                      // Set the unit location (where it's dropped)
        tone: '',
        filter: ''
      };

      newFrames.push(newFrame);
    } 
    else if (active.data.current?.type === 'frame') {
      const frameId = active.id as string;
      const frameIndex = newFrames.findIndex(f => f.id === frameId);

      if (frameIndex !== -1) {
        // Only update the unitType, preserve everything else
        newFrames[frameIndex] = {
          ...newFrames[frameIndex],
          unitType
        };
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
  };

  // Use mobile detection
  const mobileCheck = useIsMobile();
  const isMobile = mobileCheck.isMobile;

  // Import the mobile layout components
  const MobileLayout = React.lazy(() => import('../components/mobile/MobileLayout'));
  const SafeAreaProvider = React.lazy(() => import('../components/ui/safe-area').then(m => ({ default: m.SafeAreaProvider })));

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
            <div className="p-2 md:p-4 border-b flex flex-wrap justify-between items-center gap-2">
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="w-full sm:w-auto touch-target"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Skeleton
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setHelpVisible(true)}
                className="w-full sm:w-auto touch-target"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Keyboard Shortcuts
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <Workspace 
                activeId={activeId}
                activeDragData={activeDragData}
                onDeleteFrame={deleteFrame}
                onUpdateFrameAttribute={handleUpdateFrameAttribute}
              />
            </div>
          </div>
          <CreateSkeletonDialog 
            open={showCreateDialog} 
            onOpenChange={setShowCreateDialog}
          />
          <KeyboardShortcutsHelp
            open={helpVisible}
            onOpenChange={setHelpVisible}
            shortcutsByCategory={shortcutsByCategory}
          />
        </div>
      )}
    </DndContext>
  );
}