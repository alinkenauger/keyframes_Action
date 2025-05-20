import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FRAME_CATEGORIES,
  CONTENT_SUBCATEGORIES,
  getFramesByCategory,
  getHooksByType,
  searchFrames,
  type FrameTemplate
} from '@/lib/frameLibrary';
import { cn } from '@/lib/utils';
import { TONES, FILTERS } from '@/lib/constants';
import CreateCustomFrameDialog from '@/components/frame/CreateCustomFrameDialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useWorkspace } from '@/lib/store';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

export default function MobileFrameLibrary() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(FRAME_CATEGORIES.HOOK);
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>();
  const [activeHookType, setActiveHookType] = useState<'initial' | 'rehook'>('initial');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [customFrames, setCustomFrames] = useLocalStorage<FrameTemplate[]>('custom-frames', []);
  
  // Get workspace state for adding frames
  const { activeSkeletonId, skeletons, updateFrameOrder, updateFrameTone, updateFrameFilter } = useWorkspace();
  const activeSkeleton = skeletons.find(s => s.id === activeSkeletonId);

  // Combine built-in frames with custom frames when displaying
  const displayedFrames = searchQuery
    ? [...searchFrames(searchQuery).filter(item => 'example' in item), ...customFrames.filter(frame => 
        frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        frame.description.toLowerCase().includes(searchQuery.toLowerCase())
      )]
    : activeCategory === FRAME_CATEGORIES.HOOK
    ? getHooksByType(activeHookType)
    : activeCategory === FRAME_CATEGORIES.CUSTOM
    ? customFrames
    : getFramesByCategory(activeCategory, activeSubcategory);

  const handleSaveCustomFrame = (frame: FrameTemplate) => {
    setCustomFrames([...customFrames, frame]);
  };

  const handleDeleteCustomFrame = (frameId: string) => {
    setCustomFrames(customFrames.filter(frame => frame.id !== frameId));
  };

  // Function to add a frame to the active skeleton
  const addFrame = (template: FrameTemplate) => {
    if (!activeSkeletonId || !activeSkeleton) {
      toast({
        title: "No active skeleton",
        description: "Please create or select a skeleton first",
        variant: "destructive"
      });
      return;
    }

    // Determine the unit type based on the category
    let unitType = "Content";
    if (activeCategory === FRAME_CATEGORIES.HOOK) {
      unitType = activeHookType === 'initial' ? "Hook" : "Rehook";
    } else if (activeCategory === FRAME_CATEGORIES.INTRO) {
      unitType = "Intro";
    } else if (activeCategory === FRAME_CATEGORIES.OUTRO) {
      unitType = "Outro";
    } else if (activeSubcategory) {
      unitType = activeSubcategory;
    }

    // Create new frame
    const newFrame = {
      id: nanoid(),
      name: template.name,
      type: template.name,
      content: template.example,
      unitType,
      tone: '',
      filter: ''
    };

    // Add the frame to the skeleton
    const newFrames = [...activeSkeleton.frames, newFrame];
    updateFrameOrder(activeSkeletonId, newFrames);

    toast({
      title: "Frame added",
      description: `Added ${template.name} to ${unitType}`
    });
  };

  // Function to add tone or filter to the last added frame
  const addAttribute = (type: 'tone' | 'filter', value: string) => {
    if (!activeSkeletonId || !activeSkeleton) {
      toast({
        title: "No active skeleton",
        description: "Please create or select a skeleton first",
        variant: "destructive"
      });
      return;
    }

    // Get the last frame in the skeleton
    const lastFrame = activeSkeleton.frames[activeSkeleton.frames.length - 1];
    
    if (!lastFrame) {
      toast({
        title: "No frames found",
        description: "Add a frame before applying attributes",
        variant: "destructive"
      });
      return;
    }

    // Update the frame's tone or filter
    if (type === 'tone') {
      updateFrameTone(activeSkeletonId, lastFrame.id, value);
    } else {
      updateFrameFilter(activeSkeletonId, lastFrame.id, value);
    }

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} applied`,
      description: `Added ${value} to frame`
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="frames" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
        </TabsList>

        <TabsContent value="frames" className="mt-0">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search frames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Categories */}
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <div className="pb-2">
              {/* Use 2-row grid for better spacing */}
              <div className="space-y-2">
                {/* First row */}
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-sm",
                      "transition-colors",
                      activeCategory === FRAME_CATEGORIES.HOOK 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground bg-muted hover:bg-muted/70"
                    )}
                    onClick={() => setActiveCategory(FRAME_CATEGORIES.HOOK)}
                  >
                    Hook
                  </button>
                  <button 
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-sm",
                      "transition-colors",
                      activeCategory === FRAME_CATEGORIES.INTRO 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground bg-muted hover:bg-muted/70"
                    )}
                    onClick={() => setActiveCategory(FRAME_CATEGORIES.INTRO)}
                  >
                    Intro
                  </button>
                  <button 
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-sm",
                      "transition-colors",
                      activeCategory === FRAME_CATEGORIES.CONTENT 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground bg-muted hover:bg-muted/70"
                    )}
                    onClick={() => setActiveCategory(FRAME_CATEGORIES.CONTENT)}
                  >
                    Content
                  </button>
                </div>
                
                {/* Second row */}
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-sm",
                      "transition-colors",
                      activeCategory === FRAME_CATEGORIES.OUTRO 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground bg-muted hover:bg-muted/70"
                    )}
                    onClick={() => setActiveCategory(FRAME_CATEGORIES.OUTRO)}
                  >
                    Outro
                  </button>
                  <button 
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-sm",
                      "transition-colors",
                      activeCategory === FRAME_CATEGORIES.CTA 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground bg-muted hover:bg-muted/70"
                    )}
                    onClick={() => setActiveCategory(FRAME_CATEGORIES.CTA)}
                  >
                    CTA
                  </button>
                  <button 
                    className={cn(
                      "w-full px-3 py-1.5 text-sm rounded-sm",
                      "transition-colors",
                      activeCategory === FRAME_CATEGORIES.CUSTOM 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground bg-muted hover:bg-muted/70"
                    )}
                    onClick={() => setActiveCategory(FRAME_CATEGORIES.CUSTOM)}
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>

            {/* Hook Subcategories */}
            <TabsContent value={FRAME_CATEGORIES.HOOK} className="mt-4">
              <Tabs
                value={activeHookType}
                onValueChange={(value) => setActiveHookType(value as 'initial' | 'rehook')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="initial">Initial</TabsTrigger>
                  <TabsTrigger value="rehook">Rehook</TabsTrigger>
                </TabsList>
              </Tabs>
            </TabsContent>

            {/* Content Subcategories */}
            <TabsContent value={FRAME_CATEGORIES.CONTENT} className="mt-4">
              <Tabs
                value={activeSubcategory || 'all'}
                onValueChange={(value) => setActiveSubcategory(value === 'all' ? undefined : value)}
              >
                <ScrollArea className="whitespace-nowrap pb-2">
                  <TabsList className="inline-flex w-max">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {Object.values(CONTENT_SUBCATEGORIES).map((subcat) => (
                      <TabsTrigger key={subcat} value={subcat}>
                        {subcat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
              </Tabs>
            </TabsContent>

            {/* Custom Frames Tab with Add Button */}
            <TabsContent value={FRAME_CATEGORIES.CUSTOM} className="mt-4">
              <Button 
                onClick={() => setShowCreateDialog(true)}
                variant="outline" 
                className="mb-4 w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Frame
              </Button>
            </TabsContent>
          </Tabs>

          {/* Frames Display */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-2 gap-2 pb-20">
              {displayedFrames.map((frame) => (
                <div
                  key={frame.id}
                  className="relative border rounded-md p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => 'example' in frame ? addFrame(frame as FrameTemplate) : null}
                >
                  <div className={cn(
                    "text-xs font-medium p-1 rounded mb-1",
                    "bg-blue-100 text-blue-800"
                  )}>
                    {frame.name}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{frame.description}</p>
                  
                  {activeCategory === FRAME_CATEGORIES.CUSTOM && (
                    <button
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomFrame(frame.id);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="attributes" className="mt-0">
          <Tabs defaultValue="tones">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tones">Tones</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
            </TabsList>

            <TabsContent value="tones" className="mt-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="grid grid-cols-2 gap-2 pb-20">
                  {TONES.map((tone) => (
                    <div
                      key={tone}
                      className="border rounded-md p-2 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                      onClick={() => addAttribute('tone', tone)}
                    >
                      <p className="text-blue-800 text-sm">{tone}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="filters" className="mt-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="grid grid-cols-2 gap-2 pb-20">
                  {FILTERS.map((filter) => (
                    <div
                      key={filter}
                      className="border rounded-md p-2 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                      onClick={() => addAttribute('filter', filter)}
                    >
                      <p className="text-purple-800 text-sm">{filter}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <CreateCustomFrameDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={handleSaveCustomFrame}
      />
    </div>
  );
}