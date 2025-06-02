import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, GripVertical, Zap } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import type { Skeleton } from '@/types';

interface CustomSkeletonBuilderProps {
  onCreateSkeleton: (skeleton: Skeleton) => void;
}

const AVAILABLE_UNITS = [
  'Hook',
  'Problem Expansion',
  'Intro', 
  'Content Journey',
  'Content Delivery',
  'Process',
  'Testing',
  'Event',
  'Case Study',
  'Practical Application',
  'Story Setup',
  'Climax',
  'Reflection',
  'Rehook',
  'Outro',
  'Call To Action'
];

const CONTENT_TYPES = [
  { value: 'short', label: 'Short Form (15s-3min)' },
  { value: 'long', label: 'Long Form (<20min)' }
];

interface SortableUnitProps {
  id: string;
  unit: string;
  onRemove: (id: string) => void;
}

function SortableUnit({ id, unit, onRemove }: SortableUnitProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      
      <Badge variant="outline" className="flex-1 justify-start">
        {unit}
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(id)}
        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export default function CustomSkeletonBuilder({ onCreateSkeleton }: CustomSkeletonBuilderProps) {
  const [skeletonName, setSkeletonName] = useState('');
  const [contentType, setContentType] = useState<'short' | 'long'>('short');
  const [selectedUnits, setSelectedUnits] = useState<Array<{ id: string; unit: string }>>([]);
  const [selectedUnit, setSelectedUnit] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSelectedUnits((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addUnit = () => {
    if (selectedUnit && selectedUnit !== '') {
      const newUnit = {
        id: nanoid(),
        unit: selectedUnit
      };
      setSelectedUnits([...selectedUnits, newUnit]);
      setSelectedUnit('');
    }
  };

  const removeUnit = (id: string) => {
    setSelectedUnits(selectedUnits.filter(item => item.id !== id));
  };

  const handleCreateSkeleton = () => {
    if (!skeletonName.trim() || selectedUnits.length === 0) {
      return;
    }

    const skeleton: Skeleton = {
      id: nanoid(),
      name: skeletonName,
      units: selectedUnits.map(item => item.unit),
      frames: [], // Start with empty frames - users will add them in the workspace
      contentType
    };

    onCreateSkeleton(skeleton);
  };

  const isFormValid = skeletonName.trim() !== '' && selectedUnits.length > 0;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="skeleton-name" className="text-sm font-medium">
            Skeleton Name
          </Label>
          <Input
            id="skeleton-name"
            value={skeletonName}
            onChange={(e) => setSkeletonName(e.target.value)}
            placeholder="e.g., My Custom Structure"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Content Type</Label>
          <Select value={contentType} onValueChange={(value: 'short' | 'long') => setContentType(value)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Build Your Structure</h4>
        
        <div className="flex gap-2 mb-4">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose a unit to add..." />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={addUnit} 
            disabled={!selectedUnit}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {selectedUnits.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Zap className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Add units above to build your custom structure
              </p>
              <p className="text-xs text-gray-400 mt-1">
                You can reorder them by dragging once added
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Your Structure ({selectedUnits.length} units)</Label>
              <p className="text-xs text-gray-500">Drag to reorder</p>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedUnits.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {selectedUnits.map((item) => (
                    <SortableUnit
                      key={item.id}
                      id={item.id}
                      unit={item.unit}
                      onRemove={removeUnit}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <Button 
          onClick={handleCreateSkeleton}
          disabled={!isFormValid}
          className="w-full"
        >
          Create Custom Skeleton
        </Button>
        {!isFormValid && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Please provide a name and add at least one unit to continue
          </p>
        )}
      </div>
    </div>
  );
}