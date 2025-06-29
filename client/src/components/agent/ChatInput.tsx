import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showAttachment?: boolean;
  showVoice?: boolean;
}

export default function ChatInput({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
  className,
  showAttachment = false,
  showVoice = false
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className={cn("flex items-end gap-2", className)}>
      {showAttachment && (
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="mb-1"
          title="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      )}

      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[40px] max-h-[120px] pr-12 resize-none"
          rows={1}
        />
        
        {showVoice && !message.trim() && (
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="absolute right-1 bottom-1 h-8 w-8"
            title="Voice input"
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        size="icon"
        className="mb-1"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}