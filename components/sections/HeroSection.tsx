'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

export const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden pt-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: isDark
              ? 'radial-gradient(circle, #7c3aed, transparent)'
              : 'radial-gradient(circle, #7c3aed, transparent)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: isDark
              ? 'radial-gradient(circle, #3b82f6, transparent)'
              : 'radial-gradient(circle, #3b82f6, transparent)',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 animate-fade-in-up"
          style={{
            backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)',
            borderColor: colors.border.primary,
            color: colors.accent,
          }}
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Introducing ThunderStorm</span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up"
          style={{
            color: colors.text.primary,
            animationDelay: '0.1s',
          }}
        >
          Visualize Algorithms
          <br />
          <span
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent"
          >
            Like Never Before
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up"
          style={{
            color: colors.text.secondary,
            animationDelay: '0.2s',
          }}
        >
          Master Data Structures and Algorithms with interactive, real-time visualizations. 
          Step through code, see the magic happen, and build your coding confidence.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            href="/sorting"
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            style={{ backgroundColor: colors.accent }}
          >
            Start Visualizing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 border hover:shadow-lg"
            style={{
              color: colors.accent,
              borderColor: colors.border.primary,
              backgroundColor: colors.bg.tertiary,
            }}
          >
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 pt-16 border-t" style={{ borderColor: colors.border.primary }}>
          {[
            { value: '50+', label: 'Algorithms' },
            { value: '1M+', label: 'Learners' },
            { value: '4.9★', label: 'Rating' },
          ].map((stat, i) => (
            <div
              key={i}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className="text-3xl font-bold" style={{ color: colors.accent }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: colors.text.secondary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
