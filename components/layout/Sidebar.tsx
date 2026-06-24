'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart2,
  Share2,
  Navigation,
  GitBranch,
  Table2,
  Zap,
  Columns,
  Swords,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modeParam = searchParams ? searchParams.get('mode') : null;

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Sorting', href: '/sorting', icon: BarChart2 },
    { label: 'Graphs', href: '/graphs', icon: Share2 },
    { label: 'Pathfinding', href: '/pathfinding', icon: Navigation },
    { label: 'Trees', href: '/trees', icon: GitBranch },
    { label: 'Dynamic Programming', href: '/dp', icon: Table2 },
    { label: 'Greedy', href: '/greedy', icon: Zap },
  ];

  const compareItems: SidebarItem[] = [
    { label: 'Compare Mode', href: '/compare', icon: Columns },
    { label: 'Battle Mode', href: '/compare?mode=battle', icon: Swords },
  ];

  const renderItem = (item: SidebarItem) => {
    if (item.disabled) {
      return (
        <div
          key={item.label}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 cursor-not-allowed text-sm font-medium select-none"
          title="Coming soon (Phase 2-4)"
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </div>
          <span className="text-[10px] bg-slate-900 text-slate-600 px-1.5 py-0.5 rounded border border-border-subtle/50">
            soon
          </span>
        </div>
      );
    }

    const isCompare = item.href === '/compare';
    const isBattle = item.href.includes('mode=battle');
    const isActive = isCompare
      ? pathname === '/compare' && !modeParam
      : isBattle
        ? pathname === '/compare' && modeParam === 'battle'
        : pathname === item.href;

    return (
      <Link
        key={item.label}
        href={item.href}
        className={`relative flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium ${
          isActive
            ? 'text-text-primary pl-[10px] pr-3'
            : 'text-text-secondary hover:bg-elevated/40 hover:text-text-primary px-3'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="active-sidebar-indicator"
            className="absolute inset-0 bg-highlight rounded-lg border-l-2 border-accent-purple"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-3">
          <item.icon className="w-4 h-4 flex-shrink-0" />
          <span>{item.label}</span>
        </span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex fixed left-4 top-24 z-40 w-60 h-[calc(100vh-112px)] bg-surface/90 backdrop-blur-sm border border-border-subtle rounded-2xl flex-col justify-between p-4 overflow-y-auto shadow-lg shadow-black/20">
      {/* Navigation Groups */}
      <div className="flex flex-col gap-6">
        {/* Core Algorithms */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Algorithms
          </span>
          {menuItems.map(renderItem)}
        </div>

        <div className="h-px bg-border-subtle"></div>

        {/* Comparison Modes */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Analysis
          </span>
          {compareItems.map(renderItem)}
        </div>
      </div>

      {/* Sidebar Bottom Zone */}
      <div className="flex flex-col gap-4">
        <div className="h-px bg-border-subtle"></div>

        {/* Mode info & shortcuts */}
        <div className="flex items-center justify-between text-xs text-text-secondary font-medium px-3">
          <div className="flex items-center gap-2">
            <span>🌙</span>
            <span>Dark Mode</span>
          </div>
          <span className="text-[10px] bg-slate-900 border border-border-subtle text-slate-500 px-1.5 py-0.5 rounded font-mono">
            Ctrl+/
          </span>
        </div>

        {/* User Profile zone */}
        <div className="flex items-center justify-between bg-elevated/40 border border-border-subtle/50 rounded-xl p-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-text-primary truncate flex items-center gap-1.5">
              <span className="text-accent-violet">⚡</span> haruto@mail.com
            </span>
            <span className="text-[10px] text-text-secondary mt-0.5">Free Plan</span>
          </div>
          <button className="bg-accent-purple hover:bg-accent-violet text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer shadow-md">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
};
