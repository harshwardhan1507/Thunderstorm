'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { gsap } from 'gsap';

interface BarObject {
  id: string;
  value: number;
  currentIndex: number;
}

export const SortingCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { array, steps, currentStepIndex } = useVisualizerStore();
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [localBars, setLocalBars] = useState<BarObject[]>([]);

  // Handle resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 200),
          height: Math.max(height, 200),
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const n = array.length;
  const padding = 4; // space between bars
  const totalPadding = padding * (n - 1);
  const barWidth = n > 0 ? (dimensions.width - 48 - totalPadding) / n : 0; // subtract horizontal padding
  const maxVal = array.length > 0 ? Math.max(...array) : 1;

  // Initialize or update local bars when array changes
  useEffect(() => {
    if (array.length === 0) {
      setLocalBars([]);
      return;
    }

    // Reset local bars if length differs
    if (localBars.length !== array.length) {
      const initial = array.map((val, idx) => ({
        id: `bar-${idx}-${val}-${Math.random().toString(36).substr(2, 4)}`, // unique stable key
        value: val,
        currentIndex: idx,
      }));
      setLocalBars(initial);
      return;
    }

    // Map step indices to existing local bar objects
    const currentArray = steps[currentStepIndex]?.array || array;
    const matched = new Set<string>();
    const nextBars = localBars.map((bar) => ({ ...bar }));

    // For each position in currentArray, match to the closest value in localBars
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

    // Animate positions with GSAP
    nextBars.forEach((bar) => {
      const barEl = document.getElementById(`sorting-bar-${bar.id}`);
      if (barEl) {
        const targetX = 24 + bar.currentIndex * (barWidth + padding); // add offset
        const currentStep = steps[currentStepIndex];
        const comparing = currentStep ? currentStep.comparing : [];
        const swapped = currentStep ? currentStep.swapped : false;
        const isComparing = comparing.includes(bar.currentIndex);

        if (isComparing) {
          if (swapped) {
            // Swap animation: translate position smoothly (300ms)
            gsap.to(barEl, {
              x: targetX,
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out',
            });
          } else {
            // Compare animation: scale up, glow, return to normal (200ms)
            gsap.timeline()
              .to(barEl, {
                x: targetX,
                scale: 1.08,
                duration: 0.1,
                filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))',
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
          // Regular translate
          gsap.to(barEl, {
            x: targetX,
            scale: 1,
            filter: 'none',
            duration: 0.25,
            ease: 'power2.out',
          });
        }
      }
    });

    setLocalBars(nextBars);
  }, [array, currentStepIndex]);

  // Green sweep completion ripple
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1 && localBars.length > 0) {
      const sortedBarIds = [...localBars]
        .sort((a, b) => a.currentIndex - b.currentIndex)
        .map((b) => `sorting-bar-${b.id}`);

      const elements = sortedBarIds.map((id) => document.getElementById(id)).filter(Boolean);

      if (elements.length > 0) {
        const tl = gsap.timeline();
        tl.to(elements, {
          backgroundColor: '#22C55E', // Green sweep
          borderColor: '#4ADE80',
          scale: 1.06,
          filter: 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.7))',
          stagger: 0.02,
          duration: 0.15,
          ease: 'power1.out',
        }).to(elements, {
          scale: 1,
          filter: 'none',
          stagger: 0.02,
          duration: 0.15,
          ease: 'power1.in',
        }, '-=0.25'); // ripple sweep back
      }
    }
  }, [currentStepIndex, steps.length, localBars.length]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#141414] overflow-hidden p-0">
      {localBars.map((bar) => {
        const barHeight = (bar.value / maxVal) * (dimensions.height * 0.75);
        const initialX = 24 + bar.currentIndex * (barWidth + padding);

        const currentStep = steps[currentStepIndex];
        const comparing = currentStep ? currentStep.comparing : [];
        const swapped = currentStep ? currentStep.swapped : false;
        const isComparing = comparing.includes(bar.currentIndex);

        let barBg = 'bg-blue-500/80';
        let borderCol = 'border-blue-400/20';

        if (isComparing) {
          if (swapped) {
            barBg = 'bg-yellow-400';
            borderCol = 'border-yellow-300';
          } else {
            barBg = 'bg-blue-600';
            borderCol = 'border-blue-500';
          }
        }

        return (
          <div
            key={bar.id}
            id={`sorting-bar-${bar.id}`}
            className={`absolute bottom-6 rounded-t-md border flex flex-col items-center justify-end transition-colors duration-150 shadow-sm ${barBg} ${borderCol}`}
            style={{
              width: `${barWidth}px`,
              height: `${barHeight}px`,
              left: 0,
              transform: `translateX(${initialX}px)`,
              transformOrigin: 'bottom center',
            }}
          >
            {n <= 30 && (
              <span className="text-[9px] font-bold text-white font-mono mb-2 pointer-events-none select-none">
                {bar.value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
