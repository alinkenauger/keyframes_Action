import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  const [loadingFrameId, setLoadingFrameId] = useState<string | null>(null);

  const handleAIAssist = async (frame: Frame) => {
    setLoadingFrameId(frame.id);
    
    // Generate frame-specific questions based on frame type and unit
    const framePrompt = generateFramePrompt(frame);
    onFrameUpdate(frame.id, framePrompt);
    
    setLoadingFrameId(null);
  };

  const generateFramePrompt = (frame: Frame) => {
    const prompts = {
      'visual-hook': 'What compelling visual will grab attention in the first 3 seconds? Describe the opening shot that makes viewers stop scrolling.',
      'voiceover-intro': 'What will you say to immediately connect with your audience? Write your opening line that hooks them in.',
      'problem-statement': 'What problem or challenge will you address? Why should viewers care about this topic?',
      'personal-connection': 'How does this topic relate to your personal experience? What story can you share?',
      'goal-statement': 'What specific outcome will viewers achieve by watching? What\'s your promise to them?',
      'technique-overview': 'What technique or method will you teach? Break it down into clear steps.',
      'visual-showcase': 'What impressive visual will demonstrate your point? Describe the money shot.',
      'step-by-step': 'What are the exact steps viewers need to follow? Make it actionable.',
      'common-mistakes': 'What mistakes do beginners make? How can viewers avoid them?',
      'pro-tips': 'What insider knowledge will you share? What makes the difference between good and great?',
      'results-reveal': 'What transformation will you show? What\'s the before and after?',
      'call-to-action': 'What action do you want viewers to take? How will you motivate them?'
    };

    return prompts[frame.type] || `What content will you create for this ${frame.name} section? Consider your audience and the value you want to deliver.`;
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
                    <h3 className="font-semibold text-lg">{frame.unitType}</h3>
                    <Badge variant="secondary" className="text-xs">
                      Unit {unitIndex + 1} of {skeleton.units?.length || 0}
                    </Badge>
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
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-primary/10"
                    onClick={() => handleAIAssist(frame)}
                    disabled={loadingFrameId === frame.id}
                  >
                    <Bot className="w-4 h-4" />
                    {loadingFrameId === frame.id ? 'Loading...' : 'AI Assist'}
                  </Button>
                </div>

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