"use client";

import { motion } from "framer-motion";
import { Play, Code2, Zap } from "lucide-react";

export function PracticePlaySection() {
  return (
    <section className="relative py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Practice & Play
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Write, test, and experiment with code instantly without leaving your dashboard. Interactive coding environment with real-time visualization of your algorithms.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Run code with instant feedback",
                "Visualize algorithm execution",
                "Compare multiple approaches",
                "Export and share solutions"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Zap size={14} />
                  </div>
                  <span className="text-white/80">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            >
              Start Practicing
            </motion.button>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-96 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-purple-600/10 overflow-hidden">
              {/* Code editor mockup */}
              <div className="absolute inset-0 p-6 flex flex-col">
                {/* Editor header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <Code2 size={18} className="text-primary" />
                  <span className="text-sm text-white/60">main.js</span>
                </div>

                {/* Code lines */}
                <div className="space-y-2 flex-1">
                  {[
                    "function quickSort(arr) {",
                    "  if (arr.length ≤ 1) return arr;",
                    "  const pivot = arr[0];",
                    "  const left = [], right = [];",
                    "  // ... partition logic",
                    "  return [...quickSort(left), ...]",
                    "}"
                  ].map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-sm font-mono text-white/40"
                    >
                      {line}
                    </motion.div>
                  ))}
                </div>

                {/* Run button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors"
                >
                  <Play size={14} fill="currentColor" />
                  Run Code
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
