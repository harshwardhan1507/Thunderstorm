"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function TextReveal({ text, className, delay = 0, duration = 0.5 }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
        hidden: {},
      }}
      className={cn("flex flex-wrap justify-center", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration, ease: [0.2, 0.65, 0.3, 0.9] } },
          }}
          className="mr-3 inline-block whitespace-nowrap"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
