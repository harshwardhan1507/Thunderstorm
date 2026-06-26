'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../lib/context/ThemeContext';

export const AmbientStorm: React.FC = () => {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const isLanding = pathname === '/';

  // Return simple background - no animations, no requestAnimationFrame loops
  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }}
    />
  );
};
