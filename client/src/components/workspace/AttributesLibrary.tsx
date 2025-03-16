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
              <div className="space-y-2">
                {TONES.map((tone) => (
                  <DraggableAttribute key={tone} id={tone} type="tone">
                    {tone}
                  </DraggableAttribute>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="filters">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {FILTERS.map((filter) => (
                  <DraggableAttribute key={filter} id={filter} type="filter">
                    {filter}
                  </DraggableAttribute>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
