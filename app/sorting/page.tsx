'use client';
import React, { useEffect, useState, Suspense, useCallback } from 'react';
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
import { Share2, RefreshCw } from 'lucide-react';

export default function SortingPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center text-[#555555] font-mono text-xs">
        Loading Sorting Visualizer...
      </div>
    }>
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

  const handleRestoreFromUrl = useCallback((params: Record<string, string>) => {
    if (params.algo) setSelectedAlgorithm(params.algo as SortingAlgorithmType);
    if (params.size) setArraySize(Number(params.size));
    if (params.speed) setSpeed(Number(params.speed));
  }, [setSelectedAlgorithm, setArraySize, setSpeed]);

  const { updateUrl } = useDeepLinking(
    () => ({ algo: selectedAlgorithm, size: arraySize, speed }),
    handleRestoreFromUrl
  );

  useEffect(() => {
    const hasParams = typeof window !== 'undefined' && new URLSearchParams(window.location.search).size > 0;
    if (!hasParams) generateNewArray();
  }, [generateNewArray]);

  useEffect(() => { updateUrl(); }, [selectedAlgorithm, arraySize, speed, updateUrl]);

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
    <div className="flex-1 w-full px-6 py-6 flex flex-col select-none">
      {/* Breadcrumb */}
      <div className="text-xs text-[#555555] font-mono mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#888888] transition-colors">Home</Link>
        <span>›</span>
        <span className="text-[#888888]">Sorting</span>
        <span>›</span>
        <span className="text-[#f0f0f0] font-semibold">{algoLabel}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sorting</h1>
          <p className="text-[#888888] text-sm mt-1">
            Visualize and compare sorting algorithms step-by-step
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141414] hover:bg-[#1c1c1c] border border-[#333333] rounded-lg text-[#f0f0f0] text-xs font-semibold transition-all duration-150 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            onClick={() => generateNewArray()}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#141414] hover:bg-[#1c1c1c] border border-[#333333] rounded-lg text-[#f0f0f0] text-xs font-semibold transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Data
          </button>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex gap-1 bg-[#141414] border border-[#2a2a2a] rounded-lg p-1 self-start mb-6">
        {algos.map((algo) => (
          <button
            key={algo.key}
            onClick={() => setSelectedAlgorithm(algo.key)}
            disabled={isPlaying}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              selectedAlgorithm === algo.key
                ? 'bg-[#232323] text-white shadow-sm'
                : 'text-[#888888] hover:text-white hover:bg-[#1c1c1c]'
            }`}
          >
            {algo.label}
          </button>
        ))}
      </div>

      {/* Split-View: Visualizer + Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden border border-[#2a2a2a] mb-4 shadow-2xl relative">
        {/* Left: Visualizer */}
        <div className="bg-[#141414] border-b lg:border-b-0 lg:border-r border-[#2a2a2a] h-[420px] relative">
          <SortingCanvas />
          <ThunderBurst
            show={isFinished}
            title={`${algoLabel} Completed`}
            metricsText={`Dataset Size: ${arraySize} elements\nComparisons: ${metrics.comparisons}\nSwaps: ${metrics.swaps}\nTime: ${executionTime.toFixed(2)}ms`}
          />
        </div>
        {/* Right: Code Panel */}
        <div className="bg-[#0f0f0f] h-[420px] flex flex-col">
          <CodePanel />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] mb-4">
        <PlayPauseButton />
        <div className="flex-1 w-full min-w-[160px]">
          <TimelineScrubber />
        </div>
        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
          <SpeedSlider />
          <ArraySizeInput />
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricsPanel />

      {/* Educational Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={algoLabel}
        metrics={{ size: arraySize, comparisons: metrics.comparisons, swaps: metrics.swaps, executionTime }}
      />
    </div>
  );
}
