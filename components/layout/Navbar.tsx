'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Search, Bell, Sun, ChevronDown } from 'lucide-react';
import { CommandPalette } from './CommandPalette';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Algorithms', href: '/sorting', hasDropdown: true },
    { label: 'Explore', href: '/graphs', hasDropdown: true },
    { label: 'Practice', href: '/compare', hasDropdown: true },
    { label: 'AI Visualizer', href: '/code-visualizer', hasDropdown: false },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#141414] border-b border-[#2a2a2a] flex items-center px-6 select-none">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0 mr-8">
          <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/30 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#8b5cf6] fill-[#8b5cf6] group-hover:scale-110 transition-transform duration-200" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">ThunderStorm</span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#f0f0f0] bg-[#1c1c1c]'
                    : 'text-[#888888] hover:text-[#f0f0f0] hover:bg-[#1c1c1c]'
                }`}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#333333] text-[#888888] hover:text-[#f0f0f0] transition-all duration-150 cursor-pointer text-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[#555555]">Search..</span>
            <span className="hidden md:inline bg-[#1c1c1c] border border-[#2a2a2a] text-[#555555] px-1 py-0.5 rounded text-[9px] font-mono leading-none">
              Ctrl+K
            </span>
          </button>

          <button className="relative p-2 text-[#888888] hover:text-[#f0f0f0] hover:bg-[#1c1c1c] rounded-lg transition-all duration-150 cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
          </button>

          <button className="p-2 text-[#888888] hover:text-[#f0f0f0] hover:bg-[#1c1c1c] rounded-lg transition-all duration-150 cursor-pointer">
            <Sun className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-md select-none border border-[#8b5cf6]/40">
            H
          </div>
        </div>
      </nav>

      <CommandPalette />
    </>
  );
};
