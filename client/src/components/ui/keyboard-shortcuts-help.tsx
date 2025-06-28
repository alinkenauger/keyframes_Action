import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcutsByCategory: Record<string, KeyboardShortcut[]>;
}

export function KeyboardShortcutsHelp({
  open,
  onOpenChange,
  shortcutsByCategory,
}: KeyboardShortcutsHelpProps) {
  // Format key combination for display
  const formatKey = (key: string) => {
    return key
      .split('+')
      .map((k) => {
        if (k === 'ctrl') return 'Ctrl';
        if (k === 'alt') return 'Alt';
        if (k === 'shift') return 'Shift';
        if (k === ' ') return 'Space';
        if (k === 'arrowup') return '↑';
        if (k === 'arrowdown') return '↓';
        if (k === 'arrowleft') return '←';
        if (k === 'arrowright') return '→';
        if (k === 'enter') return 'Enter';
        if (k === 'escape') return 'Esc';
        return k.charAt(0).toUpperCase() + k.slice(1);
      })
      .join(' + ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Keyboard className="h-5 w-5 mr-2" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> anytime to show this help
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(80vh-120px)] pr-4">
          <div className="space-y-6">
            {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-2">{category}</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y">
                      {shortcuts.map((shortcut, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="px-4 py-2 w-1/3">
                            <div className="flex flex-wrap gap-1">
                              {formatKey(shortcut.key).split(' + ').map((key, i) => (
                                <kbd 
                                  key={i} 
                                  className="px-2 py-1 bg-muted rounded text-xs inline-block min-w-[24px] text-center"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm">{shortcut.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
