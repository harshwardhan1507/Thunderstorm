'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Search, Bell, Sun, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 h-16 bg-surface/85 backdrop-blur-md border border-border-subtle px-8 rounded-full flex items-center justify-between select-none w-[calc(100%-2rem)] max-w-7xl shadow-lg shadow-black/40 transition-all duration-200">
      {/* Left: Brand Logo & Name */}
      <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center">
          <Zap className="w-4 h-4 text-accent-violet fill-accent-violet animate-pulse group-hover:scale-110 transition-transform duration-250" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight uppercase">
          ThunderStorm
        </span>
      </Link>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-1 mx-auto">
        <Link
          href="/sorting"
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
        >
          Algorithms
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </Link>
        <Link
          href="/sorting"
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
        >
          Explore
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </Link>
        <Link
          href="/compare"
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
        >
          Practice
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </Link>
        <Link
          href="#"
          className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
        >
          Pricing
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search Bar Action */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base border border-border-default hover:border-text-muted text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer text-xs">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans text-slate-500">Search..</span>
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

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent-purple text-white border border-accent-violet flex items-center justify-center font-bold text-xs cursor-pointer shadow-md select-none">
          H
        </div>
      </div>
    </nav>
  );
};
