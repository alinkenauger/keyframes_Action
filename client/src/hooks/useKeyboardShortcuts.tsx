import { useState, useEffect } from 'react';

// Interface for defining keyboard shortcuts
export interface KeyboardShortcut {
  key: string;          // Key combination (e.g., "n", "shift+n", "ctrl+s")
  action: () => void;   // Callback function to execute
  description: string;  // Description for the help dialog
  category?: string;    // Optional category for grouping in help dialog
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const [helpVisible, setHelpVisible] = useState(false);

  // Convert key combinations to a standardized format
  const normalizeKey = (key: string) => {
    const parts = key.toLowerCase().split('+');
    return parts.sort().join('+');
  };

  // Map shortcuts to their normalized key combinations
  const getShortcutMap = () => {
    return shortcuts.reduce((acc, shortcut) => {
      const normalizedKey = normalizeKey(shortcut.key);
      acc[normalizedKey] = shortcut.action;
      return acc;
    }, {} as Record<string, () => void>);
  };

  useEffect(() => {
    const shortcutMap = getShortcutMap();

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when the user is typing in an input field
      if (
        event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        // Fix for isContentEditable TypeScript error
        (event.target instanceof Element && 'isContentEditable' in event.target && (event.target as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Toggle help dialog with "?" key
      if (event.key === '?' && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setHelpVisible(!helpVisible);
        return;
      }

      // Build the key combination string
      let keyCombo = '';
      if (event.ctrlKey) keyCombo += 'ctrl+';
      if (event.altKey) keyCombo += 'alt+';
      if (event.shiftKey) keyCombo += 'shift+';
      keyCombo += event.key.toLowerCase();

      const normalizedKey = normalizeKey(keyCombo);
      const action = shortcutMap[normalizedKey];

      if (action) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, helpVisible]);

  // Group shortcuts by category for the help dialog
  const shortcutsByCategory = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return {
    helpVisible,
    setHelpVisible,
    shortcutsByCategory
  };
};