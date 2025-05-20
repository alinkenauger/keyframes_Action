import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkspace } from '@/lib/store';
import { CREATOR_TEMPLATES, FRAME_TEMPLATES } from '@/lib/frameLibrary';
import { CREATOR_TEMPLATES_BY_CATEGORY, getAllCategories, getTemplatesByCategory, CategoryCreatorTemplate, TemplateCategory } from '@/lib/creatorTemplates';
import { SKELETON_UNITS } from '@/lib/constants';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay, useDroppable, useDraggable } from '@dnd-kit/core';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';

interface CreateSkeletonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DraggableUnit({ unit }: { unit: typeof SKELETON_UNITS[0] }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: unit.type,
    data: {
      type: 'unit',
      unit
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 cursor-grab touch-manipulation"
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <h4 className="font-medium mb-1">{unit.type}</h4>
        <p className="text-sm text-muted-foreground">{unit.description}</p>
        <div className="mt-2 text-xs text-muted-foreground">
          Examples: {unit.examples.join(', ')}
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonDropArea({ children, isOver }: { children: React.ReactNode; isOver: boolean }) {
  const { setNodeRef } = useDroppable({
    id: 'skeleton-drop-area',
    data: {
      type: 'skeleton-drop-area',
      accepts: ['unit']
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-[400px] rounded-md border p-4",
        isOver ? "bg-muted border-dashed border-2 border-primary" : "bg-muted/5"
      )}
    >
      {children}
    </div>
  );
}

export default function CreateSkeletonDialog({ open, onOpenChange }: CreateSkeletonDialogProps) {
  const [name, setName] = useState('');
  const [videoContext, setVideoContext] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [draggedUnit, setDraggedUnit] = useState<typeof SKELETON_UNITS[0] | null>(null);
  const [isDropAreaOver, setIsDropAreaOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [contentType, setContentType] = useState<'short' | 'long'>('long');
  const { addSkeleton, setActiveSkeletonId, setVideoContext: setStoreVideoContext } = useWorkspace();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedUnit = SKELETON_UNITS.find(unit => unit.type === active.id);
    if (draggedUnit) {
      setDraggedUnit(draggedUnit);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedUnit(null);
    setIsDropAreaOver(false);

    if (over && over.id === 'skeleton-drop-area') {
      // Allow adding the same unit type multiple times
      setSelectedUnits([...selectedUnits, active.id as string]);
    }
  };

  const handleDragOver = () => {
    setIsDropAreaOver(true);
  };

  const handleDragCancel = () => {
    setDraggedUnit(null);
    setIsDropAreaOver(false);
  };

  function handleTemplateSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedCreator) {
      // Try to find the selected template in either the standard templates or category templates
      const standardTemplate = CREATOR_TEMPLATES.find(s => s.id === selectedCreator);
      const categoryTemplate = CREATOR_TEMPLATES_BY_CATEGORY.find(s => s.id === selectedCreator);
      
      const template = standardTemplate || categoryTemplate;
      
      if (template) {
        const skeletonId = nanoid();
        
        // Create frame objects based on the template's frame recommendations
        const frames = [];
        
        // If the template has specific frames, add them to the skeleton
        if (template.frames) {
          for (const unitFrames of template.frames) {
            const unitType = unitFrames.unitType;
            
            // Get the specific frames for this unit
            for (const frameId of unitFrames.frameIds) {
              // Find the frame template from the library
              const frameTemplate = FRAME_TEMPLATES.find(f => f.id === frameId);
              if (frameTemplate) {
                // Check if we have a specific example for this frame in the creator template
                let content = frameTemplate.example || '';
                
                // Look for example content from the creator template
                if (unitFrames.examples) {
                  const example = unitFrames.examples.find(e => e.frameId === frameId);
                  if (example && example.content) {
                    content = example.content;
                  }
                }
                
                // Create a new frame object
                frames.push({
                  id: nanoid(),
                  name: frameTemplate.name,
                  type: frameTemplate.id,
                  content: content,
                  unitType: unitType,
                  isTemplateExample: true // Flag to prevent automatic AI adaptation
                });
              }
            }
          }
        }
        
        // Create the new skeleton with the frames
        const newSkeleton = {
          id: skeletonId,
          name: name || template.name,
          frames: frames,
          units: template.units,
          contentType: categoryTemplate ? (contentType as 'short' | 'long') : undefined
        };

        addSkeleton(newSkeleton);
        
        // Set the video context in the store
        if (videoContext) {
          setStoreVideoContext(skeletonId, videoContext);
        }
        
        setActiveSkeletonId(newSkeleton.id);
        resetForm();
        onOpenChange(false);
      }
    }
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedUnits.length > 0) {
      const skeletonId = nanoid();
      const newSkeleton = {
        id: skeletonId,
        name: name || 'Custom Skeleton',
        frames: [], // No pre-loaded frames
      };

      addSkeleton(newSkeleton);
      // Set the video context in the store
      if (videoContext) {
        setStoreVideoContext(skeletonId, videoContext);
      }
      setActiveSkeletonId(newSkeleton.id);
      resetForm();
      onOpenChange(false);
    }
  }

  const resetForm = () => {
    setName('');
    setVideoContext('');
    setSelectedCreator(null);
    setSelectedUnits([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Skeleton</DialogTitle>
          <DialogDescription>
            Build a content structure for your video by selecting a template or creating a custom skeleton
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="template" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="template">Use Template</TabsTrigger>
            <TabsTrigger value="custom">Custom Build</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="flex-1 overflow-hidden flex flex-col">
            <form onSubmit={handleTemplateSubmit} className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <div className="grid gap-4 flex-1 overflow-hidden">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My YouTube Script"
                    className="touch-target"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="video-context">What is this video about?</Label>
                  <Textarea
                    id="video-context"
                    value={videoContext}
                    onChange={(e) => setVideoContext(e.target.value)}
                    placeholder="Describe your video's main topic, goals, and target audience..."
                    className="min-h-[80px] touch-target"
                  />
                </div>

                <div className="grid gap-2 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <Label>Choose a Creator Template</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="content-type" className="text-xs">Content:</Label>
                      <div className="flex border rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setContentType('short')}
                          className={cn(
                            "px-2 py-1 text-xs",
                            contentType === 'short'
                              ? "bg-primary text-primary-foreground"
                              : "bg-background hover:bg-muted"
                          )}
                        >
                          Short
                        </button>
                        <button
                          type="button"
                          onClick={() => setContentType('long')}
                          className={cn(
                            "px-2 py-1 text-xs",
                            contentType === 'long'
                              ? "bg-primary text-primary-foreground"
                              : "bg-background hover:bg-muted"
                          )}
                        >
                          Long
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        selectedCategory === 'all'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      All Categories
                    </button>
                    {getAllCategories().map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  <ScrollArea className="flex-1 rounded-md border p-4 touch-pan-y">
                    <RadioGroup
                      value={selectedCreator || ''}
                      onValueChange={setSelectedCreator}
                      className="pb-16" // Extra padding at bottom to ensure visibility on mobile
                    >
                      {/* Show GMV Foundation Template first */}
                      {CREATOR_TEMPLATES.filter(t => t.id !== 'mrbeast').map((template) => (
                        <div key={template.id} className="flex items-center space-x-2 mb-4 touch-target border-b pb-3">
                          <RadioGroupItem 
                            value={template.id} 
                            id={template.id} 
                            className="h-5 w-5" // Larger touch target
                          />
                          <div className="grid gap-1.5">
                            <Label htmlFor={template.id} className="font-medium">
                              {template.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {template.units.length} units - {
                                template.units.join(' → ')
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Categorized Templates */}
                      {selectedCategory === 'all' 
                        ? CREATOR_TEMPLATES_BY_CATEGORY.filter(template => template.contentTypes.includes(contentType)).map((template) => (
                          <div key={template.id} className="flex items-center space-x-2 mb-4 touch-target">
                            <RadioGroupItem 
                              value={template.id} 
                              id={template.id} 
                              className="h-5 w-5"
                            />
                            <div className="grid gap-1.5">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={template.id} className="font-medium">
                                  {template.name}
                                </Label>
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  {template.category}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {template.units.length} units - {
                                  template.units.join(' → ')
                                }
                              </p>
                            </div>
                          </div>
                        ))
                        : getTemplatesByCategory(selectedCategory).filter(template => template.contentTypes.includes(contentType)).map((template) => (
                          <div key={template.id} className="flex items-center space-x-2 mb-4 touch-target">
                            <RadioGroupItem 
                              value={template.id} 
                              id={template.id} 
                              className="h-5 w-5"
                            />
                            <div className="grid gap-1.5">
                              <Label htmlFor={template.id} className="font-medium">
                                {template.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {template.units.length} units - {
                                  template.units.join(' → ')
                                }
                              </p>
                            </div>
                          </div>
                        ))
                      }
                    </RadioGroup>
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter className="mt-4 sticky bottom-0 pt-2 bg-background z-10 border-t">
                <Button type="submit" disabled={!selectedCreator} className="w-full sm:w-auto touch-target">
                  Create From Template
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 overflow-hidden flex flex-col">
            <form onSubmit={handleCustomSubmit} className="flex-1 overflow-hidden flex flex-col">
              <div className="grid gap-4 flex-1 overflow-hidden">
                <div className="grid gap-2">
                  <Label htmlFor="custom-name">Name</Label>
                  <Input
                    id="custom-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My Custom Format"
                    className="touch-target"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="custom-video-context">What is this video about?</Label>
                  <Textarea
                    id="custom-video-context"
                    value={videoContext}
                    onChange={(e) => setVideoContext(e.target.value)}
                    placeholder="Describe your video's main topic, goals, and target audience..."
                    className="min-h-[80px] touch-target"
                  />
                </div>

                <DndContext
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragCancel={handleDragCancel}
                  collisionDetection={closestCenter}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-hidden">
                    <div className="overflow-hidden flex flex-col">
                      <Label>Available Units</Label>
                      <ScrollArea className="h-[400px] rounded-md border p-4 touch-pan-y">
                        <div className="space-y-2 pb-8">
                          {SKELETON_UNITS.map((unit) => (
                            <DraggableUnit key={unit.type} unit={unit} />
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="overflow-hidden flex flex-col">
                      <Label>Your Skeleton Structure</Label>
                      <SkeletonDropArea isOver={isDropAreaOver}>
                        {selectedUnits.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center mt-8">
                            Drag units here to build your skeleton
                          </p>
                        ) : (
                          <ScrollArea className="h-full touch-pan-y">
                            <div className="space-y-2 pb-16"> {/* Extra padding to ensure scrollability on mobile */}
                              {selectedUnits.map((unit, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-background rounded-md border flex items-center justify-between"
                                >
                                  <span>{unit}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedUnits(selectedUnits.filter((_, i) => i !== index))}
                                    className="touch-target"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </SkeletonDropArea>
                    </div>
                  </div>

                  <DragOverlay>
                    {draggedUnit && <DraggableUnit unit={draggedUnit} />}
                  </DragOverlay>
                </DndContext>

                <DialogFooter className="mt-4 sticky bottom-0 pt-2 bg-background z-10 border-t">
                  <Button 
                    type="submit" 
                    disabled={selectedUnits.length === 0} 
                    className="w-full sm:w-auto touch-target"
                  >
                    Create Custom Skeleton
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}