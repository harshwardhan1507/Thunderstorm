'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className="flex flex-col pt-24 min-h-[calc(100vh-96px)] w-full">
      <div className="flex flex-1 w-full">
        {!isLanding && (
          <React.Suspense fallback={<div className="hidden md:flex w-60 bg-surface/90 border border-border-subtle rounded-2xl"></div>}>
            <Sidebar />
          </React.Suspense>
        )}
        <main className={`flex-1 flex flex-col w-full min-w-0 transition-all duration-200 ${isLanding ? '' : 'md:pl-[280px]'}`}>
          {children}
        </main>
      </div>
      {isLanding && <Footer />}
    </div>
  );
};
