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
import { Camera, Video, Smartphone, ShoppingBag, BarChart, Film, Utensils, Gamepad, Tv, ImageIcon, Bike, Home, Flower, Brain, Pencil } from 'lucide-react';

interface CreateSkeletonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Category icon mapping
const getCategoryIcon = (category: TemplateCategory | 'all') => {
  switch(category) {
    case 'all':
      return <ShoppingBag size={18} />;
    case 'Animation':
      return <Pencil size={18} />;
    case 'Automotive':
      return <Bike size={18} />;
    case 'Beauty':
      return <ShoppingBag size={18} />;
    case 'Business':
      return <BarChart size={18} />;
    case 'Cooking':
      return <Utensils size={18} />;
    case 'Education':
      return <Brain size={18} />;
    case 'Entertainment':
      return <Tv size={18} />;
    case 'Filmmaking':
      return <Film size={18} />;
    case 'Finance':
      return <BarChart size={18} />;
    case 'Gaming':
      return <Gamepad size={18} />;
    case 'Gardening':
      return <Flower size={18} />;
    case 'Lifestyle':
      return <Home size={18} />;
    case 'Mental Health':
      return <Brain size={18} />;
    case 'Photography':
      return <ImageIcon size={18} />;
    case 'Sports':
      return <Bike size={18} />;
    case 'Technology':
      return <Smartphone size={18} />;
    default:
      return <ShoppingBag size={18} />;
  }
};

export default function CreateSkeletonDialog({ open, onOpenChange }: CreateSkeletonDialogProps) {
  const [name, setName] = useState('');
  const [videoContext, setVideoContext] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const categories = getTemplateCategories();
  const [contentType, setContentType] = useState<'short' | 'long'>('long');
  const { addSkeleton, setActiveSkeletonId, setVideoContext: setStoreVideoContext } = useWorkspace();
  
  // Filter templates based on selected category and content type
  const filteredTemplates = selectedCategory === 'all'
    ? creatorTemplates.filter(t => t.contentTypes.includes(contentType))
    : creatorTemplates.filter(t => t.category === selectedCategory && t.contentTypes.includes(contentType));

  function handleTemplateSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submitted", selectedCreator);

    // Find the selected template
    const selectedTemplate = CREATOR_TEMPLATES.find(template => template.id === selectedCreator);
    if (!selectedTemplate) {
      console.error("No template selected");
      return;
    }

    try {
      // Create a new skeleton based on the selected template
      const skeletonId = nanoid();
      const frames = [];
      
      // If the template has specific frames, add them to the skeleton
      if (selectedTemplate.frames) {
        for (const unitFrames of selectedTemplate.frames) {
          const unitType = unitFrames.unitType;
          
          // Get the specific frames for this unit
          for (const frameId of unitFrames.frameIds) {
            // Find example content if available
            let content = '';
            if (unitFrames.examples) {
              const example = unitFrames.examples.find(e => e.frameId === frameId);
              if (example && example.content) {
                content = example.content;
              }
            }
            
            // Create a new frame object
            frames.push({
              id: nanoid(),
              name: frameId,
              type: frameId,
              content: content,
              unitType: unitType,
              isTemplateExample: true
            });
          }
        }
      }
      
      const newSkeleton = {
        id: skeletonId,
        name: name || selectedTemplate.name,
        units: selectedTemplate.units || [],
        frames: frames,
        contentType: contentType,
      };

      console.log("Creating skeleton:", newSkeleton);

      // Add the skeleton and set it as active
      const createdSkeleton = addSkeleton(newSkeleton);
      setActiveSkeletonId(createdSkeleton.id);
      
      // Set the video context
      if (videoContext) {
        setStoreVideoContext(createdSkeleton.id, videoContext);
      }
      
    } catch (error) {
      console.error("Error creating skeleton:", error);
    }
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
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
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
                  </div>
                  
                  <div className="space-y-2 mb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Content Type:</Label>
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setContentType('short')}
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 text-xs",
                              contentType === 'short'
                                ? "bg-primary text-primary-foreground"
                                : "bg-background hover:bg-muted"
                            )}
                          >
                            <Smartphone size={12} />
                            <span>Short</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setContentType('long')}
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 text-xs",
                              contentType === 'long'
                                ? "bg-primary text-primary-foreground"
                                : "bg-background hover:bg-muted"
                            )}
                          >
                            <Video size={12} />
                            <span>Long</span>
                          </button>
                        </div>
                      </div>
                      <Label className="text-xs text-muted-foreground">Filter by category:</Label>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-all",
                          selectedCategory === 'all'
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        <ShoppingBag size={12} />
                        <span>All</span>
                      </button>
                      
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-all",
                            selectedCategory === category
                              ? "bg-primary text-primary-foreground shadow-sm" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {getCategoryIcon(category)}
                          <span>{category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 max-h-[320px] overflow-y-scroll">
                    <RadioGroup
                      value={selectedCreator || ''}
                      onValueChange={setSelectedCreator}
                      className="space-y-2"
                    >
                      {filteredTemplates.map((template: CategoryCreatorTemplate) => (
                        <div 
                          key={template.id} 
                          className={cn(
                            "relative border rounded-lg p-2 transition-all hover:shadow-sm",
                            selectedCreator === template.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <RadioGroupItem 
                              value={template.id} 
                              id={template.id} 
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <Label htmlFor={template.id} className="text-sm font-medium cursor-pointer truncate mr-1.5">
                                  {template.name}
                                </Label>
                                <div className="flex-shrink-0 flex items-center">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground">
                                    {getCategoryIcon(template.category)}
                                    <span className="ml-0.5 truncate max-w-[60px]">{template.category}</span>
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {template.description}
                              </p>
                              
                              <div className="mt-1.5 flex flex-wrap items-center text-[10px]">
                                <span className="font-medium text-foreground/80 mr-1">{template.units.length} units:</span>
                                <span className="text-muted-foreground truncate">{template.units.join(' → ')}</span>
                              </div>
                              
                              {template.frames && template.frames[0]?.examples && template.frames[0].examples[0] && (
                                <div className="mt-1.5 p-1.5 bg-muted/50 rounded-md text-[10px] text-muted-foreground border border-border/50">
                                  <span className="inline-block font-medium text-foreground/70 mr-1">Example:</span>
                                  <span className="line-clamp-2">"{template.frames[0].examples[0].content.substring(0, 75)}
                                  {template.frames[0].examples[0].content.length > 75 ? '...' : ''}"</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4 sticky bottom-0 pt-2 bg-background z-10 border-t">
                <Button 
                  type="button" 
                  disabled={!selectedCreator} 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    // Find the selected template
                    const selectedTemplate = creatorTemplates.find(template => template.id === selectedCreator);
                    if (!selectedTemplate) {
                      console.error("No template selected");
                      return;
                    }

                    try {
                      // Create a new skeleton based on the selected template
                      const skeletonId = nanoid();
                      const frames = [];
                      
                      // Find complete template with frames
                      const completeTemplate = selectedTemplate;
                      
                      // If the template has specific frames, add them to the skeleton
                      if (completeTemplate && completeTemplate.frames) {
                        for (const unitFrames of completeTemplate.frames) {
                          const unitType = unitFrames.unitType;
                          
                          // Get the specific frames for this unit
                          for (const frameId of unitFrames.frameIds) {
                            // Find example content if available
                            let content = '';
                            if (unitFrames.examples) {
                              const example = unitFrames.examples.find(e => e.frameId === frameId);
                              if (example && example.content) {
                                content = example.content;
                              }
                            }
                            
                            // Create a new frame object
                            frames.push({
                              id: nanoid(),
                              name: frameId,
                              type: frameId,
                              content: content,
                              unitType: unitType,
                              isTemplateExample: true
                            });
                          }
                        }
                      }
                      
                      const newSkeleton = {
                        id: skeletonId,
                        name: name || selectedTemplate.name,
                        units: selectedTemplate.units || [],
                        frames: frames,
                        contentType: contentType,
                      };

                      console.log("Creating skeleton:", newSkeleton);

                      // Add the skeleton and set it as active
                      const createdSkeleton = addSkeleton(newSkeleton);
                      setActiveSkeletonId(createdSkeleton.id);
                      
                      // Set the video context
                      if (videoContext) {
                        setStoreVideoContext(createdSkeleton.id, videoContext);
                      }
                      
                      // Close the dialog
                      onOpenChange(false);
                    } catch (error) {
                      console.error("Error creating skeleton:", error);
                    }
                  }}
                >
                  Create From Template
                </Button>
              </DialogFooter>
            </div>
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