'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  BarChart2,
  Share2,
  Navigation,
  GitBranch,
  Table2,
  ArrowRight,
  Play,
  Code2,
  Activity,
  Timer,
  BookOpen,
} from 'lucide-react';

const categories = [
  {
    title: 'Sorting',
    slug: 'sorting',
    icon: BarChart2,
    description: 'Bubble, Merge, Quick, Heap — step-by-step with GSAP bar animations.',
    available: true,
  },
  {
    title: 'Graphs',
    slug: 'graphs',
    icon: Share2,
    description: 'BFS and DFS traversals on interactive SVG graphs with node-pulse animations.',
    available: true,
  },
  {
    title: 'Pathfinding',
    slug: 'pathfinding',
    icon: Navigation,
    description: "Dijkstra's and A* on a clickable grid — draw walls, set start/end.",
    available: true,
  },
  {
    title: 'Trees',
    slug: 'trees',
    icon: GitBranch,
    description: 'BST, AVL rotations, and Heap operations with live tree re-balancing.',
    available: true,
  },
  {
    title: 'Dynamic Programming',
    slug: 'dp',
    icon: Table2,
    description: 'LCS, Knapsack, Fibonacci — animated DP table cell fills.',
    available: true,
  },
  {
    title: 'Greedy',
    slug: 'greedy',
    icon: Zap,
    description: 'Activity Selection and Huffman Coding with greedy decision highlights.',
    available: true,
  },
];

const features = [
  {
    icon: Play,
    title: 'Step-by-Step Playback',
    description: 'Play, pause, step forward/back, and scrub the timeline to any point in the execution.',
  },
  {
    icon: Code2,
    title: 'Multi-Language Code Panel',
    description: 'Synchronized Java, Python, C++, and JavaScript panels highlight the active line in real time.',
  },
  {
    icon: Activity,
    title: 'Live Performance Metrics',
    description: 'Real comparisons, swaps, nodes visited, and execution time — measured honestly.',
  },
  {
    icon: Timer,
    title: 'Algorithm Comparison',
    description: 'Run two algorithms side-by-side on identical data and see who wins in Battle Mode.',
  },
  {
    icon: BookOpen,
    title: 'Educational Panels',
    description: 'Intuition, complexity analysis, pros/cons, and real-world use cases for every algorithm.',
  },
  {
    icon: Share2,
    title: 'Shareable URLs',
    description: 'Deep-link any configuration — algorithm, size, speed, grid preset — for demos and classrooms.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Radial purple glow from below */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{
          height: '60vh',
          background:
            'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(124,58,237,0.22) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6 mb-20"
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#333] bg-[#1c1c1c] text-[#888] text-xs">
            <Zap className="w-3 h-3 text-[#8b5cf6]" />
            Algorithm Visualizer
          </div>

          {/* Headline */}
          <h1 className="flex flex-col gap-1">
            <span className="block text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Visualize Algorithms.
            </span>
            <span className="block text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">
              Master the Storm.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#888888] text-base sm:text-lg max-w-xl leading-relaxed">
            Step-by-step DSA visualization with synchronized code panels, live metrics, and a
            storm-themed UI designed for learners and builders.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/sorting"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#8b5cf6] hover:to-[#7c3aed] text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#7c3aed]/20"
            >
              Launch Visualizer
              <Zap className="w-4 h-4" />
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#333] text-white text-sm font-medium hover:bg-[#1c1c1c] transition-all duration-200"
            >
              Compare Algorithms
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
          className="w-full"
        >
          <h2 className="text-2xl font-bold text-white text-left mb-6 tracking-tight">
            Algorithm Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={`/${cat.slug}`}
                    className="flex flex-col justify-between h-full p-5 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#7c3aed]/40 hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer group"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center mb-4 group-hover:bg-[#7c3aed]/15 transition-colors">
                        <Icon className="w-4 h-4 text-[#8b5cf6]" />
                      </div>
                      <h3 className="text-white font-semibold text-base mb-1.5">{cat.title}</h3>
                      <p className="text-[#666] text-sm leading-relaxed">{cat.description}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 mt-5 text-xs text-[#7c3aed] font-semibold group-hover:text-[#8b5cf6] transition-colors">
                      Visualize <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Why ThunderStorm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full mt-24 text-left"
        >
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Why ThunderStorm?
          </h2>
          <p className="text-[#888888] text-sm leading-relaxed mb-8 max-w-2xl">
            Everything you need to understand algorithms — from step-by-step execution to real-time
            performance metrics and educational explanations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="p-5 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#333] transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mb-4 group-hover:bg-[#3B82F6]/15 transition-colors">
                    <Icon className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1.5">{feat.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
