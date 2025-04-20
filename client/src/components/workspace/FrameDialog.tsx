import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useWorkspace } from '@/lib/store';
import { Loader2, Sparkles, Settings, Zap } from 'lucide-react';
import { 
  generateFrameContent, 
  generateContentWithCustomGpt,
  UNIT_CONSTRAINTS, 
  getUnitQuestions 
} from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { useCustomGptAssistants } from '@/lib/custom-gpt';
import CustomGptDialog from '@/components/ai/CustomGptDialog';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

interface FrameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frame: {
    id: string;
    type: string;
    content: string;
    unitType: string;
    script?: string;
  };
  skeletonId: string;
}

export default function FrameDialog({ open, onOpenChange, frame, skeletonId }: FrameDialogProps) {
  const [script, setScript] = useState(frame.script || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUsingAgent2, setIsUsingAgent2] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>('');
  const [showCustomGptDialog, setShowCustomGptDialog] = useState(false);
  const [, navigate] = useLocation();

  const { updateFrameScript, getVideoContext } = useWorkspace();
  const { toast } = useToast();
  const { 
    assistants,
    getAssistantsByUnitType,
    getAssistant,
    initializeDefaultAssistants
  } = useCustomGptAssistants();

  const unitAssistants = getAssistantsByUnitType(frame.unitType);

  useEffect(() => {
    initializeDefaultAssistants();
  }, []);

  useEffect(() => {
    if (unitAssistants.length > 0 && !selectedAssistantId) {
      setSelectedAssistantId(unitAssistants[0].id);
    }
  }, [unitAssistants, selectedAssistantId]);

  const unitConstraints = UNIT_CONSTRAINTS[frame.unitType] || {
    maxLength: 300,
    guidelines: 'Keep content focused, clear, and engaging.'
  };

  // Get questions specific to the unit type (Hook, Intro, etc.) instead of frame type
  const unitQuestions = getUnitQuestions(frame.unitType);

  const handleAnswerChange = (question: string, answer: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const handleSave = () => {
    updateFrameScript(skeletonId, frame.id, script);
    onOpenChange(false);
  };

  const handleGenerateContent = async () => {
    const videoContext = getVideoContext(skeletonId);

    if (!videoContext) {
      toast({
        title: "Missing Video Context",
        description: "Please add context about your video in the skeleton settings first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let generatedContent = '';

      // If an assistant is selected, use the custom GPT
      if (selectedAssistantId) {
        const assistant = getAssistant(selectedAssistantId);
        if (assistant) {
          generatedContent = await generateContentWithCustomGpt(
            assistant,
            videoContext,
            frame.type,
            frame.unitType,
            questionAnswers
          );
        } else {
          // Fallback to standard generation if assistant not found
          generatedContent = await generateFrameContent(
            frame.type, 
            frame.unitType, 
            videoContext,
            questionAnswers
          );
        }
      } else {
        // Use standard generation if no assistant selected
        generatedContent = await generateFrameContent(
          frame.type, 
          frame.unitType, 
          videoContext,
          questionAnswers
        );
      }

      setScript(generatedContent);
      toast({
        title: "Content Generated",
        description: "AI-powered suggestion has been added. Feel free to edit it!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAssistant = () => {
    // Close the current dialog and navigate to the manager page
    onOpenChange(false);
    navigate('/custom-gpt');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{frame.type} ({frame.unitType})</DialogTitle>
          <DialogDescription>
            Edit content for this {frame.unitType} unit or generate AI-powered suggestions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Custom GPT Assistant Selection */}
          <div className="space-y-2 pb-2 border-b">
            <div className="flex justify-between items-center">
              <Label htmlFor="assistant">AI Assistant</Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCreateAssistant}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Assistants
              </Button>
            </div>

            {unitAssistants.length > 0 ? (
              <Select 
                value={selectedAssistantId}
                onValueChange={setSelectedAssistantId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI assistant" />
                </SelectTrigger>
                <SelectContent>
                  {unitAssistants.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      <span className="flex items-center">
                        {assistant.name}
                        {assistant.subType && (
                          <Badge variant="outline" className="ml-2 font-normal">
                            {assistant.subType}
                          </Badge>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground">
                No custom assistants for {frame.unitType}. 
                <Button 
                  variant="link"
                  size="sm"
                  className="px-1 h-auto"
                  onClick={handleCreateAssistant}
                >
                  Create one
                </Button>
              </div>
            )}
          </div>

          {/* Unit-specific Questions */}
          <div className="space-y-4">
            <h4 className="font-medium">{frame.unitType} Unit Questions</h4>
            <p className="text-sm text-muted-foreground">
              Answer these questions to help the AI generate targeted content for this {frame.unitType} unit
            </p>
            {unitQuestions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label>{question}</Label>
                <Input
                  value={questionAnswers[question] || ''}
                  onChange={(e) => handleAnswerChange(question, e.target.value)}
                  placeholder="Enter your answer..."
                />
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-medium">Unit Guidelines</h4>
            <p className="text-sm whitespace-pre-wrap">{unitConstraints.guidelines}</p>
            <p className="text-sm text-muted-foreground">
              Maximum length: {unitConstraints.maxLength} characters
            </p>
          </div>

          <div className="flex justify-end mb-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateContent}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Get AI Suggestion
            </Button>
          </div>

          <Textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter your content here..."
            className="min-h-[200px]"
          />

          {script.length > unitConstraints.maxLength && (
            <p className="text-sm text-destructive">
              Content exceeds maximum length by {script.length - unitConstraints.maxLength} characters
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={script.length > unitConstraints.maxLength}
          >
            Save Content
          </Button>
        </DialogFooter>
      </DialogContent>
      <CustomGptDialog
        open={showCustomGptDialog}
        onOpenChange={setShowCustomGptDialog}
        defaultUnitType={frame.unitType}
      />
    </Dialog>
  );
}