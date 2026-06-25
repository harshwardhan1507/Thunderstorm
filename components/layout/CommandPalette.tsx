'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, BarChart2, Share2, Navigation, GitBranch, Table2, Settings, Sun, Moon, Play, Pause, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  category: 'navigation' | 'settings' | 'algorithms';
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'sorting',
      label: 'Sorting Visualizer',
      description: 'Visualize sorting algorithms step-by-step',
      icon: BarChart2,
      action: () => window.location.href = '/sorting',
      category: 'algorithms',
    },
    {
      id: 'graphs',
      label: 'Graph Algorithms',
      description: 'Explore BFS, DFS and graph traversals',
      icon: Share2,
      action: () => {},
      category: 'algorithms',
    },
    {
      id: 'pathfinding',
      label: 'Pathfinding',
      description: 'Dijkstra and A* visualizations',
      icon: Navigation,
      action: () => {},
      category: 'algorithms',
    },
    {
      id: 'trees',
      label: 'Tree Structures',
      description: 'Binary trees, AVL, and heap operations',
      icon: GitBranch,
      action: () => window.location.href = '/trees',
      category: 'algorithms',
    },
    {
      id: 'dp',
      label: 'Dynamic Programming',
      description: 'Tabular DP visualizations',
      icon: Table2,
      action: () => {},
      category: 'algorithms',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configure preferences',
      icon: Settings,
      action: () => {},
      category: 'settings',
    },
    {
      id: 'theme-light',
      label: 'Switch to Light Theme',
      icon: Sun,
      action: () => {},
      category: 'settings',
    },
    {
      id: 'theme-dark',
      label: 'Switch to Dark Theme',
      icon: Moon,
      action: () => {},
      category: 'settings',
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          filteredCommands[selectedIndex]?.action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-xl bg-[#141414]-card border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2a2a2a]">
              <Search className="w-5 h-5 text-[#555555]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search algorithms, settings..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent text-white placeholder-text-muted outline-none text-base"
              />
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 text-xs font-mono bg-[#141414]-elevated text-[#555555] rounded border border-[#2a2a2a]">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Command List */}
            <div className="max-h-[400px] overflow-y-auto py-2">
              {filteredCommands.length === 0 ? (
                <div className="px-5 py-8 text-center text-[#555555] text-sm">
                  No results found
                </div>
              ) : (
                filteredCommands.map((command, index) => {
                  const Icon = command.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={command.id}
                      onClick={() => {
                        command.action();
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-150 ${
                        isSelected ? 'bg-[#3B82F6]/10 border-l-2 border-accent-primary' : 'hover:bg-[#141414]-elevated border-l-2 border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#3B82F6]/20' : 'bg-[#141414]-elevated'}`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#3B82F6]' : 'text-[#555555]'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-[#888888]'}`}>
                          {command.label}
                        </div>
                        {command.description && (
                          <div className="text-xs text-[#555555] mt-0.5">
                            {command.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="text-xs text-[#555555] font-mono">
                          ↵
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-[#555555]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-[#141414]-elevated rounded border border-[#2a2a2a] font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-[#141414]-elevated rounded border border-[#2a2a2a] font-mono">↵</kbd>
                  Select
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-[#141414]-elevated rounded border border-[#2a2a2a] font-mono">esc</kbd>
                Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
