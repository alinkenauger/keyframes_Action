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
import { cn } from '@/lib/utils';
import DraggableFrame from './DraggableFrame';
import CreateCustomFrameDialog from '@/components/frame/CreateCustomFrameDialog';
import { useLocalStorage } from '@/hooks/use-local-storage';

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

  const handleSaveCustomFrame = (frame: FrameTemplate) => {
    setCustomFrames([...customFrames, frame]);
  };

  const handleDeleteCustomFrame = (frameId: string) => {
    setCustomFrames(customFrames.filter(frame => frame.id !== frameId));
  };

  return (
    <div className="h-full flex flex-col">
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

      {/* Frame Categories */}
      {!searchQuery && (
        <Tabs 
          defaultValue={FRAME_CATEGORIES.HOOK} 
          onValueChange={(value) => {
            setActiveCategory(value);
            setActiveSubcategory(undefined);
            if (value === FRAME_CATEGORIES.HOOK) {
              setActiveHookType('initial');
            }
          }}
        >
          <TabsList className="mb-4">
            {Object.values(FRAME_CATEGORIES).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Hook Type Filter */}
          {activeCategory === FRAME_CATEGORIES.HOOK && (
            <div className="mb-4 flex gap-2">
              <Button
                variant={activeHookType === 'initial' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setActiveHookType('initial')}
              >
                Initial Hooks
              </Button>
              <Button
                variant={activeHookType === 'rehook' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setActiveHookType('rehook')}
              >
                Rehooks
              </Button>
            </div>
          )}

          {/* Content Subcategories */}
          {activeCategory === FRAME_CATEGORIES.CONTENT && (
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.values(CONTENT_SUBCATEGORIES).map((subcategory) => (
                <div
                  key={subcategory}
                  className={cn(
                    "cursor-pointer border rounded px-2 py-1",
                    activeSubcategory === subcategory 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => setActiveSubcategory(
                    activeSubcategory === subcategory ? undefined : subcategory
                  )}
                >
                  {subcategory}
                </div>
              ))}
            </div>
          )}

          {/* Custom Frames Section */}
          {activeCategory === FRAME_CATEGORIES.CUSTOM && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Frame
              </Button>
            </div>
          )}
        </Tabs>
      )}

      {/* Frame Cards */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 gap-4 p-1">
          {displayedFrames.map((frame) => (
            <DraggableFrame 
              key={frame.id} 
              frame={frame} 
              onDelete={frame.isCustom ? handleDeleteCustomFrame : undefined}
            />
          ))}
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