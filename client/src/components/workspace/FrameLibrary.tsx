import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Search, GripHorizontal } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import {
  FRAME_CATEGORIES,
  CONTENT_SUBCATEGORIES,
  FRAME_TEMPLATES,
  FrameTemplate,
  getFramesByCategory,
  searchFrames
} from '@/lib/frameLibrary';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

// Import attributes related components
import { TONES, FILTERS } from '@/lib/constants';

export default function FrameLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(FRAME_CATEGORIES.HOOK);
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>();

  const displayedFrames = searchQuery
    ? searchFrames(searchQuery)
    : getFramesByCategory(activeCategory, activeSubcategory);

  const renderDraggableFrame = (frame: FrameTemplate) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: `template-${frame.id}`,
      data: {
        type: 'template',
        frame: {
          // Use the frame name as the type instead of the category
          type: frame.name,
          content: frame.example,
          unitType: ''
        }
      }
    });

    return (
      <Card
        ref={setNodeRef}
        key={frame.id}
        className={cn(
          "cursor-move hover:shadow-md transition-shadow border-l-4 relative group mb-4",
          frame.category === FRAME_CATEGORIES.HOOK && "border-l-blue-500",
          frame.category === FRAME_CATEGORIES.CONTENT && "border-l-green-500",
          // Fix this incorrect reference to REHOOK which doesn't exist
          frame.category === FRAME_CATEGORIES.HOOK && frame.hookType === 'rehook' && "border-l-purple-500",
          frame.category === FRAME_CATEGORIES.OUTRO && "border-l-orange-500",
          isDragging && "opacity-50"
        )}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-4">
          <div className="absolute top-3 left-3">
            <GripHorizontal className="h-4 w-4 text-gray-400" />
          </div>

          <div className="ml-8">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div>
                  <h3 className="font-medium">{frame.name}</h3>
                  {frame.subcategory && (
                    <span className="text-xs text-muted-foreground">
                      {frame.subcategory}
                    </span>
                  )}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">{frame.name}</h4>
                  {frame.subcategory && (
                    <span className="text-xs text-muted-foreground block">
                      {frame.subcategory}
                    </span>
                  )}
                </div>

                <p className="text-sm">{frame.description}</p>

                <div className="bg-muted p-3 rounded text-sm italic">
                  "{frame.example}"
                </div>

                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Popular use:</span> {frame.popularUse}
                </div>

                <div className="text-xs text-right">
                  <span className="text-primary opacity-75">Drag to add to your skeleton</span>
                </div>
              </HoverCardContent>
            </HoverCard>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {frame.description}
            </p>
            <div className="mt-2 p-2 bg-muted rounded-sm">
              <p className="text-sm italic line-clamp-1">"{frame.example}"</p>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Popular use: {frame.popularUse}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDraggableAttribute = (value: string, type: 'tone' | 'filter') => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: `${type}-${value}`,
      data: {
        type,
        value
      }
    });

    return (
      <div
        key={value}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          'px-2 py-1 rounded cursor-move mb-2',
          type === 'tone' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800',
          isDragging && 'opacity-50'
        )}
      >
        {value}
      </div>
    );
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

          {!searchQuery && (
            <Tabs 
              defaultValue={FRAME_CATEGORIES.HOOK} 
              onValueChange={(value) => {
                setActiveCategory(value);
                setActiveSubcategory(undefined);
              }}
            >
              <TabsList className="mb-4 w-full">
                {Object.values(FRAME_CATEGORIES).map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="px-3 py-1 text-sm flex-1"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

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
            </Tabs>
          )}

          {/* Frame Cards */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 gap-4 p-1">
              {/* Fix this type error by converting FrameTemplate | CreatorTemplate to FrameTemplate */}
              {displayedFrames
                .filter(frame => 'example' in frame) // Only include FrameTemplate objects
                .map(frame => renderDraggableFrame(frame as FrameTemplate))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="attributes" className="mt-0">
          <Tabs defaultValue="tones">
            <TabsList>
              <TabsTrigger value="tones">Tones</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
            </TabsList>

            <TabsContent value="tones" className="mt-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {TONES.map((tone) => renderDraggableAttribute(tone, 'tone'))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="filters" className="mt-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {FILTERS.map((filter) => renderDraggableAttribute(filter, 'filter'))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}