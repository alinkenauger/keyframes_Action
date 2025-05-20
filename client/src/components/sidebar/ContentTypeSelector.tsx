import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWorkspace } from '@/lib/store';
import { VideoIcon, SmartphoneIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ContentType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ContentTypeSelector() {
  const { skeletons, activeSkeletonId, updateContentType } = useWorkspace();
  const [expandedType, setExpandedType] = useState<ContentType | null>(null);
  
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

  const toggleExpand = (type: ContentType) => {
    setExpandedType(expandedType === type ? null : type);
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
            className="grid grid-cols-1 gap-3"
          >
            {/* Long Form Option */}
            <div 
              className={cn(
                "relative rounded-md border-2 overflow-hidden transition-all",
                activeSkeleton.contentType === 'longform' 
                  ? "border-primary bg-primary/5" 
                  : "border-muted bg-card hover:bg-muted/10"
              )}
            >
              <Label 
                htmlFor="longform"
                className="cursor-pointer"
              >
                <RadioGroupItem value="longform" id="longform" className="sr-only" />
                
                {/* Main Button Area */}
                <div className="flex items-center p-3" onClick={() => toggleExpand('longform')}>
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <VideoIcon className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Long Form</span>
                      <span className="text-xs bg-primary/10 text-primary rounded-md px-2 py-0.5 font-medium">
                        &lt;20 min
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-2">
                    {expandedType === 'longform' ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </Label>
              
              {/* Expandable Content */}
              <AnimatePresence>
                {expandedType === 'longform' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">
                        Traditional YouTube videos with deeper storytelling, multiple points, and higher retention.
                      </p>
                      
                      <div className="bg-primary/5 p-2 rounded-md border border-primary/10">
                        <h4 className="text-xs font-medium text-primary mb-1">Tips</h4>
                        <ul className="text-xs space-y-0.5 text-muted-foreground">
                          <li>• Balance storytelling with value delivery</li>
                          <li>• Use rehooks to re-engage viewers</li>
                          <li>• Pattern interrupts every 2-3 minutes</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Short Form Option */}
            <div 
              className={cn(
                "relative rounded-md border-2 overflow-hidden transition-all",
                activeSkeleton.contentType === 'shortform' 
                  ? "border-red-500 bg-red-500/5" 
                  : "border-muted bg-card hover:bg-muted/10"
              )}
            >
              <Label 
                htmlFor="shortform"
                className="cursor-pointer"
              >
                <RadioGroupItem value="shortform" id="shortform" className="sr-only" />
                
                {/* Main Button Area */}
                <div className="flex items-center p-3" onClick={() => toggleExpand('shortform')}>
                  <div className="bg-red-500/10 p-2 rounded-full mr-3">
                    <SmartphoneIcon className="h-5 w-5 text-red-500" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Short Form</span>
                      <span className="text-xs bg-red-500/10 text-red-500 rounded-md px-2 py-0.5 font-medium">
                        15s-3 min
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-2">
                    {expandedType === 'shortform' ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </Label>
              
              {/* Expandable Content */}
              <AnimatePresence>
                {expandedType === 'shortform' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">
                        Optimized for Shorts, TikTok & Reels. Immediate hooks, visual-first content, rapid pacing.
                      </p>
                      
                      <div className="bg-red-500/5 p-2 rounded-md border border-red-500/10">
                        <h4 className="text-xs font-medium text-red-500 mb-1">Tips</h4>
                        <ul className="text-xs space-y-0.5 text-muted-foreground">
                          <li>• Hook viewers in first 2-3 seconds</li>
                          <li>• Use "visual-first" thinking</li>
                          <li>• Make every frame attention-worthy</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}