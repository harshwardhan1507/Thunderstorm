'use client';

import React, { useEffect, useState, Suspense } from 'react';
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
import { AlgorithmExplanation } from '../../components/educational/AlgorithmExplanation';
import { ComplexityChart } from '../../components/educational/ComplexityChart';
import { useDeepLinking } from '../../lib/hooks/useDeepLinking';
import { ShareModal } from '../../components/controls/ShareModal';
import { ThunderBurst } from '../../components/visualizers/ThunderBurst';
import { Share2 } from 'lucide-react';

export default function SortingPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-text-muted font-mono text-xs">Loading Sorting Visualizer...</div>}>
      <SortingPageInner />
    </Suspense>
  );
}

function SortingPageInner() {
  const {
    generateNewArray,
    selectedAlgorithm,
    setSelectedAlgorithm,
    isPlaying,
    arraySize,
    setArraySize,
    speed,
    setSpeed,
    getMetrics,
    steps,
    currentStepIndex,
    executionTime,
  } = useVisualizerStore();

  const [isShareOpen, setIsShareOpen] = useState(false);

  // Wire Deep Linking
  const { updateUrl } = useDeepLinking(
    () => ({
      algo: selectedAlgorithm,
      size: arraySize,
      speed: speed,
    }),
    (params) => {
      if (params.algo) setSelectedAlgorithm(params.algo as SortingAlgorithmType);
      if (params.size) setArraySize(Number(params.size));
      if (params.speed) setSpeed(Number(params.speed));
    }
  );

  // Initialize array on mount if not deep linked
  useEffect(() => {
    const hasParams = typeof window !== 'undefined' && new URLSearchParams(window.location.search).size > 0;
    if (!hasParams) {
      generateNewArray();
    }
  }, [generateNewArray]);

  // Sync state back to URL when these variables change
  useEffect(() => {
    updateUrl();
  }, [selectedAlgorithm, arraySize, speed]);

  const algoLabel = SORTING_ALGORITHMS_METADATA[selectedAlgorithm]?.name || 'Sorting';

  const algos: { key: SortingAlgorithmType; label: string }[] = [
    { key: 'bubble', label: 'Bubble Sort' },
    { key: 'merge', label: 'Merge Sort' },
    { key: 'quick', label: 'Quick Sort' },
    { key: 'heap', label: 'Heap Sort' },
  ];

  const metrics = getMetrics();
  const isFinished = steps.length > 0 && currentStepIndex === steps.length - 1 && !isPlaying;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col font-sans select-none relative">
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
            onClick={() => setIsShareOpen(true)}
            className="p-2 bg-surface hover:bg-elevated border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:text-white transition duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Share Configuration"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={() => generateNewArray()}
            disabled={isPlaying}
            className="px-4 py-2 text-xs font-bold uppercase bg-surface border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:bg-elevated transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate New Data
          </button>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex gap-1 bg-[#141414]/40 border border-[#2a2a2a] rounded-lg p-0.5 self-start mb-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-[#2a2a2a] mb-6 shadow-2xl relative">
        {/* Left column: Visualizer */}
        <div className="bg-[#141414] border-b lg:border-b-0 lg:border-r border-[#2a2a2a] p-0 h-[420px] w-full min-w-0 relative">
          <SortingCanvas />
          <ThunderBurst
            show={isFinished}
            title={`${algoLabel} Completed`}
            metricsText={`Dataset Size: ${arraySize} elements\nComparisons: ${metrics.comparisons}\nSwaps: ${metrics.swaps}\nTime: ${executionTime.toFixed(2)}ms`}
          />
        </div>

        {/* Right column: Code Panel */}
        <div className="bg-[#0f0f0f] h-[420px] w-full min-w-0 flex flex-col">
          <CodePanel />
        </div>
      </div>

      {/* Controls Bar (Horizontal flex block) */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-surface border border-[#2a2a2a] mb-6 shadow-lg">
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

      {/* Educational Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <AlgorithmExplanation algorithmId={selectedAlgorithm} />
        </div>
        <div>
          <ComplexityChart
            activeComplexity={
              selectedAlgorithm === 'bubble'
                ? 'O(n^2)'
                : selectedAlgorithm === 'quick' || selectedAlgorithm === 'merge' || selectedAlgorithm === 'heap'
                ? 'O(n log n)'
                : 'O(n)'
            }
          />
        </div>
      </div>

      {/* Share Modal overlay */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={algoLabel}
        metrics={{
          size: arraySize,
          comparisons: metrics.comparisons,
          swaps: metrics.swaps,
          executionTime,
        }}
      />
    </div>
  );
}
