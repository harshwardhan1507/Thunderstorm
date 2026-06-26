"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { BarChart3, GitBranch, Share2, Search, Zap, Repeat2, Shuffle, Type, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "sorting",
    title: "Sorting",
    description: "Master fundamental sorting algorithms",
    icon: BarChart3,
    href: "/sorting",
    color: "from-blue-500/20 to-blue-600/10",
    accentColor: "text-blue-400",
    gridSize: "md:col-span-2 md:row-span-1"
  },
  {
    id: "graphs",
    title: "Graphs",
    description: "Explore graph traversals and algorithms",
    icon: Share2,
    href: "/graphs",
    color: "from-purple-500/20 to-purple-600/10",
    accentColor: "text-purple-400",
    gridSize: "md:col-span-1 md:row-span-2"
  },
  {
    id: "trees",
    title: "Trees",
    description: "Binary trees, BST, and tree traversals",
    icon: GitBranch,
    href: "/trees",
    color: "from-green-500/20 to-green-600/10",
    accentColor: "text-green-400",
    gridSize: "md:col-span-1 md:row-span-1"
  },
  {
    id: "searching",
    title: "Searching",
    description: "Binary search and search techniques",
    icon: Search,
    href: "/sorting",
    color: "from-orange-500/20 to-orange-600/10",
    accentColor: "text-orange-400",
    gridSize: "md:col-span-1 md:row-span-1"
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    description: "DP problems and optimization",
    icon: Zap,
    href: "/dp",
    color: "from-pink-500/20 to-pink-600/10",
    accentColor: "text-pink-400",
    gridSize: "md:col-span-2 md:row-span-1"
  },
  {
    id: "greedy",
    title: "Greedy",
    description: "Greedy algorithm patterns",
    icon: Repeat2,
    href: "/greedy",
    color: "from-cyan-500/20 to-cyan-600/10",
    accentColor: "text-cyan-400",
    gridSize: "md:col-span-1 md:row-span-1"
  },
  {
    id: "backtracking",
    title: "Backtracking",
    description: "Backtracking and recursion",
    icon: Shuffle,
    href: "/greedy",
    color: "from-indigo-500/20 to-indigo-600/10",
    accentColor: "text-indigo-400",
    gridSize: "md:col-span-1 md:row-span-1"
  },
  {
    id: "strings",
    title: "String Algorithms",
    description: "String matching and manipulation",
    icon: Type,
    href: "/sorting",
    color: "from-red-500/20 to-red-600/10",
    accentColor: "text-red-400",
    gridSize: "md:col-span-1 md:row-span-1"
  }
];

export function AlgorithmCategoriesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Algorithm Categories
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Explore comprehensive collections of algorithms organized by category
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredId === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={category.gridSize}
              >
                <Link href={category.href}>
                  <motion.div
                    onHoverStart={() => setHoveredId(category.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative h-48 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 cursor-pointer transition-all duration-300 hover:border-white/20"
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between">
                      {/* Icon and title */}
                      <div>
                        <motion.div
                          animate={{ scale: isHovered ? 1.15 : 1, rotate: isHovered ? 5 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 ${category.accentColor} mb-4 group-hover:bg-white/20 transition-colors`}
                        >
                          <Icon size={24} />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {category.title}
                        </h3>
                        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                          {category.description}
                        </p>
                      </div>

                      {/* Arrow indicator */}
                      <motion.div
                        animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors"
                      >
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRight size={16} />
                      </motion.div>
                    </div>

                    {/* Hover glow effect */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-white/60 mb-6">
            Each category includes step-by-step visualizations, code implementations, and complexity analysis
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-white rounded-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            View All Algorithms
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
