'use client';

import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { SORTING_ALGORITHMS_METADATA } from '../../lib/algorithms/metadata';

import { RefreshCw, ArrowLeftRight, Clock, Activity } from 'lucide-react';

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
    const interval = setInterval(updateMemory, 2000);
    return () => clearInterval(interval);
  }, [selectedAlgorithm]);

  if (!metadata) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 4-Card Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {/* Card 1: Comparisons */}
        <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md select-none flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Comparisons
            </span>
            <RefreshCw className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div className="text-2xl font-black text-white font-mono leading-none mt-1">
            {comparisons}
          </div>
        </div>

        {/* Card 2: Swaps */}
        <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md select-none flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Swaps
            </span>
            <ArrowLeftRight className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div className="text-2xl font-black text-white font-mono leading-none mt-1">
            {swaps}
          </div>
        </div>

        {/* Card 3: Execution Time */}
        <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md select-none flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Time
            </span>
            <Clock className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div className="text-2xl font-black text-white font-mono leading-none mt-1">
            {executionTime.toFixed(1)}ms
          </div>
        </div>

        {/* Card 4: Heap Memory */}
        <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md select-none flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">
              Heap
            </span>
            <Activity className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">
              {heapMemory}
            </div>
            {heapMemory !== 'N/A' && (
              <div className="text-[9px] text-text-muted mt-1 leading-none font-mono">
                Chrome only, approx
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complexity Badges Row */}
      <div className="flex gap-2.5 mt-2 flex-wrap">
        <span className="px-3 py-1.5 rounded-lg bg-elevated border border-border-default text-xs font-semibold text-text-secondary font-mono shadow-sm">
          Time: <span className="text-success">{metadata.timeComplexity.best} best</span> · <span className="text-error">{metadata.timeComplexity.worst} worst</span>
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-elevated border border-border-default text-xs font-semibold text-text-secondary font-mono shadow-sm">
          Space: <span className="text-code">{metadata.spaceComplexity}</span>
        </span>
      </div>
    </div>
  );
};

