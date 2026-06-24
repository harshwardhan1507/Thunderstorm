'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCompareStore } from '../../store/compareStore';
import { gsap } from 'gsap';

interface BarObject {
  id: string;
  value: number;
  currentIndex: number;
}

interface CompareCanvasProps {
  side: 'left' | 'right';
}

export const CompareCanvas: React.FC<CompareCanvasProps> = ({ side }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const array = useCompareStore((state) => state[side].array);
  const steps = useCompareStore((state) => state[side].steps);
  const currentStepIndex = useCompareStore((state) => state[side].currentStepIndex);

  const [dimensions, setDimensions] = useState({ width: 300, height: 250 });
  const [localBars, setLocalBars] = useState<BarObject[]>([]);

  // Responsive resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 100),
          height: Math.max(height, 100),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const n = array.length;
  const padding = n > 50 ? 1 : n > 30 ? 2 : 4; // adaptive spacing
  const totalPadding = padding * (n - 1);
  const barWidth = n > 0 ? (dimensions.width - 48 - totalPadding) / n : 0;
  const maxVal = array.length > 0 ? Math.max(...array) : 1;

  // Sync / transition local bars state
  useEffect(() => {
    if (array.length === 0) {
      setLocalBars([]);
      return;
    }

    if (localBars.length !== array.length) {
      const initial = array.map((val, idx) => ({
        id: `bar-${side}-${idx}-${val}-${Math.random().toString(36).substr(2, 4)}`,
        value: val,
        currentIndex: idx,
      }));
      setLocalBars(initial);
      return;
    }

    const currentArray = steps[currentStepIndex]?.array || array;
    const matched = new Set<string>();
    const nextBars = localBars.map((bar) => ({ ...bar }));

    for (let newIdx = 0; newIdx < currentArray.length; newIdx++) {
      const val = currentArray[newIdx];
      const bestMatch = nextBars.find(
        (b) => b.value === val && !matched.has(b.id)
      );
      if (bestMatch) {
        bestMatch.currentIndex = newIdx;
        matched.add(bestMatch.id);
      }
    }

    // Animate bar elements
    nextBars.forEach((bar) => {
      const barEl = document.getElementById(`compare-bar-${side}-${bar.id}`);
      if (barEl) {
        const targetX = 24 + bar.currentIndex * (barWidth + padding);
        const currentStep = steps[currentStepIndex];
        const comparing = currentStep ? currentStep.comparing : [];
        const swapped = currentStep ? currentStep.swapped : false;
        const isComparing = comparing.includes(bar.currentIndex);

        if (isComparing) {
          if (swapped) {
            gsap.to(barEl, {
              x: targetX,
              scale: 1.05,
              duration: 0.25,
              ease: 'power2.out',
            });
          } else {
            gsap.timeline()
              .to(barEl, {
                x: targetX,
                scale: 1.08,
                duration: 0.1,
                filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.7))',
                ease: 'power2.out',
              })
              .to(barEl, {
                scale: 1,
                duration: 0.1,
                filter: 'none',
                ease: 'power2.in',
              });
          }
        } else {
          gsap.to(barEl, {
            x: targetX,
            scale: 1,
            filter: 'none',
            duration: 0.2,
            ease: 'power2.out',
          });
        }
      }
    });

    setLocalBars(nextBars);
  }, [array, currentStepIndex, dimensions.width]);

  // Victory Green sweep ripple on finish
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1 && localBars.length > 0) {
      const sortedBarIds = [...localBars]
        .sort((a, b) => a.currentIndex - b.currentIndex)
        .map((b) => `compare-bar-${side}-${b.id}`);

      const elements = sortedBarIds.map((id) => document.getElementById(id)).filter(Boolean);

      if (elements.length > 0) {
        const tl = gsap.timeline();
        tl.to(elements, {
          backgroundColor: '#10B981', // Emerald green trail
          borderColor: '#34D399',
          scale: 1.05,
          filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))',
          stagger: 0.015,
          duration: 0.15,
          ease: 'power1.out',
        }).to(elements, {
          scale: 1,
          filter: 'none',
          stagger: 0.015,
          duration: 0.15,
          ease: 'power1.in',
        }, '-=0.2');
      }
    }
  }, [currentStepIndex, steps.length, localBars.length]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#141414] overflow-hidden p-0">
      {localBars.map((bar) => {
        const barHeight = (bar.value / maxVal) * (dimensions.height * 0.72);
        const initialX = 24 + bar.currentIndex * (barWidth + padding);

        const currentStep = steps[currentStepIndex];
        const comparing = currentStep ? currentStep.comparing : [];
        const swapped = currentStep ? currentStep.swapped : false;
        const isComparing = comparing.includes(bar.currentIndex);

        let barBg = side === 'left' ? 'bg-accent-purple/80' : 'bg-accent-violet/80';
        let borderCol = 'border-[#2a2a2a]';

        if (isComparing) {
          if (swapped) {
            barBg = 'bg-yellow-400';
            borderCol = 'border-yellow-300';
          } else {
            barBg = 'bg-blue-500';
            borderCol = 'border-blue-400';
          }
        }

        return (
          <div
            key={bar.id}
            id={`compare-bar-${side}-${bar.id}`}
            className={`absolute bottom-4 rounded-t-md border flex flex-col items-center justify-end transition-colors duration-150 shadow-sm ${barBg} ${borderCol}`}
            style={{
              width: `${barWidth}px`,
              height: `${barHeight}px`,
              left: 0,
              transform: `translateX(${initialX}px)`,
              transformOrigin: 'bottom center',
            }}
          >
            {n <= 20 && (
              <span className="text-[8px] font-bold text-white font-mono mb-1 pointer-events-none select-none">
                {bar.value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
