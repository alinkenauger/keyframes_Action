import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWorkspace } from '@/lib/store';
import { VideoIcon, SmartphoneIcon, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ContentType } from '@/types';
import { cn } from '@/lib/utils';

export function ContentTypeSelector() {
  const { skeletons, activeSkeletonId, updateContentType } = useWorkspace();
  
  const activeSkeleton = activeSkeletonId 
    ? skeletons.find(s => s.id === activeSkeletonId) 
    : null;
  
  if (!activeSkeleton) {
    return null;
  }

  const handleContentTypeChange = (value: ContentType) => {
    if (activeSkeletonId) {
      updateContentType(activeSkeletonId, value);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium leading-none">Content Type</h3>
            <p className="text-xs text-muted-foreground mt-1.5">
              Select format for your video
            </p>
          </div>
          
          <Separator />
          
          <RadioGroup
            value={activeSkeleton.contentType || 'longform'}
            onValueChange={handleContentTypeChange}
            className="grid grid-cols-2 gap-3"
          >
            {/* Long Form Option */}
            <div 
              className={cn(
                "relative rounded-md border transition-all h-16 flex items-center justify-center cursor-pointer",
                activeSkeleton.contentType === 'longform' 
                  ? "border-primary bg-primary/5" 
                  : "border-muted bg-card hover:bg-muted/10"
              )}
              onClick={() => handleContentTypeChange('longform')}
            >
              <Label 
                htmlFor="longform"
                className="cursor-pointer w-full h-full flex flex-col items-center justify-center px-2"
              >
                <RadioGroupItem value="longform" id="longform" className="sr-only" />
                
                <div className={cn(
                  "p-2 rounded-full",
                  activeSkeleton.contentType === 'longform' 
                    ? "bg-primary/20" 
                    : "bg-muted/30"
                )}>
                  <VideoIcon className={cn(
                    "h-5 w-5",
                    activeSkeleton.contentType === 'longform' 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )} />
                </div>
                <span className="text-xs text-muted-foreground mt-1 whitespace-nowrap text-center">
                  &lt;20 min
                </span>
              </Label>
            </div>
            
            {/* Short Form Option */}
            <div 
              className={cn(
                "relative rounded-md border transition-all h-16 flex items-center justify-center cursor-pointer",
                activeSkeleton.contentType === 'shortform' 
                  ? "border-primary bg-primary/5" 
                  : "border-muted bg-card hover:bg-muted/10"
              )}
              onClick={() => handleContentTypeChange('shortform')}
            >
              <Label 
                htmlFor="shortform"
                className="cursor-pointer w-full h-full flex flex-col items-center justify-center px-2"
              >
                <RadioGroupItem value="shortform" id="shortform" className="sr-only" />
                
                <div className={cn(
                  "p-2 rounded-full",
                  activeSkeleton.contentType === 'shortform' 
                    ? "bg-primary/20" 
                    : "bg-muted/30"
                )}>
                  <SmartphoneIcon className={cn(
                    "h-5 w-5",
                    activeSkeleton.contentType === 'shortform' 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )} />
                </div>
                <span className="text-xs text-muted-foreground mt-1 whitespace-nowrap text-center">
                  15s-3 min
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}