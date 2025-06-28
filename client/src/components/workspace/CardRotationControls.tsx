import { Button } from '@/components/ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw,
  Copy,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CardRotationControlsProps {
  frameId: string;
  unitType: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  className?: string;
}

export function CardRotationControls({
  frameId,
  unitType,
  canMoveUp,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  onDuplicate,
  onDelete,
  className
}: CardRotationControlsProps) {
  return (
    <TooltipProvider>
      <div className={cn(
        "absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20",
        className
      )}>
        {/* Movement controls */}
        <div className="flex flex-col gap-0.5 bg-background/95 backdrop-blur-sm rounded-md p-0.5 shadow-sm border">
          <div className="flex gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onMoveLeft}
                  disabled={!canMoveLeft}
                  title="Move to previous column"
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move to previous column</p>
                <p className="text-xs text-muted-foreground">Alt+←</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  title="Move up in column"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move up in column</p>
                <p className="text-xs text-muted-foreground">Alt+↑</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  title="Move down in column"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move down in column</p>
                <p className="text-xs text-muted-foreground">Alt+↓</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onMoveRight}
                  disabled={!canMoveRight}
                  title="Move to next column"
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move to next column</p>
                <p className="text-xs text-muted-foreground">Alt+→</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex gap-0.5 bg-background/95 backdrop-blur-sm rounded-md p-0.5 shadow-sm border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onDuplicate}
                title="Duplicate card"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Duplicate card</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={onDelete}
                title="Delete card"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete card</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}