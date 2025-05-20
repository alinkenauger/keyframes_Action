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
      {/* First row of units */}
      <div className="grid grid-cols-2 gap-2">
        {firstRow.map((unit) => (
          <TabsTrigger
            key={unit}
            value={unit}
            onClick={() => onUnitChange(unit)}
            className={cn(
              "w-full",
              activeUnit === unit ? "bg-primary/10" : ""
            )}
          >
            {unit}
          </TabsTrigger>
        ))}
      </div>
      
      {/* Second row of units (if any) */}
      {secondRow.length > 0 && (
        <div className={cn(
          "grid gap-2",
          secondRow.length === 1 ? "grid-cols-1" : 
          secondRow.length === 2 ? "grid-cols-2" : 
          "grid-cols-2"
        )}>
          {secondRow.map((unit) => (
            <TabsTrigger
              key={unit}
              value={unit}
              onClick={() => onUnitChange(unit)}
              className={cn(
                "w-full",
                activeUnit === unit ? "bg-primary/10" : ""
              )}
            >
              {unit}
            </TabsTrigger>
          ))}
        </div>
      )}
    </div>
  );
}

export default UnitNavigation;