import SkeletonUnit from './SkeletonUnit';
import { SimpleDraggableUnit } from './SimpleDraggableUnit';
import { useWorkspace } from '@/lib/store';
import type { Skeleton as SkeletonType } from '@/types';
import { SKELETON_UNITS } from '@/lib/constants';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Wand2, VideoIcon } from 'lucide-react';
import { adaptFrameContent } from '@/lib/ai-service';
import GenerateScriptButton from '../script/GenerateScriptButton';
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
  selectedFrameId?: string | null;
  onSelectFrame?: (frameId: string) => void;
}


export default function Skeleton({ skeleton, onDeleteFrame, onReorderFrames, onReorderUnits, selectedFrameId, onSelectFrame }: SkeletonProps) {
  const { toast } = useToast();
  const { updateSkeletonUnits, updateFrameOrder, updateFrameContent } = useWorkspace();
  const [enhancing, setEnhancing] = useState(false);
  const [showAddUnitPopover, setShowAddUnitPopover] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [draggedUnitIndex, setDraggedUnitIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  // Drag handlers for units
  const handleUnitDragStart = (unitId: string, index: number) => {
    setDraggedUnitIndex(index);
  };

  const handleUnitDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUnitDrop = (targetIndex: number) => {
    if (draggedUnitIndex === null || draggedUnitIndex === targetIndex) {
      setDraggedUnitIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newUnits = [...templateUnits];
    const [movedUnit] = newUnits.splice(draggedUnitIndex, 1);
    newUnits.splice(targetIndex, 0, movedUnit);

    updateSkeletonUnits(skeleton.id, newUnits);
    
    toast({
      title: 'Unit Reordered',
      description: `${movedUnit} has been moved`,
    });

    setDraggedUnitIndex(null);
    setDragOverIndex(null);
  };

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
          
          {/* Script Generation Button */}
          <GenerateScriptButton />
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

      <div className="flex-1 overflow-x-auto min-w-max">
        <div className="flex gap-2 p-2 rounded-lg border bg-background" style={{ minHeight: "calc(100vh - 180px)" }}>
          {units.map((unit, index) => (
            <SimpleDraggableUnit
              key={unit.id}
              unit={unit}
              index={index}
              onDragStart={handleUnitDragStart}
              onDragOver={handleUnitDragOver}
              onDrop={handleUnitDrop}
              isDragging={draggedUnitIndex === index}
              dragOverIndex={dragOverIndex}
              onDeleteFrame={onDeleteFrame}
              onReorderFrames={onReorderFrames}
              onDuplicateUnit={handleDuplicateUnit}
              onDeleteUnit={handleDeleteUnit}
              selectedFrameId={selectedFrameId}
              onSelectFrame={onSelectFrame}
            />
          ))}
        </div>
      </div>
    </div>
  );
}