import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DraggableAttributeProps {
  value: string;
  type: 'tone' | 'filter';
}

export default function DraggableAttribute({ value, type }: DraggableAttributeProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${type}-${value}`,
    data: {
      type,
      value
    }
  });

  return (
    <div
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
}
