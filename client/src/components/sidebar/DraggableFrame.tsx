import { Card, CardContent } from '@/components/ui/card';
import { GripHorizontal } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { FRAME_CATEGORIES } from '@/lib/frameLibrary';
import type { FrameTemplate } from '@/lib/frameLibrary';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface DraggableFrameProps {
  frame: FrameTemplate;
  onDelete?: (id: string) => void;
}

export default function DraggableFrame({ frame, onDelete }: DraggableFrameProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${frame.id}`,
    data: {
      type: 'template',
      frame
    }
  });

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "cursor-move hover:shadow-md transition-all border-l-4 relative group mb-3",
        frame.category === FRAME_CATEGORIES.HOOK && "border-l-blue-500",
        frame.category === FRAME_CATEGORIES.CONTENT && "border-l-green-500",
        frame.category === FRAME_CATEGORIES.HOOK && frame.hookType === 'rehook' && "border-l-purple-500",
        frame.category === FRAME_CATEGORIES.OUTRO && "border-l-orange-500",
        isDragging && "opacity-0"
      )}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3 transition-all">
        <div className="absolute top-3 left-3">
          <GripHorizontal className="h-4 w-4 text-gray-400" />
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(frame.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="ml-8 pr-8">
          {/* Clickable header area that toggles expansion */}
          <div 
            className="cursor-pointer" 
            onClick={toggleExpand}
          >
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

            {/* Description with fade effect when not expanded */}
            <div className={cn(
              "relative mt-1 transition-all duration-300 ease-in-out",
              !isExpanded && "max-h-[40px] overflow-hidden"
            )}>
              <p className="text-sm text-muted-foreground">
                {frame.description}
              </p>

              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent dark:from-background" />
              )}
            </div>
          </div>

          {/* Expandable content with smooth transition */}
          <div className={cn(
            "mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[500px] opacity-100 pt-2 border-t border-dashed" : "max-h-0 opacity-0"
          )}>
            <div className="p-2 bg-muted rounded-sm">
              <p className="text-sm italic">"{frame.example}"</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Popular use: {frame.popularUse}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}