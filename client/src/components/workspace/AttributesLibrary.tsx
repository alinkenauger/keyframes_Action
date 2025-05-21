import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Grip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TONES, FILTERS } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DraggableAttributeProps {
  id: string;
  type: 'tone' | 'filter';
  children: React.ReactNode;
}

function DraggableAttribute({ id, type, children }: DraggableAttributeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      type,
      value: id
    }
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform)
  } : undefined;

  const colorClass = type === 'tone' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center gap-2 px-2 py-1 rounded cursor-grab mb-2',
        colorClass
      )}
    >
      <Grip className="h-3 w-3" />
      <span className="text-sm">{children}</span>
    </div>
  );
}

// Group TONES by category
const TONE_CATEGORIES = {
  'Emotional': TONES.slice(0, 10),
  'Stylistic': TONES.slice(10, 20),
  'Audience-Specific': TONES.slice(20, 28),
  'Original': TONES.slice(28)
};

// Group FILTERS by category
const FILTER_CATEGORIES = {
  'Visual': FILTERS.slice(0, 10),
  'Pacing': FILTERS.slice(10, 19),
  'Audio': FILTERS.slice(19, 28),
  'Structural': FILTERS.slice(28, 38),
  'Original': FILTERS.slice(38)
};

export default function AttributesLibrary() {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <Tabs defaultValue="tones">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="tones" className="flex-1">Tones</TabsTrigger>
            <TabsTrigger value="filters" className="flex-1">Filters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tones">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                {Object.entries(TONE_CATEGORIES).map(([category, tones]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{category} Tones</h3>
                    {tones.map((tone) => (
                      <DraggableAttribute key={tone} id={tone} type="tone">
                        {tone}
                      </DraggableAttribute>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="filters">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                {Object.entries(FILTER_CATEGORIES).map(([category, filters]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{category} Filters</h3>
                    {filters.map((filter) => (
                      <DraggableAttribute key={filter} id={filter} type="filter">
                        {filter}
                      </DraggableAttribute>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
