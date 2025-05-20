import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FrameLibrary from './FrameLibrary';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateSkeletonDialog from '@/components/skeleton/CreateSkeletonDialog';
import { ContentTypeSelector } from './ContentTypeSelector';
import { useWorkspace } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Sidebar() {
  const mobileCheck = useIsMobile();
  const [collapsed, setCollapsed] = useState(mobileCheck.isMobile);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { activeSkeletonId } = useWorkspace();

  return (
    <div className={cn(
      "relative border-r bg-gray-50/40 h-[calc(100vh-65px)] transition-all duration-300",
      collapsed ? "w-[40px]" : "w-80"
    )}>
      {/* Collapse/Expand toggle button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute -right-3 top-16 h-6 w-6 rounded-full border bg-background shadow-sm p-0 z-10"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className={cn(
        "h-full transition-opacity",
        collapsed ? "opacity-0 invisible" : "opacity-100 visible"
      )}>
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Frames</h3>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="h-8 px-2"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Skeleton
              </Button>
            </div>
            
            {/* Content Type Selector - only show when a skeleton is active */}
            {activeSkeletonId && <ContentTypeSelector />}
            
            <FrameLibrary />
            
            {/* New Skeleton Dialog */}
            <CreateSkeletonDialog 
              open={showCreateDialog} 
              onOpenChange={setShowCreateDialog}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}