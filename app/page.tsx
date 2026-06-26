'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Play, ChevronRight, Award, BookOpen, TrendingUp, Users, Zap, Code2, Globe, ArrowRight, Star, CheckCircle, Github, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from '../lib/context/ThemeContext';
import { themeColors } from '../lib/theme/colors';

export default function LandingPage() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('features');

  const algorithms = useMemo(() => [
    { name: 'Sorting', icon: '📊', count: '8+', href: '/sorting' },
    { name: 'Graphs', icon: '🔗', count: '12+', href: '/graphs' },
    { name: 'Pathfinding', icon: '🗺️', count: '6+', href: '/pathfinding' },
    { name: 'Trees', icon: '🌳', count: '10+', href: '/trees' },
    { name: 'Dynamic Programming', icon: '🎯', count: '15+', href: '/dp' },
    { name: 'Greedy', icon: '⚡', count: '8+', href: '/greedy' },
  ], []);

  const features = useMemo(() => [
    {
      title: 'Step-by-Step Visualization',
      description: 'Watch every operation unfold in real-time with smooth animations',
      icon: Play,
      color: '#7c3aed',
    },
    {
      title: 'Multi-Language Code',
      description: 'See implementations in JavaScript, Python, Java, and C++',
      icon: Code2,
      color: '#3b82f6',
    },
    {
      title: 'Performance Metrics',
      description: 'Track time complexity, space complexity, and operation counts',
      icon: TrendingUp,
      color: '#10b981',
    },
    {
      title: 'Compare Mode',
      description: 'Run two algorithms side-by-side and compare their performance',
      icon: Zap,
      color: '#f59e0b',
    },
    {
      title: 'AI Code Analysis',
      description: 'Get AI-powered insights about your algorithm implementations',
      icon: Globe,
      color: '#ec4899',
    },
    {
      title: 'Interactive Controls',
      description: 'Pause, resume, step forward/backward through execution',
      icon: Award,
      color: '#8b5cf6',
    },
  ], []);

  const testimonials = useMemo(() => [
    {
      name: 'Arjun Singh',
      role: 'SDE at Google',
      company: 'Google',
      text: 'ThunderStorm helped me visualize complex algorithms and crack my DSA interviews. Highly recommended!',
      avatar: '👨‍💻',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'Microsoft',
      text: 'The best algorithm visualizer I\'ve used. The multi-language support is incredible.',
      avatar: '👩‍💻',
      rating: 5,
    },
    {
      name: 'Rahul Patel',
      role: 'Developer',
      company: 'Amazon',
      text: 'Finally, a tool that makes DSA learning fun and interactive. Worth every minute!',
      avatar: '👨‍💼',
      rating: 5,
    },
  ], []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden flex flex-col items-center pt-20 pb-24 px-4">
        {/* Animated background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: colors.accent }} />
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: colors.accent }} />
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 animate-pulse"
          style={{
            backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.15)',
            borderColor: colors.border.primary,
            color: colors.accent,
          }}
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-semibold">India's #1 Algorithm Visualizer</span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-center font-bold leading-tight mb-6 px-4 max-w-4xl"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            color: colors.text.primary,
          }}
        >
          Master Data Structures & Algorithms
          <br />
          <span style={{
            background: `linear-gradient(to right, ${colors.accent}, #a78bfa, #3B82F6)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Through Interactive Visualization
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-center max-w-2xl mx-auto mb-10 leading-relaxed px-4"
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: colors.text.secondary,
          }}
        >
          ThunderStorm is your ultimate companion for mastering DSA. Visualize 48+ algorithms across 6 categories with step-by-step animations, multi-language code, and real-time performance metrics.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 px-4">
          <Link
            href="/sorting"
            className="flex items-center gap-2 text-white rounded-lg px-8 py-3.5 text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            style={{
              backgroundColor: colors.accent,
            }}
          >
            <Play className="w-5 h-5" /> Start Visualizing
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold transition-all duration-200 border hover:scale-105"
            style={{
              color: colors.text.primary,
              backgroundColor: isDark ? '#141414' : '#f8f9fa',
              borderColor: colors.border.primary,
            }}
          >
            Compare Algorithms <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
          {[
            { label: 'Active Learners', value: '50K+' },
            { label: 'Algorithms', value: '48+' },
            { label: 'Categories', value: '6' },
            { label: 'Languages', value: '4+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold" style={{ color: colors.accent }}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm" style={{ color: colors.text.secondary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ALGORITHM CATEGORIES */}
      <section
        className="w-full py-20 px-4 border-y"
        style={{
          backgroundColor: colors.bg.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
              Explore 48+ Algorithms
            </h2>
            <p style={{ color: colors.text.secondary }}>
              Comprehensive coverage across all major DSA categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.map((algo) => (
              <Link
                key={algo.name}
                href={algo.href}
                className="p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-lg group cursor-pointer"
                style={{
                  backgroundColor: colors.bg.secondary,
                  borderColor: colors.border.primary,
                }}
              >
                <div className="text-4xl mb-3">{algo.icon}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                  {algo.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.text.secondary }} className="text-sm">
                    {algo.count} algorithms
                  </span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: colors.accent }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
              Powerful Features
            </h2>
            <p style={{ color: colors.text.secondary }}>
              Everything you need to master DSA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-105"
                  style={{
                    backgroundColor: colors.bg.secondary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${feature.color}20`,
                      color: feature.color,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text.primary }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: colors.text.secondary }} className="text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        className="w-full py-24 px-4 border-y"
        style={{
          backgroundColor: colors.bg.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
              Loved by Learners
            </h2>
            <p style={{ color: colors.text.secondary }}>
              Join thousands of students who've mastered DSA with ThunderStorm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 rounded-2xl border"
                style={{
                  backgroundColor: colors.bg.primary,
                  borderColor: colors.border.primary,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold" style={{ color: colors.text.primary }}>
                      {testimonial.name}
                    </h4>
                    <p style={{ color: colors.text.secondary }} className="text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" style={{ color: '#fbbf24' }} />
                  ))}
                </div>
                <p style={{ color: colors.text.secondary }} className="text-sm leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.text.primary }}>
            Ready to Master DSA?
          </h2>
          <p className="text-lg mb-10" style={{ color: colors.text.secondary }}>
            Start your journey today and join thousands of learners who've cracked their dream companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sorting"
              className="inline-flex items-center justify-center gap-2 text-white rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              style={{
                backgroundColor: colors.accent,
              }}
            >
              <Play className="w-5 h-5" /> Start Visualizing Now
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 border hover:scale-105"
              style={{
                color: colors.text.primary,
                backgroundColor: isDark ? '#141414' : '#f8f9fa',
                borderColor: colors.border.primary,
              }}
            >
              Explore Compare Mode <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="w-full border-t py-12 px-4"
        style={{
          backgroundColor: colors.bg.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.text.primary }}>
                ThunderStorm
              </h3>
              <p style={{ color: colors.text.secondary }} className="text-sm">
                Master Data Structures & Algorithms through interactive visualization.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: colors.text.primary }}>
                Algorithms
              </h4>
              <ul className="space-y-2">
                {algorithms.slice(0, 3).map((algo) => (
                  <li key={algo.name}>
                    <Link href={algo.href} style={{ color: colors.text.secondary }} className="text-sm hover:underline">
                      {algo.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: colors.text.primary }}>
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" style={{ color: colors.text.secondary }} className="text-sm hover:underline">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: colors.text.secondary }} className="text-sm hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: colors.text.secondary }} className="text-sm hover:underline">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: colors.text.primary }}>
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a href="#" style={{ color: colors.text.secondary }} className="hover:scale-110 transition">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" style={{ color: colors.text.secondary }} className="hover:scale-110 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" style={{ color: colors.text.secondary }} className="hover:scale-110 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div
            className="border-t pt-8"
            style={{ borderColor: colors.border.primary }}
          >
            <p style={{ color: colors.text.secondary }} className="text-sm text-center">
              © 2026 ThunderStorm. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
