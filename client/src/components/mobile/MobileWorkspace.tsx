import { useState, useRef } from 'react';
import { useWorkspace } from '@/lib/store';
import MobileFrame from './MobileFrame';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import ScriptViewer from '../workspace/ScriptViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useMobileView } from '@/hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface MobileWorkspaceProps {
  onDeleteFrame: (frameId: string) => void;
}

export default function MobileWorkspace({ onDeleteFrame }: MobileWorkspaceProps) {
  const { toast } = useToast();
  const { skeletons, activeSkeletonId } = useWorkspace();
  const activeSkeleton = skeletons.find((s) => s.id === activeSkeletonId);
  const [showScriptView, setShowScriptView] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("skeleton");
  const { step } = useMobileView();
  const skeletonContainerRef = useRef<HTMLDivElement>(null);

  // Group frames by unit type
  const framesByUnit: Record<string, any[]> = {};
  
  if (activeSkeleton) {
    // Get the skeleton's units or default ones
    const units = activeSkeleton.units || 
      (activeSkeleton.frames.length > 0
        ? Array.from(new Set(activeSkeleton.frames.map(f => f.unitType).filter(Boolean)))
        : ['Hook', 'Intro', 'Content', 'Rehook', 'Outro']);
    
    // Initialize empty arrays for each unit
    units.forEach(unit => {
      if (unit) {
        framesByUnit[unit] = [];
      }
    });
    
    // Group frames by unit
    activeSkeleton.frames.forEach(frame => {
      if (frame.unitType && framesByUnit[frame.unitType]) {
        framesByUnit[frame.unitType].push({ 
          ...frame, 
          skeletonId: activeSkeletonId 
        });
      }
    });
  }

  if (!activeSkeleton) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select or create a skeleton to begin</p>
      </div>
    );
  }

  // Determine what to show based on current step
  let content;
  
  if (step === 4) {
    // Step 4: Plan content for frames
    content = (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Plan Your Content</h2>
        <p className="text-sm text-gray-600 mb-4">
          Tap on any frame to edit its content or add details for the AI script generation.
        </p>
        
        <Accordion type="single" collapsible className="mb-20">
          {Object.entries(framesByUnit).map(([unitType, frames]) => (
            <AccordionItem key={unitType} value={unitType}>
              <AccordionTrigger className="text-left py-2 px-4 bg-gray-50 rounded-t-md">
                <div className="flex items-center">
                  <span className="text-md font-medium">{unitType}</span>
                  <span className="ml-2 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {frames.length} frames
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2 space-y-3">
                  {frames.length > 0 ? (
                    frames.map(frame => (
                      <MobileFrame
                        key={frame.id}
                        frame={frame}
                        onDelete={onDeleteFrame}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      No frames in this unit yet. Go to step 2 to add frames.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  } else if (step === 5) {
    // Step 5: Generate script
    content = (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Your Script</h2>
        <ScriptViewer id="mobile-script-viewer" fullWidth={true} />
      </div>
    );
  } else {
    // Default view shows skeleton
    content = (
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
              <TabsTrigger value="script">Script</TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowScriptView(!showScriptView)}
            >
              {showScriptView ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Script
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Script
                </>
              )}
            </Button>
          </div>

          <TabsContent value="skeleton" className="mt-0">
            <h2 className="text-xl font-semibold mb-2">{activeSkeleton.name}</h2>
            <p className="text-xs text-gray-500 mb-4">
              Tap on any frame to view or edit its content
            </p>
            
            <ScrollArea
              ref={skeletonContainerRef}
              className="max-h-[calc(100vh-230px)] overflow-auto pb-20"
            >
              <div className="space-y-6">
                {Object.entries(framesByUnit).map(([unitType, frames]) => (
                  <div key={unitType} className="border rounded-md">
                    <div className="bg-gray-50 p-3 font-medium border-b">
                      {unitType}
                    </div>
                    <div className="p-3">
                      {frames.length > 0 ? (
                        <div className="space-y-3">
                          {frames.map(frame => (
                            <MobileFrame 
                              key={frame.id} 
                              frame={frame}
                              onDelete={onDeleteFrame}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 py-4 text-center">
                          No frames yet. Add frames from the library.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="script" className="mt-0">
            <ScriptViewer id="mobile-script-viewer" fullWidth={true} />
          </TabsContent>
        </Tabs>

        {showScriptView && activeTab === "skeleton" && (
          <div className="mt-4">
            <ScriptViewer />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("min-h-full", step >= 4 ? "" : "hidden")}>
      {content}
    </div>
  );
}