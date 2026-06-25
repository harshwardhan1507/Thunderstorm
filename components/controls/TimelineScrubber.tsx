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
    <div className="flex items-center gap-3 w-full select-none font-mono">
      <span className="text-[#555555] text-xs w-6 text-center">0</span>

      <div className="relative flex-1 flex items-center h-6 cursor-pointer">
        {/* Custom filled track visualization */}
        <div className="absolute left-0 right-0 h-1.5 bg-[#232323] rounded-full pointer-events-none border border-[#2a2a2a]/50"></div>
        <div
          className="absolute left-0 h-1.5 bg-[#7c3aed] rounded-full pointer-events-none"
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
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#7c3aed] [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(124,58,237,0.8)] [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-125
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#7c3aed] [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(124,58,237,0.8)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150
            [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-125"
        />
      </div>

      <span className="text-[#888888] text-xs whitespace-nowrap min-w-[70px] text-right">
        {value} / {totalSteps}
      </span>
    </div>
  );
};
