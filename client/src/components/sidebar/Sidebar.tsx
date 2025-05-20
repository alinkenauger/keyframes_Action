import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FrameLibrary from './FrameLibrary';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateSkeletonDialog from '@/components/skeleton/CreateSkeletonDialog';

export default function Sidebar() {
  const mobileCheck = useIsMobile();
  const [collapsed, setCollapsed] = useState(mobileCheck.isMobile);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className={cn(
      "relative border-r bg-gray-50/40 h-[calc(100vh-65px)] transition-all duration-300",
      collapsed ? "w-[40px]" : "w-80"
    )}>
      {/* Collapse/Expand toggle button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute -right-3 top-2 h-6 w-6 rounded-full border bg-background shadow-sm p-0 z-10"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className={cn(
        "p-4 transition-opacity",
        collapsed ? "opacity-0 invisible" : "opacity-100 visible"
      )}>
        <h3 className="text-lg font-semibold mb-4">Frames</h3>
        <FrameLibrary />
      </div>
    </div>
  );
}