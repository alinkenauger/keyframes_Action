import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChatInterface from './ChatInterface';
import { useConversationStore } from '@/lib/conversation-store';
import { cn } from '@/lib/utils';
import { X, ChevronRight } from 'lucide-react';
import { useWorkspace } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';

interface BuzzyOnboardingProps {
  open: boolean;
  onComplete: () => void;
  userId?: string;
}

export default function BuzzyOnboarding({ open, onComplete, userId }: BuzzyOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [channelData, setChannelData] = useState({
    channelName: '',
    niche: '',
    contentTypes: [] as string[],
    targetAudience: '',
    goals: [] as string[],
    competitors: [] as string[],
    focusAreas: [] as string[],
    painPoints: [] as string[],
    uniqueValue: '',
    uploadSchedule: ''
  });
  const { createConversation, addMessage, updateConversation } = useConversationStore();
  const { activeSkeletonId } = useWorkspace();
  const { toast } = useToast();
  
  const conversationId = `buzzy-onboarding-${userId || 'default'}`;
  
  const onboardingSteps = [
    'Channel Basics',
    'Target Audience',
    'Goals & Vision',
    'Competition & Inspiration',
    'Content Focus'
  ];
  
  // Save channel profile to database
  const saveChannelProfile = async (profileData: any) => {
    try {
      const response = await apiClient.post('/api/ai/channel-profile', profileData);
      if (response.data?.success) {
        toast({
          title: 'Profile Saved',
          description: 'Your channel profile has been saved successfully!'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save channel profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your channel profile. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  // Handle step completion and data extraction
  const handleStepComplete = async (step: number, extractedData: any) => {
    // Update channel data based on the step
    const updatedData = { ...channelData };
    
    switch (step) {
      case 0: // Channel Basics
        if (extractedData.channelName) updatedData.channelName = extractedData.channelName;
        if (extractedData.niche) updatedData.niche = extractedData.niche;
        if (extractedData.contentTypes) updatedData.contentTypes = extractedData.contentTypes;
        break;
      case 1: // Target Audience
        if (extractedData.targetAudience) updatedData.targetAudience = extractedData.targetAudience;
        if (extractedData.painPoints) updatedData.painPoints = extractedData.painPoints;
        break;
      case 2: // Goals & Vision
        if (extractedData.goals) updatedData.goals = extractedData.goals;
        if (extractedData.uploadSchedule) updatedData.uploadSchedule = extractedData.uploadSchedule;
        if (extractedData.uniqueValue) updatedData.uniqueValue = extractedData.uniqueValue;
        break;
      case 3: // Competition & Inspiration
        if (extractedData.competitors) updatedData.competitors = extractedData.competitors;
        break;
      case 4: // Content Focus
        if (extractedData.focusAreas) updatedData.focusAreas = extractedData.focusAreas;
        break;
    }
    
    setChannelData(updatedData);
    
    // Update conversation context
    updateConversation(conversationId, {
      context: {
        userId,
        isOnboarding: true,
        step: step + 1,
        channelData: updatedData
      }
    });
    
    if (step === 4) {
      // Final step - save profile and complete
      const saved = await saveChannelProfile(updatedData);
      if (saved) {
        onComplete();
      }
    } else {
      setCurrentStep(step + 1);
    }
  };
  
  useEffect(() => {
    if (open && currentStep === 0) {
      // Create onboarding conversation only once
      createConversation(conversationId, 'partner', {
        userId,
        isOnboarding: true,
        step: currentStep,
        channelData,
        onStepComplete: handleStepComplete
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
  }, [open]);
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-black text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl shadow-lg border-2 border-amber-300">
              🐝
            </div>
            <div>
              <h2 className="text-2xl font-bold">Meet Buzzy!</h2>
              <p className="text-sm opacity-90">Your AI Content Creation Partner</p>
            </div>
          </div>
          <div className="text-sm font-medium bg-amber-400 text-black px-3 py-1 rounded-full">
            Channel Basics Guide
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="px-6 py-3 border-b bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{onboardingSteps[currentStep]}</span>
            <span className="text-muted-foreground">Step {currentStep + 1} of {onboardingSteps.length}</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
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
              step: currentStep,
              currentStep: currentStep, // Keep both for compatibility
              channelData,
              onStepComplete: handleStepComplete
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