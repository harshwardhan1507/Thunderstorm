'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Ctrl', 'K'], description: 'Open command palette', category: 'Navigation' },
  { keys: ['Ctrl', '/'], description: 'Toggle sidebar', category: 'Navigation' },
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Navigation' },
  { keys: ['Space'], description: 'Play/Pause visualization', category: 'Visualization' },
  { keys: ['→'], description: 'Next step', category: 'Visualization' },
  { keys: ['←'], description: 'Previous step', category: 'Visualization' },
  { keys: ['Home'], description: 'Go to start', category: 'Visualization' },
  { keys: ['End'], description: 'Go to end', category: 'Visualization' },
  { keys: ['Ctrl', 'S'], description: 'Save visualization', category: 'File' },
  { keys: ['Ctrl', 'E'], description: 'Export as image', category: 'File' },
  { keys: ['Ctrl', 'L'], description: 'Toggle light mode', category: 'Theme' },
];

interface KeyboardShortcutsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsGuide: React.FC<KeyboardShortcutsGuideProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?') {
        // Toggle shortcuts guide
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));
  const filteredShortcuts = selectedCategory
    ? shortcuts.filter(s => s.category === selectedCategory)
    : shortcuts;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col animate-fade-in-up"
        style={{
          backgroundColor: colors.bg.primary,
          borderColor: colors.border.primary,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            backgroundColor: colors.bg.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
            style={{ color: colors.text.secondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Category Sidebar */}
          <div
            className="w-40 border-r p-4 overflow-y-auto"
            style={{
              backgroundColor: colors.bg.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-all duration-200 text-sm font-medium ${
                selectedCategory === null ? 'font-bold' : ''
              }`}
              style={{
                backgroundColor: selectedCategory === null ? colors.accent : 'transparent',
                color: selectedCategory === null ? 'white' : colors.text.secondary,
              }}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-all duration-200 text-sm font-medium ${
                  selectedCategory === category ? 'font-bold' : ''
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? colors.accent : 'transparent',
                  color: selectedCategory === category ? 'white' : colors.text.secondary,
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Shortcuts List */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {filteredShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                  }}
                >
                  <p style={{ color: colors.text.primary }} className="text-sm font-medium">
                    {shortcut.description}
                  </p>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={i}>
                        <kbd
                          className="px-2 py-1 rounded border font-mono text-xs font-semibold"
                          style={{
                            backgroundColor: colors.bg.primary,
                            borderColor: colors.border.primary,
                            color: colors.accent,
                          }}
                        >
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span style={{ color: colors.text.tertiary }} className="mx-1">
                            +
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t text-center text-xs"
          style={{
            backgroundColor: colors.bg.secondary,
            borderColor: colors.border.primary,
            color: colors.text.tertiary,
          }}
        >
          Press <kbd className="px-1 rounded border" style={{ borderColor: colors.border.primary }}>ESC</kbd> to close
        </div>
      </div>
    </div>
  );
};
