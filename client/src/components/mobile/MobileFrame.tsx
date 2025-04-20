import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, X, Palette, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import type { Frame as FrameType } from '@/types';
import FrameDialog from '../workspace/FrameDialog';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

interface MobileFrameProps {
  frame: FrameType;
  onDelete?: (id: string) => void;
}

export default function MobileFrame({ frame, onDelete }: MobileFrameProps) {
  const [showDialog, setShowDialog] = useState(false);

  // We need to handle frame type color mapping differently
  let frameTypeColors = { bg: 'bg-gray-100', text: 'text-gray-800' };

  // Try to determine the color based on unitType or fallback to a type-based mapping
  if (frame.unitType) {
    if (frame.unitType.toLowerCase().includes('hook')) {
      frameTypeColors = { bg: 'bg-blue-100', text: 'text-blue-800' };
    } else if (frame.unitType.toLowerCase().includes('intro')) {
      frameTypeColors = { bg: 'bg-green-100', text: 'text-green-800' };
    } else if (frame.unitType.toLowerCase().includes('content')) {
      frameTypeColors = { bg: 'bg-emerald-100', text: 'text-emerald-800' };
    } else if (frame.unitType.toLowerCase().includes('rehook')) {
      frameTypeColors = { bg: 'bg-purple-100', text: 'text-purple-800' };
    } else if (frame.unitType.toLowerCase().includes('outro')) {
      frameTypeColors = { bg: 'bg-orange-100', text: 'text-orange-800' };
    }
  }

  return (
    <>
      <Card 
        className={cn(
          "relative mb-4 hover:shadow-md transition-shadow touch-manipulation",
          frameTypeColors.text.replace('text-', 'border-l-4 border-l-')
        )}
      >
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(frame.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <CardContent className="pt-5 pb-4">
          {/* Frame Type Tag */}
          <div className={cn("inline-block px-2 py-1 rounded", frameTypeColors.bg, frameTypeColors.text)}>
            <span className="text-sm font-medium">{frame.name || frame.type}</span>
          </div>

          {/* Content section */}
          <div className="mt-3 relative">
            {frame.content ? (
              <Sheet>
                <SheetTrigger asChild>
                  <div className="cursor-pointer">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {frame.content}
                    </p>
                    <div className="flex mt-2 space-x-2">
                      {frame.tone && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {frame.tone}
                        </span>
                      )}
                      {frame.filter && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          {frame.filter}
                        </span>
                      )}
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetTitle className="text-left">{frame.unitType}: {frame.name || frame.type}</SheetTitle>
                  <SheetDescription className="text-left mb-4">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {frame.tone && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {frame.tone}
                        </span>
                      )}
                      {frame.filter && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          {frame.filter}
                        </span>
                      )}
                    </div>
                  </SheetDescription>
                  <div className="border-t pt-2">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
                      {frame.script || frame.content}
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                    </SheetClose>
                    <Button onClick={() => setShowDialog(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <div 
                className="p-3 border border-dashed rounded-md text-center cursor-pointer"
                onClick={() => setShowDialog(true)}
              >
                <p className="text-sm text-gray-400">Tap to add content</p>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex justify-end mt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => setShowDialog(true)}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Edit</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => setShowDialog(true)}
            >
              <Palette className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Style</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {frame.unitType && (
        <FrameDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          frame={{
            id: frame.id,
            type: frame.type || '',
            content: frame.content || '',
            unitType: frame.unitType,
            script: frame.script || '' 
          }}
          skeletonId={(frame as any).skeletonId || ''}
        />
      )}
    </>
  );
}