import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2 } from 'lucide-react';
import type { Frame, Skeleton } from '@/types';

interface FrameStormingModeProps {
  skeleton: Skeleton;
  onFrameUpdate: (frameId: string, content: string) => void;
}

export default function FrameStormingMode({ 
  skeleton, 
  onFrameUpdate
}: FrameStormingModeProps) {

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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Frame-Storming Mode</h2>
        <p className="text-muted-foreground">
          Work through your frames sequentially like writing a document. Flow from left-to-right units, top-to-bottom frames.
        </p>
      </div>

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
                    className="flex items-center gap-2"
                    disabled
                  >
                    <Wand2 className="w-4 h-4" />
                    AI Enhance
                  </Button>
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