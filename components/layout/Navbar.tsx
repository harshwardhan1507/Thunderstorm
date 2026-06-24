'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Search, Bell, Sun } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface border-b border-border-subtle px-6 flex justify-between items-center select-none">
      {/* Left: Brand Logo & Name */}
      <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center">
          <Zap className="w-4 h-4 text-accent-violet fill-accent-violet animate-pulse group-hover:scale-110 transition-transform duration-250" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight uppercase">
          ThunderStorm
        </span>
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar Action */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base border border-border-default hover:border-text-muted text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer text-xs">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans text-slate-500">Search...</span>
          <span className="hidden md:inline bg-slate-900 border border-border-subtle text-slate-600 px-1 py-0.5 rounded text-[9px] font-mono leading-none">
            Ctrl+K
          </span>
        </button>

        {/* Notifications Bell */}
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-elevated rounded-lg transition-all duration-200 cursor-pointer relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-purple"></span>
        </button>

        {/* Theme Toggle */}
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-elevated rounded-lg transition-all duration-200 cursor-pointer">
          <Sun className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border-subtle"></div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent-purple text-white border border-accent-violet flex items-center justify-center font-bold text-xs cursor-pointer shadow-md select-none">
          H
        </div>
      </div>
    </nav>
  );
};

