import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableUnitWrapperProps {
  unit: {
    id: string;
    name: string;
    frames: any[];
  };
  children: React.ReactNode;
}

export function DraggableUnitWrapper({ unit, children }: DraggableUnitWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: unit.id,
    data: {
      type: 'skeleton-unit',
      unit
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "shadow-2xl"
      )}
    >
      {/* Drag handle overlay */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-6 flex items-start justify-center pt-2",
          "bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
          "cursor-grab active:cursor-grabbing z-30",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>
      
      {children}
    </div>
  );
}