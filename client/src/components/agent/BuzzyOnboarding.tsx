import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChatInterface from './ChatInterface';
import { useConversationStore } from '@/lib/conversation-store';
import { cn } from '@/lib/utils';
import { X, ChevronRight } from 'lucide-react';
import { useWorkspace } from '@/lib/store';

interface BuzzyOnboardingProps {
  open: boolean;
  onComplete: () => void;
  userId?: string;
}

export default function BuzzyOnboarding({ open, onComplete, userId }: BuzzyOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { createConversation, addMessage } = useConversationStore();
  const { activeSkeletonId } = useWorkspace();
  
  const conversationId = `buzzy-onboarding-${userId || 'default'}`;
  
  useEffect(() => {
    if (open) {
      // Create onboarding conversation
      createConversation(conversationId, 'partner', {
        userId,
        isOnboarding: true,
        step: currentStep
      });
      
      // Add Buzzy's initial greeting
      addMessage(conversationId, {
        role: 'agent',
        content: `🐝 Hey there! I'm Buzzy, your content creation companion! 

I'm here to help you create amazing videos that your audience will love. Before we dive into making content, I'd love to learn about YOU and your channel!

Let's start with something simple - what's your channel name? And what kind of content gets you excited to create? 🎬✨`,
        timestamp: new Date()
      });
    }
  }, [open, conversationId, createConversation, addMessage, currentStep, userId]);
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              🐝
            </div>
            <div>
              <h2 className="text-2xl font-bold">Meet Buzzy!</h2>
              <p className="text-sm opacity-90">Your AI Content Creation Partner</p>
            </div>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="px-6 py-3 border-b bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Getting to Know You</span>
            <span className="text-muted-foreground">Step {currentStep + 1} of 5</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            conversationId={conversationId}
            agentType="partner"
            context={{
              userId,
              isOnboarding: true,
              currentStep,
              onStepComplete: (step: number, data: any) => {
                // Handle step completion
                if (step === 4) {
                  // Final step completed
                  onComplete();
                } else {
                  setCurrentStep(step + 1);
                }
              }
            }}
            className="h-full"
          />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              💡 Tip: The more you share, the better I can help you create amazing content!
            </p>
            {currentStep === 4 && (
              <Button onClick={onComplete} className="gap-2">
                Start Creating <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}