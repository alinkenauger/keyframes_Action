import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface UnitNavigationProps {
  units: string[];
  activeUnit: string;
  onUnitChange: (unit: string) => void;
  className?: string;
}

/**
 * UnitNavigation component that displays unit tabs in a two-row layout
 * This resolves the issue of cramped horizontal tabs when many units are present
 */
export function UnitNavigation({ 
  units, 
  activeUnit, 
  onUnitChange,
  className 
}: UnitNavigationProps) {
  // Split units into two rows for better layout
  const midpoint = Math.ceil(units.length / 2);
  const firstRow = units.slice(0, midpoint);
  const secondRow = units.slice(midpoint);

  return (
    <div className={cn("space-y-2", className)}>
      {/* First row of units - Use regular buttons instead of TabsTrigger to avoid Radix UI issues */}
      <div className="grid grid-cols-2 gap-2">
        {firstRow.map((unit) => (
          <button
            key={unit}
            onClick={() => onUnitChange(unit)}
            className={cn(
              "w-full px-3 py-1.5 rounded-sm text-sm font-medium transition-colors",
              "inline-flex items-center justify-center",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              activeUnit === unit 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            {unit}
          </button>
        ))}
      </div>
      
      {/* Second row of units (if any) */}
      {secondRow.length > 0 && (
        <div className={cn(
          "grid gap-2",
          secondRow.length === 1 ? "grid-cols-1" : "grid-cols-2"
        )}>
          {secondRow.map((unit) => (
            <button
              key={unit}
              onClick={() => onUnitChange(unit)}
              className={cn(
                "w-full px-3 py-1.5 rounded-sm text-sm font-medium transition-colors",
                "inline-flex items-center justify-center",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                activeUnit === unit 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {unit}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UnitNavigation;