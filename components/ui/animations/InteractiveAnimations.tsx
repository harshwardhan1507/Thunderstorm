"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({
  children,
  onClick,
  className = ""
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { damping: 3, mass: 0.1, stiffness: 100 });
  const ySpring = useSpring(y, { damping: 3, mass: 0.1, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HoverGlowProps {
  children: ReactNode;
  glowColor?: string;
  className?: string;
}

export function HoverGlowAnimation({
  children,
  glowColor = "rgba(124, 58, 237, 0.5)",
  className = ""
}: HoverGlowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative ${className}`}
    >
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 rounded-lg blur-xl"
          style={{ backgroundColor: glowColor }}
        />
      )}
      <motion.div
        className="relative"
        animate={{
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface RotateOnHoverProps {
  children: ReactNode;
  rotation?: number;
  className?: string;
}

export function RotateOnHoverAnimation({
  children,
  rotation = 5,
  className = ""
}: RotateOnHoverProps) {
  return (
    <motion.div
      whileHover={{ rotate: rotation, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PulseAnimationProps {
  children: ReactNode;
  className?: string;
}

export function PulseAnimation({
  children,
  className = ""
}: PulseAnimationProps) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FloatingAnimationProps {
  children: ReactNode;
  distance?: number;
  duration?: number;
  className?: string;
}

export function FloatingAnimation({
  children,
  distance = 20,
  duration = 3,
  className = ""
}: FloatingAnimationProps) {
  return (
    <motion.div
      animate={{ y: [-distance / 2, distance / 2, -distance / 2] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
