'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Search, Bell, Sun, ChevronDown } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  return (
    <>
      <motion.nav
        initial={{ y: -20, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-4 left-1/2 z-50 h-16 bg-surface-card/90 backdrop-blur-md border border-border-subtle px-8 rounded-full flex items-center justify-between select-none w-[calc(100%-2rem)] max-w-7xl shadow-lg shadow-black/40 transition-all duration-200"
      >
        {/* Left: Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent-primary fill-accent-primary group-hover:scale-110 transition-transform duration-200" />
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
        {/* Search Bar Action - Triggers Command Palette */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base border border-border-subtle hover:border-border-hover text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans text-text-muted">Search..</span>
          <span className="hidden md:inline bg-surface-elevated border border-border-subtle text-text-muted px-1 py-0.5 rounded text-[9px] font-mono leading-none">
            Ctrl+K
          </span>
        </button>

          {/* Notifications Bell */}
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-all duration-200 cursor-pointer relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-primary"></span>
          </button>

          {/* Theme Toggle */}
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-all duration-200 cursor-pointer">
            <Sun className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-accent-primary text-white border border-accent-primary flex items-center justify-center font-bold text-xs cursor-pointer shadow-md select-none">
            H
          </div>
        </div>
      </motion.nav>
      <CommandPalette />
    </>
  );
};
