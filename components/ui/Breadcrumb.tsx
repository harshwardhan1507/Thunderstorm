'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Breadcrumb">
      {/* Home link */}
      <Link
        href="/"
        className="p-1 rounded hover:opacity-70 transition-opacity"
        style={{ color: colors.accent }}
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" style={{ color: colors.text.tertiary }} />
          {item.href ? (
            <Link
              href={item.href}
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: colors.accent }}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
