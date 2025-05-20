import { cn } from "@/lib/utils";

interface FrameDropIndicatorProps {
  position: "top" | "bottom" | "middle" | null;
  className?: string;
}

export default function FrameDropIndicator({ position, className }: FrameDropIndicatorProps) {
  if (!position) return null;

  if (position === "top" || position === "bottom") {
    return (
      <>
        {/* Line indicator */}
        <div 
          className={cn(
            "absolute inset-x-0 z-20",
            position === "top" ? "top-0 -translate-y-1/2" : "",
            position === "bottom" ? "bottom-0 translate-y-1/2" : "",
            className
          )}
        >
          <div
            className="mx-auto h-2 bg-primary rounded-full shadow-md w-3/4"
            style={{
              animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            }}
          />
        </div>
        
        {/* Gap indicator - shows the space where the frame will be inserted */}
        <div
          className={cn(
            "absolute inset-x-0 z-10 h-6 bg-primary/10 border-2 border-dashed border-primary/40",
            position === "top" ? "top-0 -translate-y-3" : "bottom-0 translate-y-3"
          )}
        />
      </>
    );
  }
  
  // Middle position indicator
  return (
    <div 
      className={cn(
        "absolute inset-x-0 z-20 top-1/2 -translate-y-1/2",
        className
      )}
    >
      <div
        className="mx-auto h-2 bg-primary rounded-full shadow-md w-1/2"
        style={{
          animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        }}
      />
    </div>
  );
}