import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Sparkles } from 'lucide-react';
import { useWorkspace } from '@/lib/store';
import type { Frame, Skeleton } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  const [enhancingFrames, setEnhancingFrames] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { videoContexts } = useWorkspace();

  // Order frames by unit position and frame position within unit
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

  const handleEnhanceFrame = async (frame: Frame) => {
    toast({
      title: "AI Enhancement",
      description: "AI enhancement will be available once you set up your preferences.",
    });
  };

  const getUnitColor = (unitType: string) => {
    const colors: Record<string, string> = {
      'Hook': 'bg-red-50 border-red-200',
      'Intro': 'bg-blue-50 border-blue-200',
      'Story Setup': 'bg-green-50 border-green-200',
      'Content Delivery': 'bg-orange-50 border-orange-200',
      'Content Journey': 'bg-indigo-50 border-indigo-200',
      'Practical Application': 'bg-purple-50 border-purple-200',
      'Case Study': 'bg-pink-50 border-pink-200',
      'Climax': 'bg-emerald-50 border-emerald-200',
      'Reflection': 'bg-amber-50 border-amber-200',
      'Outro': 'bg-rose-50 border-rose-200'
    };
    return colors[unitType] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Frame-Storming Mode</h2>
        <p className="text-muted-foreground">
          Work through your frames sequentially like writing a document. Each frame flows naturally into the next.
        </p>
      </div>

      <div className="space-y-6">
        {orderedFrames.map((frame, index) => {
          const isNewUnit = index === 0 || orderedFrames[index - 1]?.unitType !== frame.unitType;
          
          return (
            <div key={frame.id} className="space-y-3">
              {/* Unit header when starting a new unit */}
              {isNewUnit && (
                <div className={`p-4 rounded-lg border-2 ${getUnitColor(frame.unitType)}`}>
                  <h3 className="font-semibold text-lg">{frame.unitType}</h3>
                  <p className="text-sm text-muted-foreground">
                    {skeleton.units?.indexOf(frame.unitType) + 1} of {skeleton.units?.length}
                  </p>
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
                    onClick={() => handleEnhanceFrame(frame)}
                    disabled={enhancingFrames.has(frame.id) || (!frame.tone && !frame.filter)}
                    className="flex items-center gap-2"
                  >
                    {enhancingFrames.has(frame.id) ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Enhance
                      </>
                    )}
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
                        {Object.entries(TONES).map(([category, tones]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                              {category}
                            </div>
                            {tones.map((tone) => (
                              <SelectItem key={tone} value={tone}>
                                {tone}
                              </SelectItem>
                            ))}
                          </div>
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
                        {Object.entries(FILTERS).map(([category, filters]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                              {category}
                            </div>
                            {filters.map((filter) => (
                              <SelectItem key={filter} value={filter}>
                                {filter}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Content textarea */}
                <Textarea
                  value={frame.content}
                  onChange={(e) => onFrameUpdate(frame.id, e.target.value)}
                  placeholder={`Write content for ${frame.name}...`}
                  className="min-h-[120px] resize-none"
                  style={{ lineHeight: '1.6' }}
                />

                {/* Show selected attributes */}
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