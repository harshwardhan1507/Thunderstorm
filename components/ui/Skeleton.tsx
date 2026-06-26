'use client';

import React from 'react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  circle = false,
  count = 1,
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const skeletonStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundColor: colors.bg.tertiary,
    borderRadius: circle ? '50%' : '0.5rem',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${className} ${i > 0 ? 'mt-2' : ''}`}
          style={skeletonStyle}
        />
      ))}
    </>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div
      className={`p-4 rounded-lg border ${className}`}
      style={{
        backgroundColor: colors.bg.primary,
        borderColor: colors.border.primary,
      }}
    >
      <Skeleton width="60%" height="1.5rem" className="mb-4" />
      <Skeleton height="1rem" className="mb-2" />
      <Skeleton height="1rem" width="80%" />
    </div>
  );
};
