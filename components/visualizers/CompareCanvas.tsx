'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCompareStore } from '../../store/compareStore';

interface CompareCanvasProps {
  side: 'left' | 'right';
}

export const CompareCanvas: React.FC<CompareCanvasProps> = ({ side }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 250 });

  const array = useCompareStore((state) => state[side].array);
  const steps = useCompareStore((state) => state[side].steps);
  const currentStepIndex = useCompareStore((state) => state[side].currentStepIndex);

  // Set up responsive resize observer
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

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear Canvas with surface background color
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    if (array.length === 0) return;

    const n = array.length;
    const padding = 2;
    const totalPadding = padding * (n - 1);
    const barWidth = (dimensions.width - totalPadding) / n;

    const currentStep = steps[currentStepIndex];
    const comparing = currentStep ? currentStep.comparing : [];
    const swapped = currentStep ? currentStep.swapped : false;
    const maxVal = Math.max(...array);

    for (let i = 0; i < n; i++) {
      const val = array[i];
      // Scale height to take up 82% of canvas height
      const barHeight = (val / maxVal) * (dimensions.height * 0.82);
      const x = i * (barWidth + padding);
      const y = dimensions.height - barHeight;

      let fillStyle = 'rgba(96, 165, 250, 0.85)'; // Default blue
      let shadowColor = 'rgba(96, 165, 250, 0.2)';

      if (comparing.includes(i)) {
        if (swapped) {
          fillStyle = '#facc15'; // Swap yellow
          shadowColor = 'rgba(250, 204, 21, 0.6)';
        } else {
          fillStyle = '#3b82f6'; // Comparison blue
          shadowColor = 'rgba(59, 130, 246, 0.6)';
        }
      }

      // Draw shadow glow behind active bars
      if (comparing.includes(i)) {
        ctx.save();
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 12;
      }

      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
      ctx.fill();

      if (comparing.includes(i)) {
        ctx.restore();
      }

      // Text indicators for smaller array sizes
      if (n <= 20) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(val.toString(), x + barWidth / 2, y - 6);
      }
    }
  }, [array, steps, currentStepIndex, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-transparent">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
