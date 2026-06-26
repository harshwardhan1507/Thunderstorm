'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useTheme } from '../../lib/context/ThemeContext';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8f9fa]'}`}>
      {!isLanding && <Navbar />}
      
      {/* Sidebar (hidden on landing page) */}
      {!isLanding && (
        <React.Suspense fallback={null}>
          <Sidebar />
        </React.Suspense>
      )}

      {/* Main content — offset by navbar (pt-16) and sidebar (md:pl-60) */}
      <main
        className={`flex flex-col min-h-screen ${
          isLanding ? '' : 'pt-16 md:pl-60'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
