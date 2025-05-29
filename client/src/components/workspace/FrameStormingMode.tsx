import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight, Bot, CheckCircle2 } from 'lucide-react';
import { Frame, Skeleton } from '@/types';
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
  const [frameAnswers, setFrameAnswers] = useState<Record<string, Record<number, string>>>({});
  const [loadingFrameId, setLoadingFrameId] = useState<string | null>(null);
  const [submittedFrames, setSubmittedFrames] = useState<Set<string>>(new Set());

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const totalFrames = skeleton.frames.length;
    const completedFrames = submittedFrames.size;
    return totalFrames > 0 ? Math.round((completedFrames / totalFrames) * 100) : 0;
  }, [skeleton.frames.length, submittedFrames.size]);

  // Order frames by unit type order, then by frame order within unit
  const orderedFrames = useMemo(() => {
    const unitOrder = skeleton.units;
    return skeleton.frames.sort((a, b) => {
      const aUnitIndex = unitOrder.indexOf(a.unitType);
      const bUnitIndex = unitOrder.indexOf(b.unitType);
      if (aUnitIndex !== bUnitIndex) {
        return aUnitIndex - bUnitIndex;
      }
      return 0;
    });
  }, [skeleton.frames, skeleton.units]);

  const toggleAIAssist = (frameId: string) => {
    setOpenAIAssist(prev => ({
      ...prev,
      [frameId]: !prev[frameId]
    }));
  };

  const handleAnswerChange = (frameId: string, questionIndex: number, value: string) => {
    setFrameAnswers(prev => ({
      ...prev,
      [frameId]: {
        ...prev[frameId],
        [questionIndex]: value
      }
    }));
  };

  const handleEnterAnswers = (frameId: string) => {
    const answers = frameAnswers[frameId] || {};
    const answerText = Object.values(answers).join(' ');
    onFrameUpdate(frameId, answerText);
  };

  const handleEnhanceAnswers = async (frameId: string) => {
    setLoadingFrameId(frameId);
    try {
      const answers = frameAnswers[frameId] || {};
      const answerText = Object.values(answers).join(' ');
      onFrameUpdate(frameId, answerText + ' [Enhanced by AI]');
    } finally {
      setLoadingFrameId(null);
    }
  };

  const handleManualSubmit = (frameId: string) => {
    setSubmittedFrames(prev => new Set([...prev, frameId]));
  };

  const getFrameQuestions = (frame: Frame) => {
    const questions = [
      `What is the main message you want to convey in this ${frame.name.replace('-', ' ')}?`,
      `Who is your target audience for this content?`,
      `What specific outcome do you want from this section?`
    ];
    return questions;
  };

  const getUnitColor = (unitType: string) => {
    const colors: Record<string, string> = {
      'Hook': 'border-red-400 bg-red-50',
      'Intro': 'border-blue-400 bg-blue-50',
      'Content Journey': 'border-green-400 bg-green-50',
      'Process': 'border-green-400 bg-green-50',
      'Testing': 'border-yellow-400 bg-yellow-50',
      'Event': 'border-purple-400 bg-purple-50',
      'Reflection': 'border-indigo-400 bg-indigo-50',
      'Rehook': 'border-orange-400 bg-orange-50',
      'Outro': 'border-gray-400 bg-gray-50',
      'Call To Action': 'border-pink-400 bg-pink-50',
    };
    return colors[unitType] || 'border-gray-400 bg-gray-50';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with completion tracking */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
          <div className="text-left">
            <p className="font-medium text-gray-800">
              Write your script ideas below for each frame. Use AI Assist for frame-specific guidance.
            </p>
            <p className="text-sm text-gray-600">
              {submittedFrames.size} of {skeleton.frames.length} frames complete
            </p>
          </div>
        </div>
      </div>

      {/* Frames */}
      <div className="space-y-8">
        {orderedFrames.map((frame, index) => {
          const isNewUnit = index === 0 || frame.unitType !== orderedFrames[index - 1].unitType;
          
          return (
            <div key={frame.id}>
              {/* Unit header - only show for first frame of each unit */}
              {isNewUnit && (
                <div className="sticky top-0 z-10 mb-4">
                  <div className={`p-4 rounded-lg border-l-4 ${getUnitColor(frame.unitType)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {frame.unitType}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          Unit {skeleton.units.indexOf(frame.unitType) + 1} of {skeleton.units.length}
                        </Badge>
                      </div>
                      
                      <Select>
                        <SelectTrigger className="w-[200px] h-8">
                          <SelectValue placeholder={`${frame.unitType} Specialist`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">{frame.unitType} Specialist</SelectItem>
                          <SelectItem value="expert">Expert Mode</SelectItem>
                          <SelectItem value="beginner">Beginner Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Frame card */}
              <div className={`border-2 rounded-lg p-6 shadow-sm transition-all ${
                submittedFrames.has(frame.id) 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-white border-blue-200 border-dashed'
              }`}>
                {/* Clear Frame Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        submittedFrames.has(frame.id) 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {submittedFrames.has(frame.id) ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <h4 className={`text-lg font-semibold ${
                          submittedFrames.has(frame.id) ? 'text-green-800' : 'text-gray-800'
                        }`}>
                          {frame.name.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {submittedFrames.has(frame.id) ? '✓ Complete' : 'Write your content below'}
                        </p>
                      </div>
                    </div>
                    {submittedFrames.has(frame.id) && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Submitted
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Step 1: AI Assist Collapsible Section */}
                {!submittedFrames.has(frame.id) && (
                  <Collapsible 
                    open={openAIAssist[frame.id] || false} 
                    onOpenChange={() => toggleAIAssist(frame.id)}
                    className="mb-6"
                  >
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start p-3 h-auto font-normal text-left hover:bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                            1
                          </div>
                          {openAIAssist[frame.id] ? (
                            <ChevronDown className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-blue-600" />
                          )}
                          <Bot className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">AI Assist (Recommended)</span>
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
                )}

                {/* Step 2: Optional Tone and Filter */}
                {!submittedFrames.has(frame.id) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-medium">
                        2
                      </div>
                      <h5 className="font-medium text-gray-700">Choose Tone & Filter (Optional)</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
                )}

                {/* Step 3: Write Content */}
                {!submittedFrames.has(frame.id) && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                        3
                      </div>
                      <h5 className="font-medium text-gray-700">Write Your Content</h5>
                    </div>
                    <Textarea
                      value={frame.content || ''}
                      onChange={(e) => onFrameUpdate(frame.id, e.target.value)}
                      placeholder={`Write your script content for ${frame.name.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}...`}
                      className="min-h-[120px] resize-y focus:ring-2 focus:ring-blue-200 border-2"
                      style={{ lineHeight: '1.6' }}
                    />
                    
                    {/* Submit Frame Button */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={() => handleManualSubmit(frame.id)}
                        disabled={!frame.content || frame.content.trim().length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium"
                        size="lg"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Submit Frame
                      </Button>
                    </div>
                  </div>
                )}

                {/* Completion indicator for submitted frames */}
                {submittedFrames.has(frame.id) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Frame completed and submitted</span>
                    </div>
                  </div>
                )}

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