'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Sidebar (hidden on landing page) */}
      {!isLanding && (
        <React.Suspense fallback={null}>
          <Sidebar />
        </React.Suspense>
      )}

      {/* Main content — offset by navbar (pt-16) and sidebar (md:pl-60) */}
      <main
        className={`flex flex-col min-h-screen pt-16 ${
          isLanding ? '' : 'md:pl-60'
        }`}
      >
        {children}
        {isLanding && <Footer />}
      </main>
    </div>
  );
};
