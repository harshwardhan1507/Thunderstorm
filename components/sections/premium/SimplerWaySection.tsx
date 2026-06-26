"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Zap, MessageSquare, FileText } from "lucide-react";

const tabs = [
  {
    id: "dsa-sheets",
    label: "DSA Sheets",
    icon: BookOpen,
    description: "Comprehensive DSA problem sheets organized by difficulty and topic",
    content: "Access curated problem sets covering all major data structures and algorithms. From arrays and linked lists to advanced graph algorithms."
  },
  {
    id: "core-subjects",
    label: "Core Subjects",
    icon: Zap,
    description: "Master fundamental computer science concepts",
    content: "Deep dive into core subjects like OOPS, System Design, Database Management, and Operating Systems with interactive visualizations."
  },
  {
    id: "interview-exp",
    label: "Interview Experience",
    icon: MessageSquare,
    description: "Learn from real interview experiences",
    content: "Read and share interview experiences from top tech companies. Understand what to expect and how to prepare effectively."
  },
  {
    id: "articles",
    label: "Articles",
    icon: FileText,
    description: "In-depth technical articles and tutorials",
    content: "Explore well-researched articles covering advanced topics, optimization techniques, and best practices in software development."
  }
];

export function SimplerWaySection() {
  const [activeTab, setActiveTab] = useState("dsa-sheets");
  const activeTabData = tabs.find(tab => tab.id === activeTab);

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
            A Simpler Way for You to Learn
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Everything you need in one place - from beginner-friendly courses to in-depth subject articles.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTabData && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            {/* Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  {activeTabData.label}
                </h3>
                <p className="text-white/70 text-lg">
                  {activeTabData.description}
                </p>
              </div>
              <p className="text-white/60 leading-relaxed">
                {activeTabData.content}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                Explore {activeTabData.label}
              </motion.button>
            </div>

            {/* Visual Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative h-96 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-purple-600/10 overflow-hidden"
            >
              {/* Animated grid background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-transparent" />
              </div>

              {/* Content preview */}
              <div className="relative h-full flex flex-col items-center justify-center p-8">
                <div className="w-full space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-3 bg-gradient-to-r from-primary/40 to-primary/10 rounded-full"
                      style={{ width: `${100 - i * 15}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
