"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ComparisonFeature {
  name: string;
  thunderstorm: boolean | string;
  others: boolean | string;
}

const features: ComparisonFeature[] = [
  { name: "Algorithm Visualizations", thunderstorm: true, others: true },
  { name: "Step-by-Step Execution", thunderstorm: true, others: false },
  { name: "Real-time Code Execution", thunderstorm: true, others: false },
  { name: "Performance Metrics", thunderstorm: true, others: "Limited" },
  { name: "Multiple Languages", thunderstorm: "4+", others: "1-2" },
  { name: "Interactive Comparisons", thunderstorm: true, others: false },
  { name: "Custom Test Cases", thunderstorm: true, others: false },
  { name: "Progress Tracking", thunderstorm: true, others: false },
  { name: "Community Features", thunderstorm: true, others: false },
  { name: "Mobile Support", thunderstorm: true, others: false },
];

export function ComparisonSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose ThunderStorm?
          </h2>
          <p className="text-lg text-white/60">
            The most comprehensive algorithm learning platform available.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <div className="min-w-full border border-white/10 rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-white/5 to-white/0 border-b border-white/10">
              <div className="p-6 font-semibold text-white">Features</div>
              <div className="p-6 font-semibold text-white text-center">ThunderStorm</div>
              <div className="p-6 font-semibold text-white/60 text-center">Other Platforms</div>
            </div>

            {/* Table Body */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-3 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="p-6 text-white/80">{feature.name}</div>
                <div className="p-6 text-center">
                  {typeof feature.thunderstorm === "boolean" ? (
                    feature.thunderstorm ? (
                      <Check size={20} className="mx-auto text-primary" />
                    ) : (
                      <X size={20} className="mx-auto text-white/30" />
                    )
                  ) : (
                    <span className="text-primary font-semibold">
                      {feature.thunderstorm}
                    </span>
                  )}
                </div>
                <div className="p-6 text-center">
                  {typeof feature.others === "boolean" ? (
                    feature.others ? (
                      <Check size={20} className="mx-auto text-white/30" />
                    ) : (
                      <X size={20} className="mx-auto text-white/30" />
                    )
                  ) : (
                    <span className="text-white/60 text-sm">{feature.others}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">
            Experience the difference with ThunderStorm today
          </p>
          <a href="/sorting">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all">
              Start Free Trial
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
