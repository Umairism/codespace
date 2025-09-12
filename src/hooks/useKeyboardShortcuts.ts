import { useEffect } from 'react';

interface KeyboardShortcuts {
  onNewFile: () => void;
  onSave: () => void;
  onSaveAll: () => void;
  onFind: () => void;
  onReplace: () => void;
  onFindInFiles: () => void;
  onRun: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  onTogglePreview: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, shiftKey, key } = event;

      // Prevent default browser shortcuts when appropriate
      if (ctrlKey) {
        switch (key.toLowerCase()) {
          case 'n':
            if (!shiftKey) {
              event.preventDefault();
              shortcuts.onNewFile();
            }
            break;
          case 's':
            event.preventDefault();
            if (shiftKey) {
              shortcuts.onSaveAll();
            } else {
              shortcuts.onSave();
            }
            break;
          case 'f':
            event.preventDefault();
            if (shiftKey) {
              shortcuts.onFindInFiles();
            } else {
              shortcuts.onFind();
            }
            break;
          case 'h':
            event.preventDefault();
            shortcuts.onReplace();
            break;
          case 'r':
            event.preventDefault();
            shortcuts.onRun();
            break;
          case 'b':
            event.preventDefault();
            shortcuts.onToggleSidebar();
            break;
          case 'v':
            if (shiftKey) {
              event.preventDefault();
              shortcuts.onTogglePreview();
            }
            break;
        }
      }

      // Special cases
      if (key === 'F5') {
        event.preventDefault();
        shortcuts.onRun();
      }

      if (ctrlKey && key === '`') {
        event.preventDefault();
        shortcuts.onToggleTerminal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
