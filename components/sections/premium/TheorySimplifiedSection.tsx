"use client";

import { motion } from "framer-motion";
import { BookMarked, Lightbulb, Target, Zap } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Concept Breakdown",
    description: "Complex algorithms explained step-by-step with visual demonstrations and real-world analogies."
  },
  {
    icon: Target,
    title: "Focused Learning",
    description: "Learn exactly what you need without unnecessary complexity. Structured learning paths for every skill level."
  },
  {
    icon: Zap,
    title: "Interactive Visualization",
    description: "See algorithms in action with real-time animations. Pause, step through, and understand every operation."
  },
  {
    icon: BookMarked,
    title: "Comprehensive Notes",
    description: "Well-organized notes with code examples, complexity analysis, and practical applications."
  }
];

export function TheorySimplifiedSection() {
  return (
    <section className="relative py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookMarked className="text-primary" size={24} />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Theory Simplified
            </h2>
          </div>
          <p className="text-lg text-white/60 max-w-2xl">
            Understand fundamentals without confusion & application. This approach fosters deeper comprehension and practical skills.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
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
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
