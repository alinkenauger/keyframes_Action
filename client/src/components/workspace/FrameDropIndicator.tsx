import { cn } from "@/lib/utils";

interface FrameDropIndicatorProps {
  position: "top" | "bottom" | "middle" | null;
  className?: string;
}

export default function FrameDropIndicator({ position, className }: FrameDropIndicatorProps) {
  if (!position) return null;

  return (
    <div 
      className={cn(
        "absolute inset-x-0 h-1 bg-primary rounded-full shadow-md z-20",
        position === "top" ? "top-0 -translate-y-1/2" : "",
        position === "bottom" ? "bottom-0 translate-y-1/2" : "",
        position === "middle" ? "top-1/2 -translate-y-1/2" : "",
        className
      )}
      style={{
        animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }}
    />
  );
}