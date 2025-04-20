import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileStepIndicatorProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function MobileStepIndicator({ 
  currentStep, 
  onStepChange,
  onNext,
  onPrev
}: MobileStepIndicatorProps) {
  const steps = [
    { id: 1, name: "Create", description: "Create a skeleton" },
    { id: 2, name: "Frames", description: "Add frames to your skeleton" },
    { id: 3, name: "Tones", description: "Add tones & filters" },
    { id: 4, name: "Plan", description: "Plan your content" },
    { id: 5, name: "Script", description: "Generate script" }
  ];

  return (
    <div className="bg-white shadow-md p-2 rounded-md">
      {/* Step progress bar */}
      <div className="flex items-center justify-between mb-1">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepChange(step.id)}
              className={cn(
                "rounded-full flex items-center justify-center transition-colors",
                "w-6 h-6 text-xs font-medium",
                currentStep === step.id 
                  ? "bg-primary text-white" 
                  : currentStep > step.id
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray-500"
              )}
            >
              {step.id}
            </button>
            
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-1 w-4",
                  currentStep > index + 1 ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current step description */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium">
          <p className="text-primary">{steps[currentStep - 1].name}</p>
          <p className="text-gray-500">{steps[currentStep - 1].description}</p>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0"
            disabled={currentStep === 1}
            onClick={onPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0"
            disabled={currentStep === 5}
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}