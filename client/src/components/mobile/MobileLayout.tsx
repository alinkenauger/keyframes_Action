import { useMobileView } from "@/hooks/use-mobile";
import MobileNavigation from "./MobileNavigation";
import MobileStepIndicator from "./MobileStepIndicator";
import MobileFrameLibrary from "./MobileFrameLibrary";
import MobileWorkspace from "./MobileWorkspace";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight } from "lucide-react";
import { useState } from "react";

interface MobileLayoutProps {
  onDeleteFrame: (frameId: string) => void;
}

export default function MobileLayout({ onDeleteFrame }: MobileLayoutProps) {
  const { 
    step, 
    goToStep, 
    nextStep, 
    prevStep,
    mobileView,
    toggleMobileView 
  } = useMobileView();
  
  const [showNavHelp, setShowNavHelp] = useState(true);

  return (
    <div className="h-full flex flex-col">
      {/* Top status bar with step indicator */}
      <div className="p-2 border-b sticky top-0 bg-white z-10">
        <MobileStepIndicator 
          currentStep={step}
          onStepChange={goToStep}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Mobile view toggle */}
        {showNavHelp && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-black/70 text-white text-xs p-2 rounded-md w-40">
              Swipe between library and workspace views, or use the toggle button
              <Button 
                variant="link" 
                size="sm" 
                className="text-blue-200 p-0 h-auto text-xs"
                onClick={() => setShowNavHelp(false)}
              >
                Got it
              </Button>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobileView}
            className="h-8 w-8 p-0 rounded-full bg-white shadow-md"
          >
            {mobileView === 'sidebar' ? (
              <PanelRight className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* The swipeable views */}
        <div className="flex h-full transition-transform duration-300"
          style={{
            transform: mobileView === 'workspace' ? 'translateX(-100%)' : 'translateX(0)'
          }}
        >
          {/* Library View - Steps 1-3 */}
          <div className="w-full h-full flex-shrink-0 overflow-auto">
            <div className="p-4">
              {step === 1 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Create a Skeleton</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Start by creating a new skeleton for your content.
                  </p>
                </div>
              )}
              
              {step === 2 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Add Frames</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Tap on frames to add them to your skeleton. Each frame represents a segment of your content.
                  </p>
                </div>
              )}
              
              {step === 3 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Add Tones & Filters</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Tap on tones and filters to apply them to your frames. This will help shape your content's style.
                  </p>
                </div>
              )}
              
              <MobileFrameLibrary />
            </div>
          </div>
          
          {/* Workspace View - Steps 4-5 */}
          <div className="w-full h-full flex-shrink-0 overflow-auto">
            <MobileWorkspace onDeleteFrame={onDeleteFrame} />
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <MobileNavigation className="pb-safe-area" />
    </div>
  );
}