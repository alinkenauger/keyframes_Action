import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Message } from '@/types/agent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export default function MessageBubble({ message, className }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';
  const isSystem = message.role === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render action cards for special agent messages
  if (isAgent && message.metadata?.actionType) {
    return (
      <div className={cn("flex justify-start", className)}>
        <Card className="max-w-md p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary mb-2">
                {getActionTitle(message.metadata.actionType)}
              </p>
              <p className="text-sm">{message.content}</p>
              {message.metadata.suggestions && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.metadata.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUser && "bg-primary text-primary-foreground",
          isAgent && "bg-muted",
          isSystem && "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200"
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium">
              {isAgent ? '🤖 Agent' : '⚠️ System'}
            </span>
          </div>
        )}
        
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-xs opacity-70">
            {format(message.timestamp, 'HH:mm')}
          </span>
          
          {isAgent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function getActionTitle(actionType: string): string {
  const titles: Record<string, string> = {
    frameUpdate: 'Frame Updated',
    suggestion: 'Suggestion',
    contentGenerated: 'Content Generated',
    promptCreated: 'Prompt Created',
    analysis: 'Analysis Complete'
  };
  return titles[actionType] || 'Action';
}