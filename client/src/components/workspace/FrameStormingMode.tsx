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
  const [submittedFrames, setSubmittedFrames] = useState<Set<string>>(new Set());

  const toggleAIAssist = (frameId: string) => {
    setOpenAIAssist(prev => ({
      ...prev,
      [frameId]: !prev[frameId]
    }));
  };

  const getFrameQuestions = (frame: Frame) => {
    const questionSets: Record<string, string[]> = {
      'call-out-the-audience': [
        'What does the majority of your audience do or think is correct about this subject but it\'s NOT?',
        'What should viewers understand or feel when you call them out?',
        'What action do you want them to take with this call out? (Why should they watch and what will it do for them?)'
      ],
      'attention-grabber': [
        'What shocking or surprising statement will stop viewers from scrolling?',
        'What\'s the most unexpected angle on your topic?',
        'What bold claim can you make that hooks them immediately?'
      ],
      'visual-hook': [
        'What compelling visual will grab attention in the first 3 seconds?',
        'What\'s the most striking visual element of your content?',
        'What visual will make viewers stop and watch?'
      ],
      'problem-statement': [
        'What specific problem does your audience face daily?',
        'Why is this problem costing them time, money, or happiness?',
        'What happens if they don\'t solve this problem?'
      ],
      'relatable-problem': [
        'What frustrating situation do most people in your audience experience?',
        'What common mistake or struggle can you relate to?',
        'How does this problem show up in their everyday life?'
      ],
      'common-business-challenge': [
        'What business challenge keeps your audience up at night?',
        'What expensive mistake do most businesses make?',
        'What obstacle prevents them from reaching their goals?'
      ],
      'personal-connection': [
        'What personal experience led you to discover this solution?',
        'What mistake did you make that others can avoid?',
        'What transformation have you experienced?'
      ],
      'goal-statement': [
        'What specific outcome will viewers achieve by the end?',
        'What will they be able to do that they can\'t do now?',
        'What\'s your promise to them?'
      ],
      'technique-overview': [
        'What are the 3-5 key steps in your technique?',
        'What makes your approach different from others?',
        'What\'s the most important element for success?'
      ],
      'step-by-step': [
        'What are the exact steps viewers need to follow?',
        'What tools or resources do they need?',
        'What\'s the most critical step they can\'t skip?'
      ],
      'visual-showcase': [
        'What impressive result will you demonstrate?',
        'What\'s the "money shot" that proves your point?',
        'What transformation will make viewers say "wow"?'
      ],
      'results-reveal': [
        'What dramatic before-and-after will you show?',
        'What specific metrics or outcomes will you share?',
        'What proof do you have that this works?'
      ],
      'call-to-action': [
        'What specific action do you want viewers to take right now?',
        'What\'s the next logical step in their journey?',
        'How will taking this action benefit them immediately?'
      ],
      'challenge-setup': [
        'What are the rules or constraints of this challenge?',
        'What makes this challenge exciting or difficult?',
        'What\'s at stake and what will you prove?'
      ],
      'rehook': [
        'What new angle or surprise will re-engage viewers?',
        'What additional value are you about to provide?',
        'Why should they keep watching instead of clicking away?'
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
    
    // Mark frame as submitted
    setSubmittedFrames(prev => new Set([...prev, frameId]));
    
    // Close AI Assist accordion after submission
    setOpenAIAssist(prev => ({
      ...prev,
      [frameId]: false
    }));
  };

  const handleEnhanceAnswers = async (frameId: string) => {
    setLoadingFrameId(frameId);
    const answers = frameAnswers[frameId] || {};
    const content = Object.values(answers).filter(answer => answer.trim()).join('\n\n');
    
    // Here you would call your AI enhancement API
    // For now, we'll just add the content as is
    onFrameUpdate(frameId, content + '\n\n[AI Enhancement placeholder - integrate with your OpenAI service]');
    
    // Mark frame as submitted
    setSubmittedFrames(prev => new Set([...prev, frameId]));
    
    // Close AI Assist accordion after submission
    setOpenAIAssist(prev => ({
      ...prev,
      [frameId]: false
    }));
    
    setLoadingFrameId(null);
  };

  // Calculate completion progress based on submitted frames only
  const completedFrames = submittedFrames.size;
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
              <div className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition-all ${
                submittedFrames.has(frame.id) 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={submittedFrames.has(frame.id) ? "default" : "outline"} 
                      className={`text-xs ${
                        submittedFrames.has(frame.id) 
                          ? 'bg-green-600 text-white' 
                          : ''
                      }`}
                    >
                      {submittedFrames.has(frame.id) ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Frame {index + 1}
                        </div>
                      ) : (
                        `Frame ${index + 1}`
                      )}
                    </Badge>
                    <h4 className={`font-medium ${
                      submittedFrames.has(frame.id) ? 'text-green-800' : ''
                    }`}>
                      {frame.name.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </h4>
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