import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RotatableUnitProps {
  children: React.ReactNode;
  unitName: string;
  onRotationChange?: (rotation: number) => void;
}

export function RotatableUnit({ children, unitName, onRotationChange }: RotatableUnitProps) {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleRotate = () => {
    setIsRotating(true);
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    onRotationChange?.(newRotation);
    
    // Reset animation state
    setTimeout(() => {
      setIsRotating(false);
    }, 300);
  };

  return (
    <div className="relative h-full">
      {/* Rotation button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "absolute top-1 right-12 z-20 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
          isRotating && "animate-spin"
        )}
        onClick={handleRotate}
        title={`Rotate ${unitName} (${rotation}°)`}
      >
        <RotateCw className="h-4 w-4" />
      </Button>

      {/* Rotatable content wrapper */}
      <div
        className={cn(
          "h-full transition-transform duration-300 ease-in-out",
          rotation === 90 && "rotate-90 origin-center",
          rotation === 180 && "rotate-180",
          rotation === 270 && "-rotate-90 origin-center"
        )}
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: rotation === 90 || rotation === 270 ? 'center' : 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}