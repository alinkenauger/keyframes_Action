import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CREATOR_TEMPLATES } from '@/lib/frameLibrary';
import { useWorkspace } from '@/lib/store';
import { nanoid } from 'nanoid';
import { ArrowRight, PlayCircle, FileText, Layout } from 'lucide-react';

interface WelcomeScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowSkeletonCreator: () => void;
}

export default function WelcomeScreen({ open, onOpenChange, onShowSkeletonCreator }: WelcomeScreenProps) {
  const { addSkeleton, setActiveSkeletonId, setVideoContext } = useWorkspace();

  const handleSelectTemplate = (templateId: string) => {
    // Find the template
    const template = CREATOR_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      // Create a new skeleton based on the template
      const skeletonId = nanoid();
      const frames = [];

      // If the template has specific frames, add them to the skeleton
      if (template.frames) {
        for (const unitFrames of template.frames) {
          const unitType = unitFrames.unitType;
          
          // Get the specific frames for this unit
          for (const frameId of unitFrames.frameIds) {
            // Find example content if available
            let content = '';
            if (unitFrames.examples) {
              const example = unitFrames.examples.find(e => e.frameId === frameId);
              if (example && example.content) {
                content = example.content;
              }
            }
            
            // Create a new frame object
            frames.push({
              id: nanoid(),
              name: frameId,
              type: frameId,
              content: content,
              unitType: unitType,
              isTemplateExample: true
            });
          }
        }
      }
      
      // Create the new skeleton with the frames
      const newSkeleton = {
        id: skeletonId,
        name: template.name,
        frames: frames,
        units: template.units,
        contentType: 'short' as const
      };

      addSkeleton(newSkeleton);
      setActiveSkeletonId(newSkeleton.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Get More Views!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Let's get started by creating your first content structure
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <h3 className="text-lg font-medium mb-4">Choose how you want to begin:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Content Structure */}
            <Card className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => handleSelectTemplate('standard-structure')}>
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <PlayCircle className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-lg">Quick Start</h4>
                    <p className="text-muted-foreground">Use our recommended structure for high retention</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground pl-11">
                  <p className="mb-2">Includes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Hook → Intro → Content → Rehook → Content → CTA → Outro</li>
                    <li>Strategic rehook for audience re-engagement</li>
                    <li>Optimized for both short and long-form content</li>
                  </ul>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Use This Template <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Custom Creator */}
            <Card className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onShowSkeletonCreator()}>
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <Layout className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-lg">Custom Builder</h4>
                    <p className="text-muted-foreground">Design your own content structure</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground pl-11">
                  <p className="mb-2">Options:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Choose from creator templates (MrBeast, MKBHD, etc.)</li>
                    <li>Create a custom structure with drag-and-drop</li>
                    <li>Full control over units and sequence</li>
                  </ul>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Create Custom Structure <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your content structure helps organize your video into strategic sections. You can always change it later!
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Skip for now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}