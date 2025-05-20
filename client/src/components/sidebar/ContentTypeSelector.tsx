import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWorkspace } from '@/lib/store';
import { VideoIcon, Clock, BrainCircuit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ContentType } from '@/types';

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
              Select the format that best fits your video
            </p>
          </div>
          
          <Separator />
          
          <RadioGroup
            value={activeSkeleton.contentType || 'longform'}
            onValueChange={handleContentTypeChange}
            className="grid grid-cols-1 gap-3"
          >
            <Label 
              htmlFor="longform"
              className="flex flex-col items-start space-y-2 cursor-pointer rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="longform" id="longform" className="sr-only" />
              <div className="flex w-full justify-between">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Long Form</span>
                </div>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                  &lt;20 min
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Traditional YouTube videos with deeper storytelling, multiple points, and higher retention.
              </div>
            </Label>
            
            <Label 
              htmlFor="shortform"
              className="flex flex-col items-start space-y-2 cursor-pointer rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="shortform" id="shortform" className="sr-only" />
              <div className="flex w-full justify-between">
                <div className="flex items-center justify-center space-x-2">
                  <BrainCircuit className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Short Form</span>
                </div>
                <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-xs text-red-500">
                  15s-3 min
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Optimized for Shorts, TikTok & Reels. Immediate hooks, visual-first content, rapid pacing.
              </div>
            </Label>
          </RadioGroup>
          
          {activeSkeleton.contentType === 'shortform' && (
            <div className="bg-red-500/10 p-3 rounded-md border border-red-500/20">
              <h4 className="text-xs font-medium text-red-500 mb-1">Short Form Tips</h4>
              <ul className="text-xs space-y-1">
                <li>• Start with a pattern interrupt or eye-catching visual</li>
                <li>• Hook viewers in first 2-3 seconds</li>
                <li>• Use "visual-first" thinking in your content</li>
                <li>• Make every frame attention-worthy</li>
                <li>• End with a loop or call to action</li>
              </ul>
            </div>
          )}
          
          {activeSkeleton.contentType === 'longform' && (
            <div className="bg-primary/10 p-3 rounded-md border border-primary/20">
              <h4 className="text-xs font-medium text-primary mb-1">Long Form Tips</h4>
              <ul className="text-xs space-y-1">
                <li>• Balance storytelling with value delivery</li>
                <li>• Create a clear journey with natural transitions</li>
                <li>• Use rehooks to re-engage viewers</li>
                <li>• Include "pattern interrupts" every 2-3 minutes</li>
                <li>• End with a satisfying conclusion or CTA</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}