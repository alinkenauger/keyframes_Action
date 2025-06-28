import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoIcon, Wand2 } from 'lucide-react';
import { useWorkspace } from '@/lib/store';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateVideoScript, VideoScript } from '@/lib/script-service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download } from 'lucide-react';

export default function GenerateScriptButton() {
  const { toast } = useToast();
  const { skeletons, activeSkeletonId } = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);

  const activeSkeleton = activeSkeletonId 
    ? skeletons.find(s => s.id === activeSkeletonId) 
    : null;

  const handleGenerateScript = async () => {
    if (!activeSkeleton) {
      toast({
        title: 'No skeleton selected',
        description: 'Please select a skeleton first to generate a script.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate the script
      const script = await generateVideoScript(activeSkeleton);
      setGeneratedScript(script);
      
      toast({
        title: 'Script generated successfully!',
        description: `Created a complete ${activeSkeleton.contentType || 'longform'} script based on your skeleton structure.`,
      });
    } catch (error: any) {
      console.error('Script generation error:', error);
      toast({
        title: 'Failed to generate script',
        description: error.message || 'An error occurred while generating the script.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadScript = () => {
    if (!generatedScript) return;
    
    // Create a nicely formatted text version of the script
    let scriptText = `# ${generatedScript.title}\n\n`;
    scriptText += `Description: ${generatedScript.description}\n`;
    scriptText += `Target Duration: ${generatedScript.targetDuration}\n\n`;
    
    // Add sections
    generatedScript.sections.forEach((section, index) => {
      scriptText += `## ${section.frameType}\n\n`;
      scriptText += `${section.content}\n\n`;
      scriptText += `Voice Direction: ${section.voiceDirection}\n\n`;
      
      // Add B-roll
      scriptText += "B-Roll:\n";
      section.bRoll.forEach((bRoll, i) => {
        scriptText += `${i + 1}. ${bRoll.description} - ${bRoll.timing} - ${bRoll.purpose}\n`;
      });
      scriptText += "\n";
      
      // Add transition if it exists
      if (section.transition) {
        scriptText += `Transition: ${section.transition.description} (${section.transition.type})\n`;
        if (section.transition.visualEffect) {
          scriptText += `Visual Effect: ${section.transition.visualEffect}\n`;
        }
        if (section.transition.audioEffect) {
          scriptText += `Audio Effect: ${section.transition.audioEffect}\n`;
        }
      }
      scriptText += "\n---\n\n";
    });
    
    // Add hooks and notes
    scriptText += "# Hooks\n\n";
    scriptText += "## Thumbnail Ideas\n";
    generatedScript.hooks.thumbnail.forEach((thumb, i) => {
      scriptText += `${i + 1}. ${thumb}\n`;
    });
    
    scriptText += "\n## Title Variations\n";
    generatedScript.hooks.title.forEach((title, i) => {
      scriptText += `${i + 1}. ${title}\n`;
    });
    
    scriptText += "\n# Notes\n";
    generatedScript.notes.forEach((note, i) => {
      scriptText += `- ${note}\n`;
    });
    
    // Create and download the file
    const element = document.createElement("a");
    const file = new Blob([scriptText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${generatedScript.title.replace(/[^a-zA-Z0-9]/g, "_")}_script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Script downloaded!",
      description: "Your script has been downloaded as a text file.",
    });
  };

  // Check if the skeleton is valid for script generation
  const hasValidSkeleton = activeSkeleton && activeSkeleton.frames.length > 0;

  return (
    <>
      <Button 
        onClick={() => setDialogOpen(true)}
        variant="secondary"
        className="gap-2"
        disabled={!hasValidSkeleton}
      >
        <VideoIcon className="h-4 w-4" />
        Generate Script
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {generatedScript 
                ? "Your Video Script" 
                : "Generate Complete Video Script"}
            </DialogTitle>
            <DialogDescription>
              {generatedScript 
                ? `This ${activeSkeleton?.contentType || 'longform'} video script has been generated based on your skeleton structure.`
                : "Create a complete video script with B-roll suggestions and smooth transitions."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {!generatedScript ? (
              <div className="py-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Script Generator</CardTitle>
                    <CardDescription>
                      This will generate a complete script based on your skeleton structure, with:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 my-4">
                      <li className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1 rounded">
                          <VideoIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span>Complete word-for-word script for each frame</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1 rounded">
                          <VideoIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span>B-roll recommendations for visual interest</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1 rounded">
                          <VideoIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span>Transitions between frames with audio/visual cues</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1 rounded">
                          <VideoIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span>Title, thumbnail, and description recommendations</span>
                      </li>
                    </ul>

                    <div className="bg-muted p-4 rounded-md mt-6">
                      <p className="text-sm font-medium mb-2">Content Type: {activeSkeleton?.contentType === 'shortform' ? 'Short Form (15s-3 min)' : 'Long Form (< 20 min)'}</p>
                      <p className="text-sm text-muted-foreground">
                        The script will be optimized for {activeSkeleton?.contentType === 'shortform' ? 'short-form platforms like TikTok, Shorts, and Reels' : 'long-form YouTube videos'}.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleGenerateScript}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Script
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="py-4">
                <Tabs defaultValue="script">
                  <TabsList className="mb-4">
                    <TabsTrigger value="script">Script</TabsTrigger>
                    <TabsTrigger value="broll">B-Roll</TabsTrigger>
                    <TabsTrigger value="optimization">Optimization</TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    <TabsContent value="script" className="mt-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-bold">{generatedScript.title}</h2>
                          <p className="text-muted-foreground">
                            {generatedScript.targetDuration}
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleDownloadScript}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {generatedScript.sections.map((section, index) => (
                          <Card key={index}>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">{section.frameType}</CardTitle>
                              <CardDescription>{section.voiceDirection}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="whitespace-pre-wrap text-sm">
                                {section.content}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="broll" className="mt-0">
                      <h2 className="text-xl font-bold mb-4">B-Roll Recommendations</h2>
                      
                      <div className="space-y-4">
                        {generatedScript.sections.map((section, index) => (
                          <Card key={index}>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">{section.frameType}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {section.bRoll.map((broll, i) => (
                                  <div key={i} className="bg-muted/50 p-3 rounded-md">
                                    <div className="font-medium">{broll.description}</div>
                                    <div className="text-sm mt-1 flex justify-between">
                                      <span className="text-muted-foreground">{broll.purpose}</span>
                                      <span className="text-sm font-medium">{broll.timing}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="optimization" className="mt-0">
                      <h2 className="text-xl font-bold mb-4">Video Optimization</h2>
                      
                      <Card className="mb-4">
                        <CardHeader>
                          <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md text-sm">
                            {generatedScript.description}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Title Options</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {generatedScript.hooks.title.map((title, i) => (
                                <div key={i} className="bg-muted/50 p-2 rounded-md">
                                  {title}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Thumbnail Ideas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {generatedScript.hooks.thumbnail.map((thumb, i) => (
                                <div key={i} className="bg-muted/50 p-2 rounded-md">
                                  {thumb}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {generatedScript.notes.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {generatedScript.notes.map((note, i) => (
                                <li key={i} className="bg-muted/50 p-2 rounded-md text-sm">
                                  {note}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}