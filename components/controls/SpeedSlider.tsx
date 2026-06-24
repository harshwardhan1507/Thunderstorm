'use client';

import React from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';

const SPEED_STEPS = [
  { label: '0.25x', value: 800 },
  { label: '0.5x', value: 400 },
  { label: '1x', value: 100 },
  { label: '2.5x', value: 40 },
  { label: '10x', value: 10 },
  { label: '25x', value: 4 }
];

export const SpeedSlider: React.FC = () => {
  const { speed, setSpeed } = useVisualizerStore();

  // Find current step index based on the speed value
  const currentIndex = SPEED_STEPS.findIndex((s) => s.value === speed);
  const activeIndex = currentIndex === -1 ? 2 : currentIndex; // default to 1x

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSpeed(SPEED_STEPS[val].value);
  };

  return (
    <div className="flex flex-col gap-1 min-w-[120px] justify-center select-none font-sans">
      <div className="flex justify-between items-center text-xs text-text-secondary font-bold">
        <span>Speed</span>
        <span className="text-accent-purple">{SPEED_STEPS[activeIndex].label}</span>
      </div>
      <input
        type="range"
        min={0}
        max={SPEED_STEPS.length - 1}
        value={activeIndex}
        onChange={handleChange}
        className="w-full h-1 bg-border-default rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
      />
    </div>
  );
};
