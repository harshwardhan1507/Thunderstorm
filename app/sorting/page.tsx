'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useVisualizerStore, SortingAlgorithmType } from '../../store/visualizerStore';
import { SortingCanvas } from '../../components/visualizers/SortingCanvas';
import { CodePanel } from '../../components/code/CodePanel';
import { ArraySizeInput } from '../../components/controls/ArraySizeInput';
import { SpeedSlider } from '../../components/controls/SpeedSlider';
import { PlayPauseButton } from '../../components/controls/PlayPauseButton';
import { MetricsPanel } from '../../components/controls/MetricsPanel';
import { TimelineScrubber } from '../../components/controls/TimelineScrubber';
import { SORTING_ALGORITHMS_METADATA } from '../../lib/algorithms/metadata';

export default function SortingPage() {
  const {
    generateNewArray,
    selectedAlgorithm,
    setSelectedAlgorithm,
    isPlaying,
  } = useVisualizerStore();

  // Initialize array on mount
  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  const algoLabel = SORTING_ALGORITHMS_METADATA[selectedAlgorithm]?.name || 'Sorting';

  const algos: { key: SortingAlgorithmType; label: string }[] = [
    { key: 'bubble', label: 'Bubble Sort' },
    { key: 'merge', label: 'Merge Sort' },
    { key: 'quick', label: 'Quick Sort' },
    { key: 'heap', label: 'Heap Sort' },
  ];

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col font-sans select-none">
      {/* Breadcrumb Bar */}
      <div className="text-xs text-text-muted font-mono mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Sorting</span>
        <span>›</span>
        <span className="text-text-primary font-semibold">{algoLabel}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sorting</h1>
          <p className="text-text-secondary text-sm mt-1">
            Visualize and compare sorting algorithms step-by-step
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateNewArray()}
            disabled={isPlaying}
            className="px-4 py-2 text-xs font-bold uppercase bg-surface border border-border-default hover:border-text-secondary rounded-lg text-text-primary hover:bg-elevated transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate New Data
          </button>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex gap-1 bg-[#141414]/40 border border-border-subtle rounded-lg p-0.5 self-start mb-6">
        {algos.map((algo) => (
          <button
            key={algo.key}
            onClick={() => setSelectedAlgorithm(algo.key)}
            disabled={isPlaying}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              selectedAlgorithm === algo.key
                ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
                : 'text-text-secondary hover:text-white hover:bg-elevated'
            }`}
          >
            {algo.label}
          </button>
        ))}
      </div>

      {/* Main Split-View Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-border-subtle mb-6 shadow-2xl">
        {/* Left column: Visualizer */}
        <div className="bg-[#141414] border-b lg:border-b-0 lg:border-r border-border-subtle p-0 h-[420px] w-full min-w-0">
          <SortingCanvas />
        </div>

        {/* Right column: Code Panel */}
        <div className="bg-[#0f0f0f] h-[420px] w-full min-w-0 flex flex-col">
          <CodePanel />
        </div>
      </div>

      {/* Controls Bar (Horizontal flex block) */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-surface border border-border-subtle mb-6 shadow-lg">
        <PlayPauseButton />
        
        <div className="flex-1 w-full min-w-[200px]">
          <TimelineScrubber />
        </div>

        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
          <SpeedSlider />
          <ArraySizeInput />
        </div>
      </div>

      {/* Metrics Section (sits below Controls Bar) */}
      <div>
        <MetricsPanel />
      </div>
    </div>
  );
}
