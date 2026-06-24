'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Trophy } from 'lucide-react';
import { useCompareStore, CompareInstanceState } from '../../store/compareStore';
import { CompareCanvas } from '../../components/visualizers/CompareCanvas';
import { SORTING_ALGORITHMS_METADATA } from '../../lib/algorithms/metadata';
import { SortingAlgorithmType } from '../../types/algorithm.types';

export default function ComparePage() {
  const {
    left,
    right,
    isPlaying,
    speed,
    arraySize,
    mode,
    winner,
    setMode,
    setSelectedAlgorithm,
    setArraySize,
    setSpeed,
    setIsPlaying,
    generateNewArrays,
    stepForwardBoth,
    stepBackwardBoth,
    resetBothPlayback,
    getMetrics,
  } = useCompareStore();

  // Initialize arrays on mount
  useEffect(() => {
    generateNewArrays();
  }, [generateNewArrays]);

  const algos: { key: SortingAlgorithmType; label: string }[] = [
    { key: 'bubble', label: 'Bubble Sort' },
    { key: 'merge', label: 'Merge Sort' },
    { key: 'quick', label: 'Quick Sort' },
    { key: 'heap', label: 'Heap Sort' },
  ];

  const metrics = getMetrics();

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col font-sans select-none">
      {/* Breadcrumb Bar */}
      <div className="text-xs text-text-muted font-mono mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Practice</span>
        <span>›</span>
        <span className="text-text-primary font-semibold">Compare & Battle</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compare & Battle</h1>
          <p className="text-text-secondary text-sm mt-1">
            Analyze two sorting algorithms side-by-side or race them head-to-head.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateNewArrays()}
            disabled={isPlaying}
            className="px-4 py-2 text-xs font-bold uppercase bg-surface border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:bg-elevated transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate New Data
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-1 bg-[#141414]/40 border border-[#2a2a2a] rounded-lg p-0.5 self-start mb-6">
        <button
          onClick={() => setMode('compare')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            mode === 'compare'
              ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
              : 'text-text-secondary hover:text-white hover:bg-elevated'
          }`}
        >
          Compare Mode (Sync)
        </button>
        <button
          onClick={() => setMode('battle')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            mode === 'battle'
              ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
              : 'text-text-secondary hover:text-white hover:bg-elevated'
          }`}
        >
          Battle Mode (Race)
        </button>
      </div>

      {/* Main Dual Visualizer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Algorithm Panel */}
        <div className="flex flex-col bg-surface border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
          {/* Header Selector */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#0a0a0a]/50 border-b border-[#2a2a2a]">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-purple font-mono">
              Left Algorithm
            </span>
            <select
              value={left.selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm('left', e.target.value as SortingAlgorithmType)}
              disabled={isPlaying}
              className="bg-base border border-[#333333] hover:border-text-secondary text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer outline-none focus:border-accent-purple"
            >
              {algos.map((algo) => (
                <option key={algo.key} value={algo.key}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Canvas Wrapper */}
          <div className="bg-[#141414] h-[300px] w-full border-b border-[#2a2a2a] p-0">
            <CompareCanvas side="left" />
          </div>

          {/* Metrics Footer */}
          <div className="p-4 grid grid-cols-3 gap-2 bg-[#0c0c0c] text-center">
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Comparisons</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.left.comparisons}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Swaps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.left.swaps}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Steps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.left.steps}</div>
            </div>
          </div>
        </div>

        {/* Right Algorithm Panel */}
        <div className="flex flex-col bg-surface border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
          {/* Header Selector */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#0a0a0a]/50 border-b border-[#2a2a2a]">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-violet font-mono">
              Right Algorithm
            </span>
            <select
              value={right.selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm('right', e.target.value as SortingAlgorithmType)}
              disabled={isPlaying}
              className="bg-base border border-[#333333] hover:border-text-secondary text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer outline-none focus:border-accent-violet"
            >
              {algos.map((algo) => (
                <option key={algo.key} value={algo.key}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Canvas Wrapper */}
          <div className="bg-[#141414] h-[300px] w-full border-b border-[#2a2a2a] p-0">
            <CompareCanvas side="right" />
          </div>

          {/* Metrics Footer */}
          <div className="p-4 grid grid-cols-3 gap-2 bg-[#0c0c0c] text-center">
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Comparisons</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.right.comparisons}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Swaps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.right.swaps}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Steps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.right.steps}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar (Unified Playback controls) */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-surface border border-[#2a2a2a] mb-6 shadow-lg">
        {/* Playback Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={stepBackwardBoth}
            disabled={isPlaying}
            title="Step Backward"
            className="w-10 h-10 rounded-lg border border-[#333333] hover:border-text-secondary text-text-primary hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-12 h-12 rounded-lg bg-gradient-to-r from-accent-purple to-indigo-700 hover:from-accent-violet hover:to-accent-purple text-white flex items-center justify-center transition shadow-md cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button
            onClick={stepForwardBoth}
            disabled={isPlaying}
            title="Step Forward"
            className="w-10 h-10 rounded-lg border border-[#333333] hover:border-text-secondary text-text-primary hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={resetBothPlayback}
            title="Reset"
            className="w-10 h-10 rounded-lg border border-[#333333] hover:border-text-secondary text-text-primary hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex-1 w-full md:w-auto flex flex-col gap-1.5 min-w-[150px]">
          <div className="flex justify-between items-center text-xs font-mono text-text-secondary">
            <span>Playback Speed</span>
            <span className="text-white">{(1000 / speed).toFixed(1)} steps/s</span>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={1010 - speed} // Reverse slider so right is faster
            onChange={(e) => setSpeed(1010 - parseInt(e.target.value))}
            className="w-full h-1 bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-purple"
          />
        </div>

        {/* Array Size Slider */}
        <div className="flex-1 w-full md:w-auto flex flex-col gap-1.5 min-w-[150px]">
          <div className="flex justify-between items-center text-xs font-mono text-text-secondary">
            <span>Array Size</span>
            <span className="text-white">{arraySize} items</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            disabled={isPlaying}
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value))}
            className="w-full h-1 bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-purple disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
