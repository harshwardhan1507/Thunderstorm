"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart3, GitBranch, Share2, Code2, Zap, Activity } from "lucide-react";

const previews = [
  {
    id: "sorting",
    title: "Sorting Visualizer",
    icon: BarChart3,
    description: "Watch algorithms sort in real-time",
    color: "from-blue-500/20 to-blue-600/10",
    accentColor: "text-blue-400"
  },
  {
    id: "trees",
    title: "Tree Visualizer",
    icon: GitBranch,
    description: "Explore tree structures and traversals",
    color: "from-green-500/20 to-green-600/10",
    accentColor: "text-green-400"
  },
  {
    id: "graphs",
    title: "Graph Explorer",
    icon: Share2,
    description: "Visualize graph algorithms",
    color: "from-purple-500/20 to-purple-600/10",
    accentColor: "text-purple-400"
  },
  {
    id: "code",
    title: "Code Editor",
    icon: Code2,
    description: "Write and execute code instantly",
    color: "from-orange-500/20 to-orange-600/10",
    accentColor: "text-orange-400"
  },
  {
    id: "timeline",
    title: "Execution Timeline",
    icon: Zap,
    description: "Step through algorithm execution",
    color: "from-pink-500/20 to-pink-600/10",
    accentColor: "text-pink-400"
  },
  {
    id: "complexity",
    title: "Complexity Dashboard",
    icon: Activity,
    description: "Analyze time and space complexity",
    color: "from-cyan-500/20 to-cyan-600/10",
    accentColor: "text-cyan-400"
  }
];

export function InteractivePreviewSection() {
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
            Interactive Preview Components
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Experience live visualizations of algorithms with real-time feedback and detailed metrics
          </p>
        </motion.div>

        {/* Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previews.map((preview, index) => {
            const Icon = preview.icon;
            const isHovered = hoveredId === preview.id;

            return (
              <motion.div
                key={preview.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredId(preview.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition-all duration-300 hover:border-white/20"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${preview.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6">
                  {/* Top section */}
                  <div>
                    <motion.div
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 ${preview.accentColor} mb-4`}
                    >
                      <Icon size={24} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {preview.title}
                    </h3>
                    <p className="text-sm text-white/60">
                      {preview.description}
                    </p>
                  </div>

                  {/* Live visualization mockup */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0.5 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: isHovered ? `${80 - i * 15}%` : `${60 - i * 10}%`,
                          opacity: isHovered ? 1 : 0.6
                        }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${preview.color}`}
                      />
                    ))}
                  </motion.div>

                  {/* Arrow indicator */}
                  <motion.div
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-6 right-6 text-white/40 group-hover:text-white/80 transition-colors"
                  >
                    →
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
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-white rounded-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            Explore All Visualizations
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
