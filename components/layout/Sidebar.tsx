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
  Code2,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  available?: boolean;
}

const coreItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, available: true },
  { label: 'Sorting', href: '/sorting', icon: BarChart2, available: true },
  { label: 'Graphs', href: '/graphs', icon: Share2, available: true },
  { label: 'Pathfinding', href: '/pathfinding', icon: Navigation, available: true },
  { label: 'Trees', href: '/trees', icon: GitBranch, available: true },
  { label: 'Dynamic Programming', href: '/dp', icon: Table2, available: true },
  { label: 'Greedy', href: '/greedy', icon: Zap, available: true },
];

const analysisItems: NavItem[] = [
  { label: 'Compare Mode', href: '/compare', icon: Columns, available: true },
  { label: 'Battle Mode', href: '/compare?mode=battle', icon: Swords, available: true },
  { label: 'AI Code Visualizer', href: '/code-visualizer', icon: Code2, available: true },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');

  const isActive = (item: NavItem): boolean => {
    if (item.href === '/') return pathname === '/';
    if (item.href === '/compare?mode=battle') return pathname === '/compare' && modeParam === 'battle';
    if (item.href === '/compare') return pathname === '/compare' && !modeParam;
    return pathname === item.href;
  };

  const renderItem = (item: NavItem) => {
    const active = isActive(item);
    return (
      <Link
        key={item.label}
        href={item.href}
        className={`relative flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
          active
            ? 'text-[#f0f0f0] pl-[10px] pr-3'
            : 'text-[#888888] hover:text-[#f0f0f0] hover:bg-[#1c1c1c] px-3'
        }`}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 bg-[#232323] rounded-lg border-l-2 border-[#7c3aed]"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
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
    <aside className="hidden md:flex fixed left-0 top-16 z-40 w-60 h-[calc(100vh-64px)] bg-[#141414] border-r border-[#2a2a2a] flex-col justify-between p-4 overflow-y-auto">
      {/* Navigation Groups */}
      <div className="flex flex-col gap-6">
        {/* Core Algorithms */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
            Algorithms
          </span>
          {coreItems.map(renderItem)}
        </div>

        <div className="h-px bg-[#2a2a2a]" />

        {/* Analysis */}
        <div className="flex flex-col gap-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-1">
            Analysis
          </span>
          {analysisItems.map(renderItem)}
        </div>
      </div>

      {/* Bottom Zone */}
      <div className="flex flex-col gap-3 mt-6">
        <div className="h-px bg-[#2a2a2a]" />

        {/* Dark mode hint */}
        <div className="flex items-center justify-between text-xs text-[#888888] font-medium px-3">
          <div className="flex items-center gap-2">
            <span>🌙</span>
            <span>Dark Mode</span>
          </div>
          <span className="text-[10px] bg-[#1c1c1c] border border-[#2a2a2a] text-[#555555] px-1.5 py-0.5 rounded font-mono">
            Ctrl+/
          </span>
        </div>

        {/* User zone */}
        <div className="flex items-center justify-between bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#f0f0f0] truncate flex items-center gap-1.5">
              <span className="text-[#8b5cf6]">⚡</span>
              haruto@mail.com
            </span>
            <span className="text-[10px] text-[#888888] mt-0.5">Free Plan</span>
          </div>
          <button className="bg-[#7c3aed] hover:bg-[#8b5cf6] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer shadow-md whitespace-nowrap">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
};
