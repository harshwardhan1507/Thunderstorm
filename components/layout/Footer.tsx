'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const algorithmLinks = [
    { label: 'Sorting', href: '/sorting' },
    { label: 'Graphs', href: '/graphs' },
    { label: 'Pathfinding', href: '/pathfinding' },
    { label: 'Trees', href: '/trees' },
    { label: 'Dynamic Programming', href: '/dp' },
    { label: 'Greedy', href: '/greedy' },
  ];

  const resourceLinks = [
    { label: 'Documentation', href: '#' },
    { label: 'Tutorials', href: '#' },
    { label: 'Compare Mode', href: '/compare' },
    { label: 'Battle Mode', href: '/compare?mode=battle' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ];

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/harshwardhan1507/Thunderstorm' },
    { label: 'X (Twitter)', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ];

  return (
    <footer
      className="w-full border-t mt-20 select-none transition-colors duration-300"
      style={{
        backgroundColor: colors.bg.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top: Logo + Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-7 h-7 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)',
                borderColor: colors.border.primary,
              }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: colors.accent }} />
            </div>
              <span className="font-bold text-sm tracking-tight uppercase" style={{ color: colors.text.primary }}>
                ThunderStorm
              </span>
            </Link>
            <p className="text-xs leading-relaxed mt-1" style={{ color: colors.text.secondary }}>
              Learn algorithms through interactive, step-by-step visualization.
            </p>
            <p className="text-[10px] mt-4" style={{ color: colors.text.secondary }}>
              © {new Date().getFullYear()} ThunderStorm.
              <br />All Rights Reserved.
            </p>
          </div>

          {/* Algorithms */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wider mb-1">Algorithms</span>
            {algorithmLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors duration-150">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wider mb-1">Resources</span>
            {resourceLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors duration-150">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wider mb-1">Legal</span>
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors duration-150">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#f0f0f0] uppercase tracking-wider mb-1">Socials</span>
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors duration-150">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
