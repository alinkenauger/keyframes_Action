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
                "relative rounded-md border transition-all h-12 flex items-center",
                activeSkeleton.contentType === 'longform' 
                  ? "border-primary bg-primary/5" 
                  : "border-muted bg-card hover:bg-muted/10"
              )}
            >
              <Label 
                htmlFor="longform"
                className="cursor-pointer w-full h-full flex items-center px-2"
              >
                <RadioGroupItem value="longform" id="longform" className="sr-only" />
                
                <div className="bg-muted/30 p-2.5 rounded-full mr-3">
                  <VideoIcon className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs bg-muted/30 text-muted-foreground rounded-md px-2 py-0.5 mr-1">
                    &lt;20 min
                  </span>
                </div>
              </Label>
            </div>
            
            {/* Short Form Option */}
            <div 
              className={cn(
                "relative rounded-md border transition-all h-12 flex items-center",
                activeSkeleton.contentType === 'shortform' 
                  ? "border-red-500 bg-red-500/5" 
                  : "border-muted bg-card hover:bg-muted/10"
              )}
            >
              <Label 
                htmlFor="shortform"
                className="cursor-pointer w-full h-full flex items-center px-2"
              >
                <RadioGroupItem value="shortform" id="shortform" className="sr-only" />
                
                <div className="bg-muted/30 p-2.5 rounded-full mr-3">
                  <SmartphoneIcon className="h-5 w-5 text-red-500" />
                </div>
                
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs bg-muted/30 text-red-500 rounded-md px-2 py-0.5 mr-1">
                    15s-3 min
                  </span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}