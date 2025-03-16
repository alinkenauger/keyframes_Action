import { useWorkspace } from '@/lib/store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Copy, X, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ScriptViewerProps {
  fullWidth?: boolean;
  id?: string; // Added id prop for keyboard shortcut targeting
}

export default function ScriptViewer({ fullWidth = false, id }: ScriptViewerProps) {
  const { skeletons, activeSkeletonId } = useWorkspace();
  const { toast } = useToast();
  const [expandedView, setExpandedView] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const activeSkeleton = skeletons.find((s) => s.id === activeSkeletonId);

  if (!activeSkeleton) {
    return null;
  }

  const orderedFrames = activeSkeleton.frames
    .slice()
    .sort((a, b) => {
      // Sort by unit type first following the standard content progression
      const unitOrder = ['Hook', 'Intro', 'Content Journey', 'Rehook', 'Outro'];
      const aIndex = unitOrder.indexOf(a.unitType || '');
      const bIndex = unitOrder.indexOf(b.unitType || '');
      if (aIndex !== bIndex) return aIndex - bIndex;

      // If same unit type, preserve the original order they appear in the skeleton
      return activeSkeleton.frames.indexOf(a) - activeSkeleton.frames.indexOf(b);
    })
    .filter(frame => frame.script || frame.content); // Only include frames with content

  const handleCopyScript = () => {
    const scriptText = orderedFrames
      .map(frame => `${frame.unitType}: ${frame.type}\n${frame.script || frame.content}\n\n`)
      .join('');

    navigator.clipboard.writeText(scriptText);
    toast({
      title: 'Script Copied',
      description: 'Full script copied to clipboard',
    });
  };

  const handleExportPDF = () => {
    // This is a placeholder - for actual PDF generation we would need to use a library like jsPDF
    // or set up a server endpoint for PDF generation
    toast({
      title: 'Export Feature',
      description: 'PDF export will be available in the next update',
    });
  };

  const handleExportTeleprompter = () => {
    // Create a simple HTML format suitable for teleprompter apps
    const scriptText = orderedFrames
      .map(frame => `<h3>${frame.unitType}: ${frame.type}</h3><p>${frame.script || frame.content}</p>`)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${activeSkeleton.name} - Teleprompter Script</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h3 { color: #555; margin-bottom: 5px; }
          p { font-size: 18px; margin-top: 0; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${activeSkeleton.name}</h1>
        ${scriptText}
      </body>
      </html>
    `;

    // Create a Blob for the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create download link and trigger it
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSkeleton.name.replace(/\s+/g, '-')}-teleprompter.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Teleprompter Export',
      description: 'Teleprompter-friendly HTML file downloaded',
    });
  };

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Complete Script</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyScript}
            data-action="copy" // Added data attribute for targeting with keyboard shortcuts
            className="text-xs md:text-sm"
          >
            <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportPDF}
            className="text-xs md:text-sm"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportTeleprompter}
            className="text-xs md:text-sm"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">Teleprompter</span>
          </Button>
          {!showFullScreen && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpandedView(!expandedView)}
              className="hidden sm:flex"
            >
              {expandedView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
          {!showFullScreen && (
            <Button 
              variant="ghost"
              size="sm" 
              onClick={() => setShowFullScreen(true)}
            >
              <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className={cn(
        "border rounded-md bg-white p-4",
        expandedView ? "h-[500px]" : "h-[250px]",
        fullWidth ? "w-full" : ""
      )}>
        {orderedFrames.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No content added to frames yet. Edit frames to add content.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderedFrames.map((frame) => (
              <div key={frame.id} className="space-y-1">
                <h4 className="font-medium text-gray-800 text-sm md:text-base">
                  {frame.unitType}: {frame.type}
                  {frame.tone && <span className="text-blue-600 ml-2 text-xs md:text-sm">{frame.tone}</span>}
                  {frame.filter && <span className="text-purple-600 ml-2 text-xs md:text-sm">{frame.filter}</span>}
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap text-sm md:text-base">{frame.script || frame.content}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );

  // Full screen version in a dialog
  if (showFullScreen) {
    return (
      <Dialog open={showFullScreen} onOpenChange={setShowFullScreen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Full Script: {activeSkeleton.name}</DialogTitle>
            <DialogDescription>
              View and export your complete video script with all content sections
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div id={id} className={cn("p-4", fullWidth ? "w-full" : "")}>
      {content}
    </div>
  );
}