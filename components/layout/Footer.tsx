'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
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
    <footer className="w-full border-t border-border-subtle bg-surface mt-20 select-none">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top: Logo + Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-accent-violet fill-accent-violet" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight uppercase">
                ThunderStorm
              </span>
            </Link>
            <p className="text-text-muted text-xs leading-relaxed mt-1">
              Learn algorithms through interactive, step-by-step visualization.
            </p>
            <p className="text-text-muted text-[10px] mt-4">
              © {new Date().getFullYear()} ThunderStorm.
              <br />All Rights Reserved.
            </p>
          </div>

          {/* Algorithms */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Algorithms</span>
            {algorithmLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-150">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Resources</span>
            {resourceLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-150">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Legal</span>
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-150">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">Socials</span>
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-150">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
