"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealAnimationProps {
  text: string | ReactNode;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export function TextRevealAnimation({
  text,
  delay = 0,
  duration = 0.5,
  staggerDelay = 0.02
}: TextRevealAnimationProps) {
  if (typeof text !== "string") {
    return text;
  }

  const words = text.split(" ");

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
            delayChildren: delay
          }
        }
      }}
      className="inline"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration }
            }
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function CharacterRevealAnimation({
  text,
  delay = 0,
  duration = 0.05
}: TextRevealAnimationProps) {
  if (typeof text !== "string") {
    return text;
  }

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
            staggerChildren: duration,
            delayChildren: delay
          }
        }
      }}
      className="inline"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 100 }
            }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function BlurTextAnimation({
  text,
  delay = 0,
  duration = 0.5
}: TextRevealAnimationProps) {
  if (typeof text !== "string") {
    return text;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration,
            delay
          }
        }
      }}
      className="inline"
    >
      {text}
    </motion.div>
  );
}
