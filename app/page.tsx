'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ChevronRight, Award, BookOpen, TrendingUp, Users, Layers, Code2, Globe } from 'lucide-react';
import { useTheme } from '../lib/context/ThemeContext';
import { themeColors } from '../lib/theme/colors';

export default function LandingPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden flex flex-col items-center pt-24 pb-16 px-4">
        {/* Background gradient */}
        <div className="pointer-events-none absolute top-[40%] left-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.18)_0%,transparent_70%)] animate-pulse" />
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
          style={{
            backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)',
            borderColor: colors.border.primary,
            color: colors.accent,
          }}
        >
          <span className="text-sm font-medium">India's #1 Algorithm Visualizer</span>
        </div>

        {/* Heading */}
        <h1
          className="text-center font-bold leading-tight mb-4 px-4"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            color: colors.text.primary,
          }}
        >
          Visualize Algorithms
          <br />
          <span style={{
            background: 'linear-gradient(to right, #7c3aed, #a78bfa, #3B82F6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Like Never Before
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-center max-w-xl mx-auto mb-8 leading-relaxed px-4"
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            color: colors.text.secondary,
          }}
        >
          ThunderStorm gives you a fully interactive path to mastering DSA — sorting, graphs, pathfinding, trees, dynamic programming and more, all in one system.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 px-4">
          <Link
            href="/sorting"
            className="flex items-center gap-2 text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: colors.accent,
            }}
          >
            <Play className="w-4 h-4" /> Launch Visualizer
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 border"
            style={{
              color: colors.text.primary,
              backgroundColor: isDark ? '#141414' : '#f8f9fa',
              borderColor: colors.border.primary,
            }}
          >
            Compare Algorithms <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* STATS SECTION */}
      <section
        className="w-full py-16 border-y"
        style={{
          backgroundColor: colors.bg.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Learners', value: '50K+', icon: Users },
              { label: 'Algorithm Categories', value: '12+', icon: Layers },
              { label: 'Algorithms Covered', value: '48+', icon: Code2 },
              { label: 'Languages Supported', value: '4+', icon: Globe },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-2xl border flex items-center justify-center"
                    style={{
                      backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)',
                      borderColor: colors.border.primary,
                      color: colors.accent,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                    {stat.value}
                  </div>
                  <div style={{ color: colors.text.secondary }} className="text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-3"
              style={{ color: colors.text.primary }}
            >
              Features That Power Your Learning
            </h2>
            <p
              className="max-w-xl mx-auto text-sm leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              Everything you need in one place — from step-by-step animations to AI-powered code analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Step-by-Step Visualizer',
                description: 'Watch every comparison, swap, and traversal happen in real time',
                icon: Play,
              },
              {
                title: 'Multi-Language Code',
                description: 'See algorithms in JavaScript, Python, Java, and C++',
                icon: Code2,
              },
              {
                title: 'Performance Metrics',
                description: 'Track time complexity, space complexity, and comparisons',
                icon: TrendingUp,
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border transition-all duration-300"
                  style={{
                    backgroundColor: colors.bg.secondary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)',
                      color: colors.accent,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Ready to Master Algorithms?
          </h2>
          <p
            className="text-lg mb-8"
            style={{ color: colors.text.secondary }}
          >
            Start your journey today and join thousands of learners who've cracked their dream companies.
          </p>
          <Link
            href="/sorting"
            className="inline-flex items-center gap-2 text-white rounded-full px-8 py-3 text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: colors.accent,
            }}
          >
            <Play className="w-5 h-5" /> Start Visualizing Now
          </Link>
        </div>
      </section>
    </div>
  );
}
