"use client";

import { motion } from "framer-motion";
import { Play, Code2, BarChart3, SplitSquareHorizontal, Cpu, SlidersHorizontal } from "lucide-react";
import { FeatureCard } from "@/components/ui/premium/FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      title: "Step-by-Step Visualization",
      description: "Watch every operation unfold in real-time with smooth animations. Understand exactly how elements move, compare, and swap.",
      icon: <Play size={24} />,
    },
    {
      title: "Multi-Language Code",
      description: "See the exact implementation in JavaScript, Python, Java, and C++. The code highlights synchronously with the visualizer.",
      icon: <Code2 size={24} />,
    },
    {
      title: "Performance Metrics",
      description: "Track time complexity, space complexity, comparisons, and array accesses in real-time as the algorithm executes.",
      icon: <BarChart3 size={24} />,
    },
    {
      title: "Compare Mode",
      description: "Run two different algorithms side-by-side on the exact same dataset to visually understand performance differences.",
      icon: <SplitSquareHorizontal size={24} />,
    },
    {
      title: "AI Code Analysis",
      description: "Get instant AI-powered feedback on your own algorithm implementations, identifying bugs and optimization opportunities.",
      icon: <Cpu size={24} />,
    },
    {
      title: "Interactive Controls",
      description: "Take full control of the execution. Pause, resume, adjust speed, and step forward or backward through the algorithm.",
      icon: <SlidersHorizontal size={24} />,
    },
  ];

  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Powerful features for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">deep understanding</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/60"
          >
            Everything you need to master Data Structures and Algorithms, built into a single premium platform.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
