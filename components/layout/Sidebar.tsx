'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  const menuItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Sorting', href: '/sorting', icon: BarChart2 },
    { label: 'Graphs', href: '/graphs', icon: Share2, disabled: true },
    { label: 'Pathfinding', href: '/pathfinding', icon: Navigation, disabled: true },
    { label: 'Trees', href: '/trees', icon: GitBranch, disabled: true },
    { label: 'Dynamic Programming', href: '/dp', icon: Table2, disabled: true },
    { label: 'Greedy', href: '/greedy', icon: Zap, disabled: true },
  ];

  const compareItems: SidebarItem[] = [
    { label: 'Compare Mode', href: '/compare', icon: Columns, disabled: true },
    { label: 'Battle Mode', href: '/compare?mode=battle', icon: Swords, disabled: true },
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

    const isActive = pathname === item.href;

    return (
      <Link
        key={item.label}
        href={item.href}
        className={`flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium ${
          isActive
            ? 'bg-highlight text-text-primary border-l-2 border-accent-purple pl-[10px] pr-3'
            : 'text-text-secondary hover:bg-elevated hover:text-text-primary px-3'
        }`}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-16 z-40 w-60 h-[calc(100vh-64px)] bg-surface border-r border-border-subtle flex flex-col justify-between p-4 overflow-y-auto">
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
