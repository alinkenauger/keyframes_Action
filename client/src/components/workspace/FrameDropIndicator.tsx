import { cn } from "@/lib/utils";

interface FrameDropIndicatorProps {
  position: "top" | "bottom" | null;
  className?: string;
}

export default function FrameDropIndicator({ position, className }: FrameDropIndicatorProps) {
  if (!position) return null;

  return (
    <>
      {/* Enhanced line indicator with arrow */}
      <div 
        className={cn(
          "absolute inset-x-0 z-20 flex items-center justify-center",
          position === "top" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2",
          className
        )}
      >
        <div className="relative w-full">
          {/* Main drop line */}
          <div
            className="mx-auto h-3 bg-primary rounded-full shadow-lg w-4/5"
            style={{
              animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              boxShadow: "0 0 12px rgba(var(--primary), 0.6)"
            }}
          />
          {/* Arrow indicators */}
          <div className="absolute inset-0 flex items-center justify-between px-8">
            <div className="text-primary animate-bounce">▶</div>
            <div className="text-primary animate-bounce">◀</div>
          </div>
        </div>
      </div>
      
      {/* Enhanced gap indicator */}
      <div
        className={cn(
          "absolute inset-x-0 z-10 h-8 bg-primary/15 border-2 border-primary/50 rounded",
          "backdrop-blur-sm",
          position === "top" ? "top-0 -translate-y-4" : "bottom-0 translate-y-4"
        )}
        style={{
          borderStyle: "dashed",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        }}
      />
    </>
  );
}