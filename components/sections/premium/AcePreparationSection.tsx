"use client";

import { motion } from "framer-motion";
import { Trophy, Users, TrendingUp, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "50K+",
    label: "Active Learners"
  },
  {
    icon: TrendingUp,
    number: "1000+",
    label: "Problems Solved"
  },
  {
    icon: Trophy,
    number: "95%",
    label: "Success Rate"
  },
  {
    icon: Zap,
    number: "24/7",
    label: "Available"
  }
];

export function AcePreparationSection() {
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
            Ace Your Interview Preparation
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Level up your problem-solving and get job-ready with hands-on prep
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-6 rounded-xl border border-white/10 bg-white/5 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Icon size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-white/60">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Structured Learning Paths",
              description: "Follow curated paths designed by industry experts. From fundamentals to advanced topics."
            },
            {
              title: "Real Interview Questions",
              description: "Practice with actual questions asked in interviews at top tech companies."
            },
            {
              title: "Performance Tracking",
              description: "Monitor your progress with detailed analytics and personalized recommendations."
            },
            {
              title: "Community Support",
              description: "Connect with peers, discuss solutions, and learn from the community."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
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
            Start Your Preparation
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
