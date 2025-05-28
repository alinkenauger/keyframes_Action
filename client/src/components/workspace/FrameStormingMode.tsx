import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Wand2, Bot, ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import type { Frame, Skeleton } from '@/types';
import { TONES, FILTERS } from '@/lib/constants';

interface FrameStormingModeProps {
  skeleton: Skeleton;
  onFrameUpdate: (frameId: string, content: string) => void;
  onFrameAttributeUpdate: (frameId: string, type: 'tone' | 'filter', value: string) => void;
}

export default function FrameStormingMode({ 
  skeleton, 
  onFrameUpdate,
  onFrameAttributeUpdate
}: FrameStormingModeProps) {
  const [openAIAssist, setOpenAIAssist] = useState<Record<string, boolean>>({});
  const [unitAssistants, setUnitAssistants] = useState<Record<string, string>>({});
  const [frameAnswers, setFrameAnswers] = useState<Record<string, Record<string, string>>>({});
  const [loadingFrameId, setLoadingFrameId] = useState<string | null>(null);

  const toggleAIAssist = (frameId: string) => {
    setOpenAIAssist(prev => ({
      ...prev,
      [frameId]: !prev[frameId]
    }));
  };

  const getFrameQuestions = (frame: Frame) => {
    const questionSets: Record<string, string[]> = {
      'visual-hook': [
        'What are the benefits of this video and why should the viewer stick around to watch it?',
        'What\'s the most surprising or unexpected thing about your content that will grab attention?',
        'What problem are you solving for the viewer in this video?'
      ],
      'voiceover-intro': [
        'What personal connection do you have to this topic?',
        'What makes you the right person to teach this?',
        'What\'s your unique perspective on this subject?'
      ],
      'problem-statement': [
        'What specific problem does your audience face?',
        'Why is this problem important to solve now?',
        'What happens if they don\'t solve this problem?'
      ],
      'personal-connection': [
        'What personal experience led you to this topic?',
        'What mistake did you make that others can avoid?',
        'What transformation have you experienced?'
      ],
      'goal-statement': [
        'What specific outcome will viewers achieve?',
        'What will they be able to do after watching?',
        'What\'s your promise to them?'
      ],
      'technique-overview': [
        'What are the key steps in your technique?',
        'What makes your approach different?',
        'What\'s the most important tip for success?'
      ],
      'visual-showcase': [
        'What impressive visual will you show?',
        'What\'s the money shot of your content?',
        'What will make viewers say "wow"?'
      ]
    };

    return questionSets[frame.type] || [
      'What value will you provide in this section?',
      'What should viewers understand or feel?',
      'What action do you want them to take?'
    ];
  };

  const handleAnswerChange = (frameId: string, questionIndex: number, answer: string) => {
    setFrameAnswers(prev => ({
      ...prev,
      [frameId]: {
        ...prev[frameId],
        [questionIndex]: answer
      }
    }));
  };

  const handleEnterAnswers = (frameId: string) => {
    const answers = frameAnswers[frameId] || {};
    const content = Object.values(answers).filter(answer => answer.trim()).join('\n\n');
    onFrameUpdate(frameId, content);
  };

  const handleEnhanceAnswers = async (frameId: string) => {
    setLoadingFrameId(frameId);
    const answers = frameAnswers[frameId] || {};
    const content = Object.values(answers).filter(answer => answer.trim()).join('\n\n');
    
    // Here you would call your AI enhancement API
    // For now, we'll just add the content as is
    onFrameUpdate(frameId, content + '\n\n[AI Enhancement placeholder - integrate with your OpenAI service]');
    setLoadingFrameId(null);
  };

  // Calculate completion progress
  const completedFrames = skeleton.frames.filter(frame => 
    frame.content && frame.content.trim().length > 0
  ).length;
  const progressPercentage = Math.round((completedFrames / skeleton.frames.length) * 100);

  // Order frames by unit position (left to right, top to bottom within each unit)
  const orderedFrames = React.useMemo(() => {
    const frames: Frame[] = [];
    
    if (skeleton.units) {
      skeleton.units.forEach(unitName => {
        const unitFrames = skeleton.frames.filter(frame => frame.unitType === unitName);
        frames.push(...unitFrames);
      });
    }
    
    return frames;
  }, [skeleton]);

  const getUnitColor = (unitType: string) => {
    const colors: Record<string, string> = {
      'Hook': 'bg-red-50 border-red-200 text-red-800',
      'Intro': 'bg-blue-50 border-blue-200 text-blue-800',
      'Story Setup': 'bg-green-50 border-green-200 text-green-800',
      'Content Delivery': 'bg-orange-50 border-orange-200 text-orange-800',
      'Content Journey': 'bg-indigo-50 border-indigo-200 text-indigo-800',
      'Practical Application': 'bg-purple-50 border-purple-200 text-purple-800',
      'Case Study': 'bg-pink-50 border-pink-200 text-pink-800',
      'Climax': 'bg-emerald-50 border-emerald-200 text-emerald-800',
      'Reflection': 'bg-amber-50 border-amber-200 text-amber-800',
      'Outro': 'bg-rose-50 border-rose-200 text-rose-800'
    };
    return colors[unitType] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {/* Header with guidance and progress */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Frame-Storming Mode</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Write your script ideas below for each frame. Use AI Assist for frame-specific guidance.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progressPercentage}%</div>
              <div className="text-xs text-muted-foreground">
                {completedFrames} of {skeleton.frames.length} frames complete
              </div>
            </div>
          </div>
          
          {progressPercentage === 100 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">Great work! Your frame content is complete.</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Ready to move to the Full Script tab to generate your complete video script?
              </p>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {orderedFrames.map((frame, index) => {
          const isNewUnit = index === 0 || orderedFrames[index - 1]?.unitType !== frame.unitType;
          const unitIndex = skeleton.units?.indexOf(frame.unitType) || 0;
          
          return (
            <div key={frame.id} className="space-y-3">
              {/* Unit header when starting a new unit */}
              {isNewUnit && (
                <div className={`p-4 rounded-lg border-2 ${getUnitColor(frame.unitType)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{frame.unitType}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Unit {unitIndex + 1} of {skeleton.units?.length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={unitAssistants[frame.unitType] || 'Hook Specialist'}
                        onValueChange={(value) => setUnitAssistants(prev => ({
                          ...prev,
                          [frame.unitType]: value
                        }))}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hook Specialist">Hook Specialist</SelectItem>
                          <SelectItem value="Story Specialist">Story Specialist</SelectItem>
                          <SelectItem value="Tutorial Specialist">Tutorial Specialist</SelectItem>
                          <SelectItem value="Engagement Specialist">Engagement Specialist</SelectItem>
                          <SelectItem value="Custom Assistant">+ Create Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Frame card */}
              <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Frame {index + 1}
                    </Badge>
                    <h4 className="font-medium">{frame.name}</h4>
                  </div>
                </div>

                {/* AI Assist Collapsible Section */}
                <Collapsible 
                  open={openAIAssist[frame.id] || false} 
                  onOpenChange={() => toggleAIAssist(frame.id)}
                  className="mb-4"
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start p-2 h-auto font-normal text-left hover:bg-primary/5"
                    >
                      <div className="flex items-center gap-2">
                        {openAIAssist[frame.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">AI Assist (Recommended)</span>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-3 pt-2">
                    <div className="text-xs text-muted-foreground mb-3">
                      Answer these questions to help the AI generate targeted content for this {frame.unitType} unit
                    </div>
                    
                    {getFrameQuestions(frame).map((question, questionIndex) => (
                      <div key={questionIndex} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {question}
                        </label>
                        <Textarea
                          value={frameAnswers[frame.id]?.[questionIndex] || ''}
                          onChange={(e) => handleAnswerChange(frame.id, questionIndex, e.target.value)}
                          placeholder="Enter your answer..."
                          className="min-h-[60px] text-sm resize-none"
                        />
                      </div>
                    ))}
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEnterAnswers(frame.id)}
                        className="flex-1"
                      >
                        Enter
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleEnhanceAnswers(frame.id)}
                        disabled={loadingFrameId === frame.id}
                        className="flex-1"
                      >
                        {loadingFrameId === frame.id ? 'Enhancing...' : 'Enhance'}
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Tone and Filter selectors */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Tone</label>
                    <Select
                      value={frame.tone || ''}
                      onValueChange={(value) => onFrameAttributeUpdate(frame.id, 'tone', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Filter</label>
                    <Select
                      value={frame.filter || ''}
                      onValueChange={(value) => onFrameAttributeUpdate(frame.id, 'filter', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select filter" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTERS.map((filter) => (
                          <SelectItem key={filter} value={filter}>
                            {filter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Content textarea */}
                <Textarea
                  value={frame.content || ''}
                  onChange={(e) => onFrameUpdate(frame.id, e.target.value)}
                  placeholder={`Write content for ${frame.name}...`}
                  className="min-h-[120px] resize-y focus:ring-2 focus:ring-primary/20"
                  style={{ lineHeight: '1.6' }}
                />

                {/* Show frame attributes if they exist */}
                {(frame.tone || frame.filter) && (
                  <div className="flex gap-2 mt-3">
                    {frame.tone && (
                      <Badge variant="secondary" className="text-xs">
                        {frame.tone}
                      </Badge>
                    )}
                    {frame.filter && (
                      <Badge variant="outline" className="text-xs">
                        {frame.filter}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {orderedFrames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No frames found. Add some frames to your skeleton to start frame-storming!
          </p>
        </div>
      )}
    </div>
  );
}