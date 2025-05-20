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
import { Badge } from '@/components/ui/badge';

interface DraggableFrameProps {
  frame: FrameTemplate;
  onDelete?: (id: string) => void;
  compact?: boolean; // Whether to use a compact display style
}

export default function DraggableFrame({ frame, onDelete, compact = false }: DraggableFrameProps) {
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
        "cursor-move hover:shadow-md transition-all border-l-4 relative group",
        "hover:ring-1 hover:ring-primary/30 hover:bg-muted/30",
        isDragging ? "opacity-0" : "opacity-100",
        frame.category === FRAME_CATEGORIES.HOOK && !frame.hookType && "border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10",
        frame.category === FRAME_CATEGORIES.INTRO && "border-l-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/10",
        frame.category === FRAME_CATEGORIES.CONTENT && "border-l-green-500 bg-green-50/30 dark:bg-green-950/10",
        frame.category === FRAME_CATEGORIES.HOOK && frame.hookType === 'rehook' && "border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/10",
        frame.category === FRAME_CATEGORIES.OUTRO && "border-l-orange-500 bg-orange-50/30 dark:bg-orange-950/10",
        compact && "py-0"
      )}
      {...attributes}
      {...listeners}
    >
      <CardContent className={cn("p-3 transition-all", compact && "p-2")}>
        {/* Category indicator badge */}
        <div className="flex justify-between items-start mb-1">
          {!compact && (
            <div className={cn(
              "text-[10px] uppercase font-semibold tracking-wide px-1.5 py-0.5 rounded",
              "inline-flex items-center",
              frame.category === FRAME_CATEGORIES.HOOK && !frame.hookType && "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
              frame.category === FRAME_CATEGORIES.INTRO && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
              frame.category === FRAME_CATEGORIES.CONTENT && "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
              frame.category === FRAME_CATEGORIES.HOOK && frame.hookType === 'rehook' && "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
              frame.category === FRAME_CATEGORIES.OUTRO && "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
            )}>
              {frame.hookType === 'rehook' ? 'Rehook' : frame.category}
              {frame.subcategory && ` • ${frame.subcategory}`}
            </div>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(frame.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Drag handle */}
        <div className={cn(
          "absolute top-1/2 -left-2 -translate-y-1/2 bg-background rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity",
          compact && "top-[20%]"
        )}>
          <div className="p-1" {...attributes} {...listeners}>
            <GripHorizontal className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        <div className="pl-1">
          {/* Clickable header area that toggles expansion */}
          <div 
            className="cursor-pointer" 
            onClick={toggleExpand}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className={cn("mb-1", compact && "mb-0")}>
                  <h3 className={cn("font-medium text-sm", compact && "text-xs")}>
                    {compact && frame.subcategory && (
                      <Badge variant="outline" className="mr-1 py-0 h-4 text-[9px]">
                        {frame.subcategory}
                      </Badge>
                    )}
                    {frame.name}
                  </h3>
                  {!compact && frame.subcategory && (
                    <span className="text-[11px] text-muted-foreground">
                      {frame.subcategory}
                    </span>
                  )}
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="right" align="start" className="w-80 p-4 space-y-3">
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
            {!compact && (
              <div className={cn(
                "relative transition-all duration-300 ease-in-out",
                !isExpanded && "max-h-[32px] overflow-hidden"
              )}>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {frame.description}
                </p>

                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-background to-transparent dark:from-card" />
                )}
              </div>
            )}
          </div>

          {/* Expandable content with smooth transition */}
          {!compact && (
            <div className={cn(
              "mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-[500px] opacity-100 pt-2 border-t border-dashed" : "max-h-0 opacity-0"
            )}>
              <div className="p-2 bg-muted rounded-sm">
                <p className="text-xs italic">"{frame.example}"</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  <span className="font-medium">Popular use:</span> {frame.popularUse}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}