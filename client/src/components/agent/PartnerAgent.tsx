import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { useConversationStore } from '@/lib/conversation-store';
import { cn } from '@/lib/utils';
// Using CSS transitions instead of framer-motion for now

interface PartnerAgentProps {
  userId?: string;
  className?: string;
}

export default function PartnerAgent({ userId, className }: PartnerAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const { getConversation, createConversation } = useConversationStore();
  
  const conversationId = `partner-${userId || 'default'}`;
  
  useEffect(() => {
    // Check if user has interacted before
    const conversation = getConversation(conversationId);
    if (conversation) {
      setHasInteracted(true);
    }
  }, [conversationId, getConversation]);
  
  // Show welcome prompt for new users
  useEffect(() => {
    if (!hasInteracted && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // Show after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, isOpen]);
  
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    
    // Create conversation if it doesn't exist
    if (!getConversation(conversationId)) {
      createConversation(conversationId, 'partner', {
        userId,
        isFirstTime: !hasInteracted
      });
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setHasInteracted(true);
  };
  
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 transition-all duration-300",
            className
          )}
        >
          <Button
            onClick={handleOpen}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {!hasInteracted && (
            <div
              className="absolute bottom-full right-0 mb-2 w-72 transition-all duration-300 animate-bounce"
            >
              <Card className="p-4 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🐝</span>
                  <div>
                    <p className="text-sm font-bold text-yellow-900 dark:text-yellow-200">Hi! I'm Buzzy!</p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
                      Your AI content partner. Let me help you create amazing videos! Click to get started.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-[400px] shadow-2xl rounded-lg overflow-hidden",
            isMinimized ? "h-14" : "h-[600px]",
            "transition-all duration-300",
            className
          )}
        >
          <Card className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-lg">🐝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Buzzy</h3>
                  <p className="text-xs opacity-90">Your AI content creation partner</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={handleMinimize}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat Interface */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden">
                <ChatInterface
                  conversationId={conversationId}
                  agentType="partner"
                  context={{
                    userId,
                    isFirstTime: !hasInteracted
                  }}
                  className="h-full"
                />
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}