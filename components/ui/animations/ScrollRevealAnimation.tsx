"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps extends Omit<MotionProps, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export function ScrollRevealAnimation({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 30,
  ...props
}: ScrollRevealProps) {
  const getInitialState = () => {
    const baseState = { opacity: 0 };
    switch (direction) {
      case "up":
        return { ...baseState, y: distance };
      case "down":
        return { ...baseState, y: -distance };
      case "left":
        return { ...baseState, x: distance };
      case "right":
        return { ...baseState, x: -distance };
      default:
        return baseState;
    }
  };

  return (
    <motion.div
      initial={getInitialState()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.65, 0.3, 0.9]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerAnimationProps {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  duration?: number;
}

export function StaggerAnimation({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  duration = 0.6
}: StaggerAnimationProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.2, 0.65, 0.3, 0.9]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeUpAnimation({
  children,
  delay = 0,
  duration = 0.6
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.65, 0.3, 0.9]
      }}
    >
      {children}
    </motion.div>
  );
}
