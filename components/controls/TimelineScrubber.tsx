'use client';

import React from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';

export const TimelineScrubber: React.FC = () => {
  const { currentStepIndex, steps, setCurrentStepIndex, isPlaying } = useVisualizerStore();

  const totalSteps = steps.length;
  // Progress goes from 0 (index -1) to totalSteps (index totalSteps-1)
  const value = currentStepIndex + 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentStepIndex(val - 1);
  };

  const percentage = totalSteps > 0 ? (value / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-col gap-2 w-full bg-card border border-border-strong rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 font-mono">
        <span>Timeline Playback</span>
        <span className="text-code font-bold">
          Step {value} / {totalSteps} ({totalSteps > 0 ? Math.round(percentage) : 0}%)
        </span>
      </div>

      <div className="relative w-full flex items-center h-6">
        {/* Custom filled track visualization */}
        <div className="absolute left-0 right-0 h-1.5 bg-slate-800 rounded-lg pointer-events-none border border-border-strong/50"></div>
        <div
          className="absolute left-0 h-1.5 bg-compare rounded-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
        ></div>

        <input
          type="range"
          min={0}
          max={totalSteps}
          value={value}
          onChange={handleChange}
          disabled={totalSteps === 0 || isPlaying}
          className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer disabled:cursor-not-allowed focus:outline-none z-10
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.8)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-compare [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-125
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.8)] [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-compare [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150
            [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-125"
        />
      </div>
    </div>
  );
};
