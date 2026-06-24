'use client';

import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { SORTING_ALGORITHMS_METADATA } from '../../lib/algorithms/metadata';

interface ChromePerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

export const MetricsPanel: React.FC = () => {
  const { selectedAlgorithm, getMetrics, executionTime } = useVisualizerStore();
  const [heapMemory, setHeapMemory] = useState<string>('N/A');

  const metadata = SORTING_ALGORITHMS_METADATA[selectedAlgorithm];
  const { comparisons, swaps } = getMetrics();

  // Read memory heap usage (Chrome-only check)
  useEffect(() => {
    const updateMemory = () => {
      const perf = typeof window !== 'undefined' ? (window.performance as ChromePerformance) : undefined;
      if (perf && perf.memory) {
        const heap = perf.memory.usedJSHeapSize;
        setHeapMemory(`${(heap / 1024 / 1024).toFixed(1)} MB`);
      } else {
        setHeapMemory('N/A');
      }
    };

    updateMemory();
    // Update every 2 seconds if isPlaying or selected algo changes
    const interval = setInterval(updateMemory, 2000);
    return () => clearInterval(interval);
  }, [selectedAlgorithm]);

  if (!metadata) return null;

  return (
    <div className="flex flex-col gap-4 bg-card border border-border-strong rounded-xl p-5 shadow-2xl h-full justify-between">
      {/* Title and Static Complexity */}
      <div>
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-compare"></span>
          {metadata.name}
        </h3>
        
        <div className="flex flex-col gap-2 bg-background border border-border-strong rounded-lg p-3 text-xs font-mono text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Best Time:</span>
            <span className="font-bold text-success">{metadata.timeComplexity.best}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Average Time:</span>
            <span className="font-bold text-traverse">{metadata.timeComplexity.average}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Worst Time:</span>
            <span className="font-bold text-error">{metadata.timeComplexity.worst}</span>
          </div>
          <div className="h-px bg-border-strong my-1"></div>
          <div className="flex justify-between">
            <span className="text-slate-400">Space Complexity:</span>
            <span className="font-bold text-code">{metadata.spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Metrics */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex flex-col bg-background/50 border border-border-strong rounded-lg p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Comparisons</span>
          <span className="text-xl font-black text-compare mt-1 font-mono">{comparisons}</span>
        </div>
        <div className="flex flex-col bg-background/50 border border-border-strong rounded-lg p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Swaps</span>
          <span className="text-xl font-black text-swap mt-1 font-mono">{swaps}</span>
        </div>
      </div>

      {/* Live System Performance */}
      <div className="flex flex-col gap-2 bg-background/40 border border-border-strong rounded-lg p-3 text-[11px] font-mono text-slate-400 mt-2">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            ⏱ Execution (Precomputed):
          </span>
          <span className="font-bold text-slate-200">{executionTime.toFixed(2)} ms</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5" title="Whole JS Heap size, Chrome only">
            📊 JS Heap (Chrome, approx):
          </span>
          <span className="font-bold text-slate-200">{heapMemory}</span>
        </div>
      </div>
    </div>
  );
};
