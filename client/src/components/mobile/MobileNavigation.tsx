import { LayersIcon, Palette, Play, List, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileView } from "@/hooks/use-mobile";

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({ className }: MobileNavigationProps) {
  const { step, goToStep } = useMobileView();
  
  const navItems = [
    { step: 1, icon: <FilePlus className="h-5 w-5" />, label: "Create" },
    { step: 2, icon: <LayersIcon className="h-5 w-5" />, label: "Frames" },
    { step: 3, icon: <Palette className="h-5 w-5" />, label: "Tones" },
    { step: 4, icon: <List className="h-5 w-5" />, label: "Plan" },
    { step: 5, icon: <Play className="h-5 w-5" />, label: "Script" }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-2",
      className
    )}>
      <div className="flex justify-between">
        {navItems.map(item => (
          <button
            key={item.step}
            onClick={() => goToStep(item.step)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
              step === item.step 
                ? "text-primary bg-primary/10" 
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}