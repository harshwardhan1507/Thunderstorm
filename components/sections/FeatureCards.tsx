'use client';

import React, { useState } from 'react';
import { Shuffle, Network, Route, TreePine, Layers, TrendingUp, Zap, BarChart3, Code } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Shuffle className="w-6 h-6" />,
    title: 'Sorting Algorithms',
    description: 'Visualize bubble, merge, quick sort and more with step-by-step execution',
    color: '#7c3aed',
  },
  {
    icon: <Network className="w-6 h-6" />,
    title: 'Graph Algorithms',
    description: 'Explore BFS, DFS, Dijkstra, and other graph traversal techniques',
    color: '#3b82f6',
  },
  {
    icon: <Route className="w-6 h-6" />,
    title: 'Pathfinding',
    description: 'Master A*, Dijkstra, and shortest path algorithms visually',
    color: '#10b981',
  },
  {
    icon: <TreePine className="w-6 h-6" />,
    title: 'Tree Structures',
    description: 'Understand BST, AVL trees, and heap operations interactively',
    color: '#f59e0b',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Dynamic Programming',
    description: 'Break down complex problems with DP visualizations',
    color: '#ec4899',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Greedy Algorithms',
    description: 'Learn greedy strategies and optimization techniques',
    color: '#06b6d4',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Code Execution',
    description: 'See real code execution with synchronized visualizations',
    color: '#8b5cf6',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Performance Metrics',
    description: 'Track time complexity, space complexity, and comparisons',
    color: '#f97316',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-time Feedback',
    description: 'Instant visual feedback for every operation',
    color: '#22c55e',
  },
];

export const FeatureCards: React.FC = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Powerful Features
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            Everything you need to master algorithms and data structures
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                backgroundColor: colors.bg.primary,
                borderColor: hoveredIndex === index ? feature.color : colors.border.primary,
                transform: hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: feature.color }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${feature.color}20`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-semibold mb-2 transition-colors duration-300"
                  style={{ color: colors.text.primary }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm transition-colors duration-300"
                  style={{ color: colors.text.secondary }}
                >
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div
                  className="mt-4 h-1 w-0 rounded-full transition-all duration-300 group-hover:w-8"
                  style={{ backgroundColor: feature.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
