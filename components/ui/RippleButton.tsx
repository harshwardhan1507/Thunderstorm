'use client';

import React, { useState, useRef } from 'react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleIdRef.current++;

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    onClick?.();
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  }[size];

  const variantStyles = {
    primary: {
      backgroundColor: colors.accent,
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      backgroundColor: colors.bg.tertiary,
      color: colors.text.primary,
      border: `1px solid ${colors.border.primary}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.accent,
      border: `2px solid ${colors.accent}`,
    },
  }[variant];

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-lg font-semibold transition-all duration-300 ${sizeClasses} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'
      }`}
      style={variantStyles}
    >
      {/* Ripple Effect */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out',
          }}
        />
      ))}

      {/* Button Content */}
      <span className="relative z-10">{children}</span>

      {/* Ripple Animation Keyframes */}
      <style>{`
        @keyframes ripple {
          0% {
            width: 20px;
            height: 20px;
            opacity: 1;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};
