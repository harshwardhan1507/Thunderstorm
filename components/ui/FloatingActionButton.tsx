'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

export interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  mainIcon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
  mainIcon,
  position = 'bottom-right',
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }[position];

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 group animate-fade-in-up"
              style={{
                backgroundColor: action.color || colors.bg.tertiary,
                color: action.color ? 'white' : colors.text.primary,
                animationDelay: `${index * 0.05}s`,
              }}
              title={action.label}
            >
              <span className="text-sm font-medium">{action.label}</span>
              {action.icon}
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center text-white font-bold text-xl"
        style={{
          backgroundColor: colors.accent,
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        {mainIcon || (isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />)}
      </button>
    </div>
  );
};
