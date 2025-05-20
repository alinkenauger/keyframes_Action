import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import SkeletonUnit from './SkeletonUnit';
import { useWorkspace } from '@/lib/store';
import type { Skeleton as SkeletonType } from '@/types';
import { SKELETON_UNITS } from '@/lib/constants';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Wand2 } from 'lucide-react';
import { adaptFrameContent } from '@/lib/ai-service';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';

interface SkeletonProps {
  skeleton: SkeletonType;
  onDeleteFrame?: (frameId: string) => void;
  onReorderFrames?: (fromId: string, toId: string, unitType: string) => void;
  onReorderUnits?: (fromIndex: number, toIndex: number) => void;
}

function DraggableUnit({ unit, children }: { unit: any, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: unit.id,
    data: {
      type: 'skeleton-unit',
      unit
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "flex items-center group relative w-full",
        isDragging && "ring-2 ring-primary"
      )}
    >
      <div 
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab touch-manipulation z-10 p-1.5 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes} 
        {...listeners}
      >
        <div className="w-4 h-4 flex flex-col gap-1">
          <div className="h-[2px] bg-gray-400 rounded"></div>
          <div className="h-[2px] bg-gray-400 rounded"></div>
          <div className="h-[2px] bg-gray-400 rounded"></div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Skeleton({ skeleton, onDeleteFrame, onReorderFrames, onReorderUnits }: SkeletonProps) {
  const { toast } = useToast();
  const { updateSkeletonUnits, updateFrameOrder, updateFrameContent } = useWorkspace();
  const [enhancing, setEnhancing] = useState(false);
  const [showAddUnitPopover, setShowAddUnitPopover] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  // Get units from skeleton if available, otherwise use defaults
  const templateUnits = skeleton.units || ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Outro'];

  // Map units to their full data structure
  const units = templateUnits.map(unitName => {
    const unitData = SKELETON_UNITS.find(u => u.type === unitName) || {
      type: unitName,
      description: '',
      examples: []
    };

    // Filter frames to only those belonging to this unit
    const unitFrames = skeleton.frames.filter(frame => 
      frame.unitType && frame.unitType.toLowerCase() === unitName.toLowerCase()
    );

    return {
      id: unitData.type.toLowerCase().replace(/\s+/g, '-'),
      name: unitData.type,
      frames: unitFrames
    };
  });

  // Handle reordering of units
  const handleReorderUnits = (fromIndex: number, toIndex: number) => {
    if (onReorderUnits) {
      onReorderUnits(fromIndex, toIndex);
    } else {
      if (fromIndex === toIndex) return;

      const newUnits = [...templateUnits];
      const [removed] = newUnits.splice(fromIndex, 1);
      newUnits.splice(toIndex, 0, removed);

      updateSkeletonUnits(skeleton.id, newUnits);

      toast({
        title: 'Unit Reordered',
        description: `${removed} unit has been moved`,
      });
    }
  };

  // Handle duplicating a unit
  const handleDuplicateUnit = (unitName: string) => {
    const newUnits = [...templateUnits];
    const duplicateUnit = `${unitName} Copy`;
    const insertIndex = newUnits.indexOf(unitName) + 1;
    newUnits.splice(insertIndex, 0, duplicateUnit);

    // Duplicate frames in this unit
    const unitFrames = skeleton.frames.filter(f => f.unitType === unitName);
    const newFrames = [...skeleton.frames];

    unitFrames.forEach(frame => {
      newFrames.push({
        ...frame,
        id: nanoid(),
        unitType: duplicateUnit
      });
    });

    updateSkeletonUnits(skeleton.id, newUnits);
    updateFrameOrder(skeleton.id, newFrames);

    toast({
      title: 'Unit Duplicated',
      description: `${unitName} unit has been duplicated with its frames`,
    });
  };

  // Handle deleting a unit
  const handleDeleteUnit = (unitName: string) => {
    if (templateUnits.length <= 1) {
      toast({
        title: 'Cannot Delete Unit',
        description: 'A skeleton must have at least one unit',
        variant: 'destructive'
      });
      return;
    }

    const newUnits = templateUnits.filter(unit => unit !== unitName);
    const newFrames = skeleton.frames.filter(frame => frame.unitType !== unitName);

    updateSkeletonUnits(skeleton.id, newUnits);
    updateFrameOrder(skeleton.id, newFrames);

    toast({
      title: 'Unit Deleted',
      description: `${unitName} unit and its frames have been removed`,
    });
  };

  // Handle adding a new unit
  const handleAddUnit = () => {
    if (!selectedUnit) return;

    const newUnits = [...templateUnits, selectedUnit];
    updateSkeletonUnits(skeleton.id, newUnits);

    toast({
      title: 'Unit Added',
      description: `${selectedUnit} unit has been added`,
    });

    setSelectedUnit("");
    setShowAddUnitPopover(false);
  };

  // Available units that can be added
  const availableUnits = SKELETON_UNITS.filter(
    unit => !templateUnits.includes(unit.type)
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-xl font-bold">{skeleton.name}</h2>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => {
              // Global enhance functionality
              toast({
                title: "Enhancing all content",
                description: "Upgrading all frames with their selected tones and filters...",
              });
              
              // Find all frames with both tone and filter set
              const framesToEnhance = skeleton.frames.filter(frame => frame.tone && frame.filter);
              
              // For each frame, adapt the content
              framesToEnhance.forEach(async (frame) => {
                try {
                  const adaptedContent = await adaptFrameContent(
                    frame.content || '',
                    frame.tone || '',
                    frame.filter || '',
                    frame.type || '',
                    frame.unitType || ''
                  );
                  
                  if (adaptedContent) {
                    // Use the store's updateFrameContent method
                    updateFrameContent(skeleton.id, frame.id, adaptedContent);
                  }
                } catch (error) {
                  console.error(`Error enhancing frame ${frame.id}:`, error);
                }
              });
              
              // Show completion message after 2 seconds
              setTimeout(() => {
                toast({
                  title: "Enhancement complete",
                  description: `Enhanced ${framesToEnhance.length} frames with AI`,
                });
              }, 2000);
            }}
          >
            <span className="text-lg mr-1">🪄</span> Enhance All
          </Button>
          <Popover open={showAddUnitPopover} onOpenChange={setShowAddUnitPopover}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Add Unit
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Add New Unit</h3>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(unit => (
                      <SelectItem key={unit.type} value={unit.type}>
                        {unit.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAddUnit} 
                  disabled={!selectedUnit}
                  className="w-full"
                >
                  Add Unit
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <SortableContext 
        items={units.map(unit => unit.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-x-auto min-w-max">
          <ResizablePanelGroup 
            direction="horizontal" 
            className="rounded-lg border bg-background"
            style={{ minHeight: "calc(100vh - 180px)" }}
          >
            {units.map((unit, index) => (
              <DraggableUnit key={unit.id} unit={unit}>
                <ResizablePanel 
                  defaultSize={100 / units.length}
                  minSize={15}
                  className="min-w-[300px] h-full"
                >
                  <div className="h-full flex flex-col">
                    <SkeletonUnit 
                      {...unit} 
                      onDeleteFrame={onDeleteFrame}
                      onReorderFrames={onReorderFrames}
                      onDuplicateUnit={handleDuplicateUnit}
                      onDeleteUnit={handleDeleteUnit}
                    />
                  </div>
                </ResizablePanel>
                {index < units.length - 1 && <ResizableHandle />}
              </DraggableUnit>
            ))}
          </ResizablePanelGroup>
        </div>
      </SortableContext>
    </div>
  );
}