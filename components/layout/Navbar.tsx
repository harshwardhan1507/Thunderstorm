'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Sorting', href: '/sorting' },
    { label: 'Graphs', href: '/graphs', disabled: true },
    { label: 'Pathfinding', href: '/pathfinding', disabled: true },
    { label: 'Trees', href: '/trees', disabled: true },
    { label: 'DP', href: '/dp', disabled: true },
    { label: 'Greedy', href: '/greedy', disabled: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/70 backdrop-blur-md border-b border-border-strong px-6 py-3.5 flex justify-between items-center shadow-lg">
      <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        {/* Lightning bolt logo */}
        <svg
          className="w-6 h-6 text-swap fill-current animate-pulse group-hover:scale-110 transition-transform duration-250"
          viewBox="0 0 24 24"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-lg font-black tracking-widest bg-gradient-to-r from-blue-400 via-violet-400 to-yellow-300 bg-clip-text text-transparent">
          THUNDERSTORM
        </span>
      </Link>

      <div className="flex items-center gap-1.5 md:gap-4 overflow-x-auto">
        {navItems.map((item) => {
          if (item.disabled) {
            return (
              <span
                key={item.label}
                className="px-3 py-1.5 text-xs md:text-sm font-bold text-slate-600 cursor-not-allowed select-none relative group"
                title="Coming Soon (Phase 2-4)"
              >
                {item.label}
                <span className="absolute -top-1 -right-1 text-[8px] bg-slate-800 text-slate-500 px-1 rounded border border-slate-700/50">
                  soon
                </span>
              </span>
            );
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-compare text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
