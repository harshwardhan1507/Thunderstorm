'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className="flex pt-16 min-h-[calc(100vh-64px)] w-full">
      {!isLanding && <Sidebar />}
      <main className={`flex-1 flex flex-col w-full min-w-0 transition-all duration-200 ${isLanding ? '' : 'md:pl-60'}`}>
        {children}
      </main>
    </div>
  );
};
