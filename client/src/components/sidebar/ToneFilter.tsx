import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/lib/store';

const TONES = ['Playful', 'Dramatic', 'Heartfelt', 'Empowering'];
const FILTERS = ['Cinematic', 'Minimalist', 'Bold', 'Natural'];

export default function ToneFilter() {
  const { activeSkeletonId, updateFrameTone, updateFrameFilter } = useWorkspace();

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-3">Tones</h3>
          <div className="grid grid-cols-2 gap-2">
            {TONES.map((tone) => (
              <Button
                key={tone}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (activeSkeletonId) {
                    // This would need to be modified to handle the selected frame
                    // updateFrameTone(activeSkeletonId, selectedFrameId, tone);
                  }
                }}
              >
                {tone}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Filters</h3>
          <div className="grid grid-cols-2 gap-2">
            {FILTERS.map((filter) => (
              <Button
                key={filter}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (activeSkeletonId) {
                    // This would need to be modified to handle the selected frame
                    // updateFrameFilter(activeSkeletonId, selectedFrameId, filter);
                  }
                }}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
