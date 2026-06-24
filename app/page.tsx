'use client';

import Link from 'next/link';
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
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const categories = [
    {
      title: 'Sorting',
      description: 'Visualize comparisons, swaps, and splits in array sorting algorithms.',
      icon: BarChart2,
      slug: 'sorting',
      available: true,
    },
    {
      title: 'Graphs',
      description: 'Explore graph traversals like BFS and DFS step-by-step.',
      icon: Share2,
      slug: 'graphs',
      available: true,
    },
    {
      title: 'Pathfinding',
      description: 'Watch Dijkstra and A* find the shortest path across interactive grids.',
      icon: Navigation,
      slug: 'pathfinding',
      available: true,
    },
    {
      title: 'Trees',
      description: 'Animate operations on binary search trees, AVL rotations, and heaps.',
      icon: GitBranch,
      slug: 'trees',
      available: true,
    },
    {
      title: 'Dynamic Programming',
      description: 'Visualize bottom-up and top-down DP transitions in tabular cells.',
      icon: Table2,
      slug: 'dp',
      available: true,
    },
    {
      title: 'Greedy',
      description: 'Trace greedy choices in Huffman Coding and Activity Selection.',
      icon: Zap,
      slug: 'greedy',
      available: true,
    },
  ];

  const features = [
    {
      title: 'Step-by-Step Execution',
      description: 'Watch algorithms execute one step at a time. Pause, rewind, and replay any operation to understand exactly how it works.',
      icon: Play,
    },
    {
      title: 'Multi-Language Code',
      description: 'Synchronized source code in JavaScript, Python, Java, and C++ — highlighting the active line as the algorithm runs.',
      icon: Code2,
    },
    {
      title: 'Live Metrics',
      description: 'Real-time counters for comparisons, swaps, execution time, and heap memory usage — see the cost of each algorithm.',
      icon: Activity,
    },
    {
      title: 'Interactive Controls',
      description: 'Scrub through the timeline, adjust playback speed from 0.25x to 25x, and resize arrays on the fly.',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-base px-6 py-20 relative overflow-hidden font-sans min-h-[calc(100vh-64px)] w-full select-none">
      {/* Aurora Glow Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse 50% 30% at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)
          `,
        }}
      />
      
      {/* Atmospheric particles overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px, 80px 80px',
        }}
      />
      
      <div className="z-10 max-w-4xl w-full text-center flex flex-col items-center gap-6">
        {/* Large Bold Hero Headline */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]">
            Visualize Algorithms.
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]">
            Master the Storm.
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary font-sans leading-relaxed mt-4"
        >
          Step-by-step DSA visualization for learners and builders.
        </motion.p>

        {/* Action Buttons - Staggered reveal */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
          }}
          className="flex flex-row gap-4 mt-8 w-full justify-center"
        >
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="flex animate-none"
          >
            <Link
              href="/sorting"
              className="px-6 py-3 rounded-lg border border-border-subtle text-white text-sm font-medium hover:border-border-hover hover:bg-surface-elevated transition-all duration-200 cursor-pointer select-none"
            >
              Explore Free
            </Link>
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="flex animate-none"
          >
            <Link
              href="/sorting"
              className="px-6 py-3 rounded-lg bg-accent-primary hover:bg-blue-600 text-white text-sm font-medium transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/20 select-none flex items-center gap-2"
            >
              Launch Visualizer
              <Zap className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-24 text-left"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;

            if (!cat.available) {
              return (
                <div
                  key={cat.title}
                  className="p-6 rounded-xl bg-surface-card border border-border-subtle opacity-40 select-none relative"
                >
                  <Icon className="w-5 h-5 text-text-muted mb-4" />
                  <h3 className="text-text-muted font-semibold text-lg mb-2">{cat.title}</h3>
                  <p className="text-text-muted text-sm font-sans leading-relaxed">{cat.description}</p>
                  <span className="absolute top-4 right-4 text-[10px] bg-surface-elevated text-text-muted px-2 py-1 rounded border border-border-subtle font-mono">
                    SOON
                  </span>
                </div>
              );
            }

            return (
              <motion.div
                key={cat.title}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <Link
                  href={`/${cat.slug}`}
                  className="p-6 rounded-xl bg-surface border border-border-subtle hover:border-border-hover hover:bg-surface-elevated transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full shadow-sm"
                >
                  <div>
                    <Icon className="w-5 h-5 text-accent-primary mb-4 group-hover:scale-105 transition-transform" />
                    <h3 className="text-white font-semibold text-lg mb-2">{cat.title}</h3>
                    <p className="text-text-secondary text-sm font-sans leading-relaxed">{cat.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 mt-6 text-sm text-accent-primary font-medium group-hover:text-accent-secondary transition-colors">
                    Visualize <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Why ThunderStorm — Features Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full mt-32 text-left"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Why ThunderStorm?
          </h2>
          <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-2xl">
            Everything you need to understand algorithms — from step-by-step execution to real-time performance metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="p-6 rounded-xl bg-surface border border-border-subtle hover:border-border-default transition-all duration-200 group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mb-4 group-hover:bg-accent-primary/15 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-accent-primary" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{feat.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
