"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { TextReveal } from "@/components/ui/premium/TextReveal";
import { MagneticButton } from "@/components/ui/premium/MagneticButton";
import { InteractiveDashboard } from "@/components/ui/premium/InteractiveDashboard";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-[#0a0a0a] to-[#0a0a0a]" />
      <div className="absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 opacity-20 blur-[120px] bg-gradient-to-b from-primary to-purple-600" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container relative z-10 mx-auto px-4 text-center">


        {/* Headline */}
        <h1 className="mx-auto max-w-6xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
          <div>
            <TextReveal text="Master Algorithms" />
          </div>
          <div className="mt-2 md:mt-4 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
            <TextReveal text="Through Visualization" delay={0.2} />
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
        >
          The most advanced interactive learning platform for Data Structures and Algorithms.
          Visualize, code, and master complex concepts with real-time feedback.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/sorting">
            <MagneticButton className="group flex items-center gap-2">
              Start Visualizing
              <Play size={16} className="transition-transform group-hover:translate-x-1" fill="currentColor" />
            </MagneticButton>
          </Link>
          <Link href="/compare">
            <button className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 font-medium text-white transition-all hover:bg-white/10">
              Compare Algorithms
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-white/40 md:gap-16"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white">50K+</span>
            <span>Active Learners</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white">48+</span>
            <span>Algorithms</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white">4+</span>
            <span>Languages</span>
          </div>
        </motion.div>

        {/* Interactive Dashboard Preview */}
        <div className="mt-20">
          <InteractiveDashboard />
        </div>
      </div>
    </section>
  );
}
