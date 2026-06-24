'use client';

import React, { useEffect } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { SortingCanvas } from '../../components/visualizers/SortingCanvas';
import { CodePanel } from '../../components/code/CodePanel';
import { AlgorithmSelector } from '../../components/controls/AlgorithmSelector';
import { ArraySizeInput } from '../../components/controls/ArraySizeInput';
import { SpeedSlider } from '../../components/controls/SpeedSlider';
import { PlayPauseButton } from '../../components/controls/PlayPauseButton';
import { MetricsPanel } from '../../components/controls/MetricsPanel';
import { TimelineScrubber } from '../../components/controls/TimelineScrubber';

export default function SortingPage() {
  const { generateNewArray } = useVisualizerStore();

  // Initialize array on mount
  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6 font-mono">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wider">
            Sorting Visualizer
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Observe comparisons, swaps, and recursive splits in real-time across popular sorting algorithms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateNewArray()}
            className="px-4 py-2 text-xs font-bold uppercase bg-slate-900 border border-border-strong rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200 cursor-pointer shadow-md"
          >
            Generate New Data
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
        {/* Left Side: Visualization + Playback HUD */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {/* Canvas container */}
          <div className="h-[400px]">
            <SortingCanvas />
          </div>

          {/* Controls HUD */}
          <div className="flex flex-col gap-4 bg-slate-900/40 border border-border-strong rounded-2xl p-5 shadow-xl">
            {/* Top row settings */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <AlgorithmSelector />
              <div className="flex items-center gap-4 flex-1 justify-end min-w-[320px]">
                <ArraySizeInput />
                <SpeedSlider />
              </div>
            </div>

            <div className="h-px bg-border-strong/50"></div>

            {/* Playback scrubber row */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <PlayPauseButton />
              <div className="flex-1 w-full">
                <TimelineScrubber />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Metrics Panel + Code Panel */}
        <div className="flex flex-col gap-6 lg:h-[615px]">
          {/* Metrics card */}
          <div className="flex-shrink-0">
            <MetricsPanel />
          </div>
          
          {/* Code panel taking up remaining space */}
          <div className="flex-1 min-h-[350px] lg:min-h-0">
            <CodePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
