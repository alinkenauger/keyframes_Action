import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FRAME_CATEGORIES,
  CONTENT_SUBCATEGORIES,
  getFramesByCategory,
  getHooksByType,
  FRAME_TEMPLATES,
  type FrameTemplate
} from '@/lib/frameLibrary';
import DraggableFrame from './DraggableFrame';
import CreateCustomFrameDialog from '@/components/frame/CreateCustomFrameDialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FrameLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(FRAME_CATEGORIES.HOOK);
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>();
  const [activeHookType, setActiveHookType] = useState<'initial' | 'rehook'>('initial');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [customFrames, setCustomFrames] = useLocalStorage<FrameTemplate[]>('custom-frames', []);

  // Combine built-in frames with custom frames when displaying
  const displayedFrames = searchQuery
    ? [...FRAME_TEMPLATES, ...customFrames].filter(frame => 
        frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        frame.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory === FRAME_CATEGORIES.HOOK
    ? getHooksByType(activeHookType)
    : activeCategory === FRAME_CATEGORIES.CUSTOM
    ? customFrames
    : getFramesByCategory(activeCategory, activeSubcategory);

  // Get frames grouped by subcategory for content section
  const getFramesBySubcategory = () => {
    if (activeCategory !== FRAME_CATEGORIES.CONTENT) return {};
    
    const grouped: Record<string, FrameTemplate[]> = {};
    Object.values(CONTENT_SUBCATEGORIES).forEach(subcategory => {
      grouped[subcategory] = getFramesByCategory(FRAME_CATEGORIES.CONTENT, subcategory);
    });
    return grouped;
  };

  const contentFramesBySubcategory = getFramesBySubcategory();

  const handleSaveCustomFrame = (frame: FrameTemplate) => {
    setCustomFrames([...customFrames, frame]);
  };

  const handleDeleteCustomFrame = (frameId: string) => {
    setCustomFrames(customFrames.filter(frame => frame.id !== frameId));
  };

  const handleTabChange = (value: string) => {
    setActiveCategory(value);
    setActiveSubcategory(undefined);
    if (value === FRAME_CATEGORIES.HOOK) {
      setActiveHookType('initial');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Frame Categories */}
      <div className="mb-4">
        {!searchQuery && (
          <Tabs 
            defaultValue={FRAME_CATEGORIES.HOOK} 
            onValueChange={handleTabChange}
          >
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                {Object.values(FRAME_CATEGORIES).map((category, index) => (
                  <TabsTrigger 
                    key={category} 
                    value={category} 
                    className="w-full text-xs py-1.5"
                    onClick={() => handleTabChange(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </div>
            </div>

            {/* Hook Type Filter */}
            {activeCategory === FRAME_CATEGORIES.HOOK && (
              <div className="mb-4 flex gap-2">
                <Button
                  variant={activeHookType === 'initial' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveHookType('initial')}
                  className="flex-1"
                >
                  Initial Hooks
                </Button>
                <Button
                  variant={activeHookType === 'rehook' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveHookType('rehook')}
                  className="flex-1"
                >
                  Rehooks
                </Button>
              </div>
            )}
          </Tabs>
        )}
      </div>

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

      {/* Scrollable container for the entire content */}
      <ScrollArea className="flex-1">
        <div className="pr-4">
          {/* Content Subcategories */}
          {!searchQuery && activeCategory === FRAME_CATEGORIES.CONTENT && (
            <div className="mb-4">
              <Accordion type="multiple" className="w-full">
                {Object.values(CONTENT_SUBCATEGORIES).map((subcategory) => {
                  const frames = contentFramesBySubcategory[subcategory] || [];
                  return (
                    <AccordionItem key={subcategory} value={subcategory} className="border-b-0">
                      <AccordionTrigger className="py-2 px-3 text-sm hover:no-underline bg-muted/30 rounded-md hover:bg-muted/60">
                        <span className="flex items-center">
                          {subcategory}
                          <span className="ml-2 text-xs text-muted-foreground">({frames.length})</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-0">
                        <div className="grid grid-cols-1 gap-2 pl-2">
                          {frames.map((frame) => (
                            <DraggableFrame 
                              key={frame.id}
                              frame={frame} 
                              compact={true}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}

          {/* For categories that show frames directly (Hook, Intro, Outro, CTA) */}
          {!searchQuery && (
            activeCategory === FRAME_CATEGORIES.HOOK || 
            activeCategory === FRAME_CATEGORIES.INTRO || 
            activeCategory === FRAME_CATEGORIES.OUTRO ||
            activeCategory === FRAME_CATEGORIES.CTA
          ) && (
            <div className="space-y-2 mb-4">
              {displayedFrames.map((frame) => (
                <DraggableFrame 
                  key={frame.id}
                  frame={frame} 
                  onDelete={frame.isCustom ? handleDeleteCustomFrame : undefined}
                />
              ))}
            </div>
          )}

          {/* Custom Frames Section */}
          {!searchQuery && activeCategory === FRAME_CATEGORIES.CUSTOM && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="w-full mb-4"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Frame
              </Button>
              
              <div className="space-y-2">
                {customFrames.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    <p className="text-sm">No custom frames yet</p>
                    <p className="text-xs mt-1">Create your first custom frame!</p>
                  </div>
                ) : (
                  customFrames.map((frame) => (
                    <DraggableFrame 
                      key={frame.id}
                      frame={frame} 
                      onDelete={handleDeleteCustomFrame}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="space-y-6 p-2">
              {/* Group frames by type for better organization */}
              {displayedFrames.length > 0 && (
                <>
                  {/* Display current category as a heading */}
                  <div className="bg-muted/50 px-3 py-2 rounded-md mb-3">
                    <h3 className="text-sm font-medium">
                      Search Results: {displayedFrames.length} frames
                    </h3>
                  </div>
                  
                  {/* Display the frames in a visually appealing grid with alternating colors */}
                  <div className="grid grid-cols-1 gap-3">
                    {displayedFrames.map((frame) => (
                      <div key={frame.id} className="transition-all duration-200 hover:scale-[1.01]">
                        <DraggableFrame 
                          frame={frame} 
                          onDelete={frame.isCustom ? handleDeleteCustomFrame : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* Empty search state */}
              {displayedFrames.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <div className="bg-muted rounded-full p-3 mb-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">No frames found</h3>
                  <p className="text-xs">Try adjusting your search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <CreateCustomFrameDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={handleSaveCustomFrame}
      />
    </div>
  );
}