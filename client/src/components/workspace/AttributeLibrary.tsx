import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Grip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TONES, FILTERS } from '@/lib/constants';

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

export default function AttributeLibrary() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tones</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {TONES.map((tone) => (
              <DraggableAttribute key={tone} id={tone} type="tone">
                {tone}
              </DraggableAttribute>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {FILTERS.map((filter) => (
              <DraggableAttribute key={filter} id={filter} type="filter">
                {filter}
              </DraggableAttribute>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
