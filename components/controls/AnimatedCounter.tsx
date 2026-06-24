'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number | string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const isNumber = typeof value === 'number';
  const previousValueRef = useRef<number>(0);

  useEffect(() => {
    if (!isNumber) return;

    // Animate from the previous value to the new value
    const controls = animate(motionValue, value, {
      duration: 0.4,
      ease: 'easeOut',
    });

    previousValueRef.current = value;
    return () => controls.stop();
  }, [value, isNumber, motionValue]);

  if (!isNumber) {
    return <span>{value}</span>;
  }

  return <motion.span>{rounded}</motion.span>;
};
