import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/**
 * UnitTabsGrid - A component that displays unit tabs in a grid layout (2x2)
 * This solves the problem of horizontally cramped tabs
 */
export function UnitTabsGrid({ units, activeUnit, onUnitChange }: {
  units: string[];
  activeUnit: string;
  onUnitChange: (unit: string) => void;
}) {
  // Calculate number of items in each row to create a balanced grid
  const firstRowCount = Math.ceil(units.length / 2);
  const firstRow = units.slice(0, firstRowCount);
  const secondRow = units.slice(firstRowCount);

  return (
    <div className="space-y-2">
      {/* First row */}
      <div className="grid grid-cols-2 gap-2">
        {firstRow.map(unit => (
          <TabsTrigger
            key={unit}
            value={unit}
            onClick={() => onUnitChange(unit)}
            className="w-full"
          >
            {unit}
          </TabsTrigger>
        ))}
      </div>
      
      {/* Second row */}
      {secondRow.length > 0 && (
        <div className={cn(
          "grid gap-2",
          secondRow.length === 1 ? "grid-cols-1" : "grid-cols-2"
        )}>
          {secondRow.map(unit => (
            <TabsTrigger
              key={unit}
              value={unit}
              onClick={() => onUnitChange(unit)}
              className="w-full"
            >
              {unit}
            </TabsTrigger>
          ))}
        </div>
      )}
    </div>
  );
}

export default UnitTabsGrid;