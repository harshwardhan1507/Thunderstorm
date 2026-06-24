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
} from 'lucide-react';

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
      available: false,
    },
    {
      title: 'Pathfinding',
      description: 'Watch Dijkstra and A* find the shortest path across interactive grids.',
      icon: Navigation,
      slug: 'pathfinding',
      available: false,
    },
    {
      title: 'Trees',
      description: 'Animate operations on binary search trees, AVL rotations, and heaps.',
      icon: GitBranch,
      slug: 'trees',
      available: false,
    },
    {
      title: 'Dynamic Programming',
      description: 'Visualize bottom-up and top-down DP transitions in tabular cells.',
      icon: Table2,
      slug: 'dp',
      available: false,
    },
    {
      title: 'Greedy',
      description: 'Trace greedy choices in Huffman Coding and Activity Selection.',
      icon: Zap,
      slug: 'greedy',
      available: false,
    },
  ];

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center bg-base px-6 py-20 relative overflow-hidden font-mono min-h-[calc(100vh-64px)] w-full select-none"
      style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124, 58, 237, 0.22) 0%, transparent 70%)',
      }}
    >
      <div className="z-10 max-w-4xl w-full text-center flex flex-col items-center gap-6">
        {/* Visual Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-default bg-elevated text-text-secondary text-xs mb-4 font-mono">
          <Zap className="w-3.5 h-3.5 text-accent-violet fill-accent-purple/20" />
          Algorithm Visualizer
        </div>

        {/* Large Bold Hero Headline */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Visualize Algorithms.
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Master the Storm.
          </h1>
        </div>

        {/* Subtitle */}
        <p className="max-w-xl mx-auto text-sm sm:text-base text-text-secondary font-sans leading-relaxed mt-2">
          Step-by-step DSA visualization for learners and builders.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-row gap-4 mt-6 w-full justify-center">
          <Link
            href="/sorting"
            className="px-5 py-3 rounded-lg border border-border-default text-white text-sm font-medium hover:bg-elevated transition duration-200 cursor-pointer shadow-md select-none"
          >
            Explore Free
          </Link>
          <Link
            href="/sorting"
            className="px-5 py-3 rounded-lg bg-gradient-to-r from-accent-purple to-indigo-700 hover:from-accent-violet hover:to-accent-purple text-white text-sm font-medium transition duration-200 cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.45)] select-none flex items-center gap-1.5"
          >
            Launch Visualizer ⚡
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-16 text-left">
          {categories.map((cat) => {
            const Icon = cat.icon;
            
            if (!cat.available) {
              return (
                <div
                  key={cat.title}
                  className="p-5 rounded-xl bg-surface border border-border-subtle opacity-50 select-none relative"
                >
                  <Icon className="w-5 h-5 text-slate-500 mb-3" />
                  <h3 className="text-slate-400 font-semibold text-base mb-1">{cat.title}</h3>
                  <p className="text-slate-600 text-xs font-sans leading-relaxed">{cat.description}</p>
                  <span className="absolute top-3 right-3 text-[8px] bg-slate-900 text-slate-600 px-1.5 py-0.5 rounded border border-border-subtle/50 font-mono">
                    SOON
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={cat.title}
                href={`/${cat.slug}`}
                className="p-5 rounded-xl bg-surface border border-border-subtle hover:border-accent-purple/40 hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full shadow-lg"
              >
                <div>
                  <Icon className="w-5 h-5 text-accent-violet mb-3 group-hover:scale-105 transition-transform" />
                  <h3 className="text-white font-semibold text-base mb-1">{cat.title}</h3>
                  <p className="text-text-secondary text-xs font-sans leading-relaxed">{cat.description}</p>
                </div>
                <span className="inline-flex items-center gap-1 mt-4 text-xs text-accent-purple font-medium group-hover:text-accent-violet transition-colors">
                  Visualize <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
