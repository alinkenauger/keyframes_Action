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
import { creatorTemplates, getTemplateCategories, filterTemplatesByCategory, CategoryCreatorTemplate, TemplateCategory } from '@/lib/creatorTemplates';
import { SKELETON_UNITS } from '@/lib/constants';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay, useDroppable, useDraggable } from '@dnd-kit/core';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';

interface CreateSkeletonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSkeletonDialog({ open, onOpenChange }: CreateSkeletonDialogProps) {
  const [name, setName] = useState('');
  const [videoContext, setVideoContext] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [contentType, setContentType] = useState<'short' | 'long'>('long');
  const { addSkeleton, setActiveSkeletonId, setVideoContext: setStoreVideoContext } = useWorkspace();

  function handleTemplateSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Find the selected template
    const selectedTemplate = CREATOR_TEMPLATES.find(template => template.id === selectedCreator);
    if (!selectedTemplate) return;

    // Create a new skeleton based on the selected template
    const newSkeleton = {
      id: nanoid(),
      name: name || selectedTemplate.name,
      units: selectedTemplate.units,
      frames: [], // Frames will be populated when the skeleton is created
      contentType: contentType,
    };

    // Add the skeleton and set it as active
    const createdSkeleton = addSkeleton(newSkeleton);
    setActiveSkeletonId(createdSkeleton.id);
    
    // Set the video context
    if (videoContext) {
      setStoreVideoContext(createdSkeleton.id, videoContext);
    }

    // Close the dialog
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[700px] overflow-hidden flex flex-col">
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
                      All Templates
                    </button>
                    {getTemplateCategories().map((category) => (
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
                  
                  <div className="h-[450px] border rounded-md p-4 overflow-auto">
                    <RadioGroup
                      value={selectedCreator || ''}
                      onValueChange={setSelectedCreator}
                      className="pb-16"
                    >
                      {(selectedCategory === 'all' 
                        ? creatorTemplates 
                        : creatorTemplates.filter((t: CategoryCreatorTemplate) => t.category === selectedCategory)
                      ).filter((t: CategoryCreatorTemplate) => t.id !== 'mrbeast').map((template: CategoryCreatorTemplate) => (
                        <div key={template.id} className="flex items-center space-x-2 mb-4 touch-target border-b pb-3">
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
                              {template.units.length} units - {
                                template.units.join(' → ')
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4 sticky bottom-0 pt-2 bg-background z-10 border-t">
                <Button 
                  type="submit" 
                  disabled={!selectedCreator || !videoContext} 
                  className="w-full sm:w-auto"
                >
                  Create From Template
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 overflow-y-auto">
            <div className="p-4 text-center">
              <p>Custom skeleton builder coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}