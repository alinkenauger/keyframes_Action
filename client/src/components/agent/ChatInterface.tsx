import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import AgentTypingIndicator from './AgentTypingIndicator';
import { useConversationStore } from '@/lib/conversation-store';
import type { Message, AgentType } from '@/types/agent';

interface ChatInterfaceProps {
  conversationId: string;
  agentType: AgentType;
  context?: any;
  onClose?: () => void;
  className?: string;
}

// Check if step has required data
const checkStepCompletion = (step: number, data: any): boolean => {
  if (!data) return false;
  
  switch (step) {
    case 0: // Channel Basics
      return !!(data.channelName && data.niche);
    case 1: // Target Audience
      return !!(data.targetAudience);
    case 2: // Goals & Vision
      return !!(data.goals && data.goals.length > 0);
    case 3: // Competition & Inspiration
      return true; // This step is optional
    case 4: // Content Focus
      return !!(data.focusAreas && data.focusAreas.length > 0);
    default:
      return false;
  }
};

export default function ChatInterface({
  conversationId,
  agentType,
  context,
  onClose,
  className
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  
  const {
    messages,
    addMessage,
    getConversation,
    createConversation,
    sendMessage
  } = useConversationStore();

  // Get or create conversation
  useEffect(() => {
    const conversation = getConversation(conversationId);
    if (!conversation) {
      createConversation(conversationId, agentType, context);
    }
  }, [conversationId, agentType, context]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages[conversationId]]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage(conversationId, {
      role: 'user',
      content,
      timestamp: new Date()
    });

    // Show typing indicator
    setIsAgentTyping(true);

    try {
      // Send message to backend and get agent response
      const response = await sendMessage(conversationId, content);
      console.log('ChatInterface received response:', response);
      
      // Add agent response
      addMessage(conversationId, {
        role: 'agent',
        content: response.content || 'No response content',
        metadata: response.metadata,
        timestamp: new Date()
      });
      
      // Data extraction is now handled by the parent component monitoring messages
    } catch (error: any) {
      console.error('Error in ChatInterface:', error);
      
      // More user-friendly error messages
      let errorMessage = 'I\'m having trouble responding right now. Please try again.';
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Connection issue. Please check your internet and try again.';
      } else if (error.message?.includes('authentication') || error.message?.includes('401')) {
        errorMessage = 'Session expired. Please refresh the page and log in again.';
      }
      
      addMessage(conversationId, {
        role: 'system',
        content: errorMessage,
        timestamp: new Date()
      });
    } finally {
      setIsAgentTyping(false);
    }
  };

  const conversationMessages = messages[conversationId] || [];
  const agentName = getAgentName(agentType);

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm">{getAgentEmoji(agentType)}</span>
          </div>
          <div>
            <h3 className="font-semibold">{agentName}</h3>
            <p className="text-xs text-muted-foreground">
              {getAgentDescription(agentType)}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {conversationMessages.length === 0 && (
            <MessageBubble
              message={{
                id: 'welcome',
                role: 'agent',
                content: getWelcomeMessage(agentType, context),
                timestamp: new Date()
              }}
              agentType={agentType}
              agentName={agentName}
            />
          )}
          
          {conversationMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              agentType={agentType}
              agentName={agentName}
            />
          ))}
          
          {isAgentTyping && <AgentTypingIndicator agentName={agentName} />}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder={`Ask ${agentName} anything...`}
          disabled={isAgentTyping}
        />
      </div>
    </div>
  );
}

// Helper functions
function getAgentName(agentType: AgentType): string {
  const names: Record<AgentType, string> = {
    partner: 'Buzzy',
    hook: 'Hook Master',
    content: 'Content Expert',
    entertainment: 'Entertainment Specialist',
    howto: 'How-To Guide',
    cta: 'CTA Expert',
    custom: 'Custom Assistant'
  };
  return names[agentType] || 'AI Assistant';
}

function getAgentEmoji(agentType: AgentType): string {
  const emojis: Record<AgentType, string> = {
    partner: '🐝',
    hook: '🎣',
    content: '📝',
    entertainment: '🎬',
    howto: '📚',
    cta: '🎯',
    custom: '🤖'
  };
  return emojis[agentType] || '🤖';
}

function getAgentDescription(agentType: AgentType): string {
  const descriptions: Record<AgentType, string> = {
    partner: 'Your content creation partner',
    hook: 'Expert in attention-grabbing openings',
    content: 'Specialist in engaging content flow',
    entertainment: 'Master of entertainment value',
    howto: 'Instructional content expert',
    cta: 'Call-to-action optimization',
    custom: 'Customized for your needs'
  };
  return descriptions[agentType] || 'Here to help';
}

function getWelcomeMessage(agentType: AgentType, context?: any): string {
  if (agentType === 'partner') {
    return "🐝 Hey there! I'm Buzzy, your AI content creation partner! I'm here to help you create amazing videos that your audience will love. Let's start by getting to know YOU and your channel! What's your channel name? And what kind of content gets you excited to create? 🎬✨";
  }
  
  if (agentType === 'hook' && context?.unitType === 'Hook') {
    return "Let's craft an irresistible hook that stops scrollers in their tracks! Tell me, what's the main topic of your video and what makes it unique?";
  }
  
  return `Hello! I'm your ${getAgentName(agentType)}. I'm here to help you create compelling content. What would you like to work on?`;
}