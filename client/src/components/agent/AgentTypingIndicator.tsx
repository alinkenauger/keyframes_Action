import React from 'react';
import { cn } from '@/lib/utils';

interface AgentTypingIndicatorProps {
  agentName?: string;
  className?: string;
}

export default function AgentTypingIndicator({ 
  agentName = 'Agent', 
  className 
}: AgentTypingIndicatorProps) {
  return (
    <div className={cn("flex justify-start", className)}>
      <div className="bg-muted rounded-lg p-3 max-w-[200px]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{agentName} is typing</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}