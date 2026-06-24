'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';

export const SortingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { array, steps, currentStepIndex } = useVisualizerStore();
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

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

  // Redraw canvas on array/step/dimension updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear Canvas
    ctx.fillStyle = '#141414'; // --bg-surface
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    if (array.length === 0) return;

    const n = array.length;
    const padding = 4; // space between bars
    const totalPadding = padding * (n - 1);
    const barWidth = (dimensions.width - totalPadding) / n;

    // Read current step information
    const currentStep = steps[currentStepIndex];
    const comparing = currentStep ? currentStep.comparing : [];
    const swapped = currentStep ? currentStep.swapped : false;

    // Find max value in array to scale heights
    const maxVal = Math.max(...array);

    for (let i = 0; i < n; i++) {
      const val = array[i];
      // Scale height to take up 85% of canvas height
      const barHeight = (val / maxVal) * (dimensions.height * 0.85);
      const x = i * (barWidth + padding);
      const y = dimensions.height - barHeight;

      // Determine bar colors based on visualizer state
      let fillStyle = 'rgba(96, 165, 250, 0.85)'; // Default storm blue (with slight alpha for glow feel)
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

      // Draw shadow glow behind comparing/swapping bars
      if (comparing.includes(i)) {
        ctx.save();
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 15;
      }

      // Draw rounded bars
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      // roundRect signature: x, y, width, height, [top-left, top-right, bottom-right, bottom-left]
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      if (comparing.includes(i)) {
        ctx.restore();
      }

      // Render value text on top of the bar for smaller arrays for readability
      if (n <= 30) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        // Draw slightly above the bar
        ctx.fillText(val.toString(), x + barWidth / 2, y - 8);
      }
    }
  }, [array, steps, currentStepIndex, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-transparent overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};
