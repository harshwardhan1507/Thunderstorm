'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Search, Bell, Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const colors = themeColors[theme];

  const navLinks = [
    { label: 'Algorithms', href: '/sorting', hasDropdown: true },
    { label: 'Explore', href: '/graphs', hasDropdown: true },
    { label: 'Practice', href: '/compare', hasDropdown: true },
    { label: 'AI Visualizer', href: '/code-visualizer', hasDropdown: false },
  ];

  const navStyle = {
    backgroundColor: colors.navbar,
    borderColor: colors.border.primary,
  };

  const linkStyle = (isActive: boolean) => ({
    color: isActive ? colors.accent : colors.text.secondary,
    backgroundColor: isActive ? (isDark ? '#1c1c1c' : '#f0f1f3') : 'transparent',
  });

  const buttonStyle = {
    color: colors.text.secondary,
    backgroundColor: isDark ? '#0a0a0a' : '#f8f9fa',
    borderColor: colors.border.primary,
  };

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b flex items-center px-4 md:px-6 select-none transition-colors duration-300"
        style={navStyle}
      >
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0 mr-4 md:mr-8">
          <div 
            className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors duration-300"
            style={{
              backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)',
              borderColor: isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.4)',
            }}
          >
            <Zap 
              className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform duration-200" 
              style={{ color: colors.accent }}
            />
          </div>
          <span 
            className="font-bold text-base tracking-tight transition-colors duration-300"
            style={{ color: colors.text.primary }}
          >
            ThunderStorm
          </span>
        </Link>

        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
                style={linkStyle(isActive)}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Search Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all duration-150 cursor-pointer"
            style={buttonStyle}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs">Search..</span>
            <span className="hidden md:inline border rounded text-[9px] font-mono leading-none px-1 py-0.5" style={{ borderColor: colors.border.primary }}>
              Ctrl+K
            </span>
          </button>

          {/* Notification Bell */}
          <button 
            className="relative p-2 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ color: colors.text.secondary }}
          >
            <Bell className="w-4 h-4" />
            <span 
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ color: colors.text.secondary }}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile */}
          <div 
            className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-md select-none border transition-all duration-300"
            style={{
              backgroundColor: colors.accent,
              borderColor: isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(124, 58, 237, 0.3)',
            }}
          >
            H
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ color: colors.text.secondary }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed top-16 left-0 right-0 md:hidden border-b transition-colors duration-300"
          style={{
            backgroundColor: colors.bg.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
                  style={linkStyle(isActive)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <CommandPalette />
    </>
  );
};
