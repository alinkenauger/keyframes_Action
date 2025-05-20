import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

// Create a custom component for two-row tab layout
export function TwoRowTabList({ 
  units, 
  activeUnit, 
  onUnitChange,
  className 
}: {
  units: string[];
  activeUnit: string;
  onUnitChange: (unit: string) => void;
  className?: string;
}) {
  // Calculate number of items in each row to create a balanced grid
  const firstRowCount = Math.ceil(units.length / 2);
  const firstRow = units.slice(0, firstRowCount);
  const secondRow = units.slice(firstRowCount);

  return (
    <div className={cn("space-y-2", className)}>
      {/* First row */}
      <div className="grid grid-cols-2 gap-2">
        {firstRow.map(unit => (
          <button
            key={unit}
            onClick={() => onUnitChange(unit)}
            className={cn(
              "w-full px-3 py-1.5 inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium",
              "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              activeUnit === unit 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            {unit}
          </button>
        ))}
      </div>
      
      {/* Second row */}
      {secondRow.length > 0 && (
        <div className={cn(
          "grid gap-2",
          secondRow.length === 1 ? "grid-cols-1" : "grid-cols-2"
        )}>
          {secondRow.map(unit => (
            <button
              key={unit}
              onClick={() => onUnitChange(unit)}
              className={cn(
                "w-full px-3 py-1.5 inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium",
                "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
