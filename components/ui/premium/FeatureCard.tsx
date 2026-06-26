"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FeatureCard({ title, description, icon, className, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300",
        "hover:border-primary/50 hover:bg-white/10",
        "dark:border-white/5 dark:bg-white/5 dark:hover:border-primary/50 dark:hover:bg-white/10",
        "light:border-black/5 light:bg-black/5 light:hover:border-primary/50 light:hover:bg-black/10",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {title}
        </h3>
        
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      
      {/* Subtle bottom glow line on hover */}
      <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
