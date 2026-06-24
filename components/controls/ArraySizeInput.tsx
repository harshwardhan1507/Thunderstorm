'use client';

import React from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';

export const ArraySizeInput: React.FC = () => {
  const { arraySize, setArraySize, isPlaying } = useVisualizerStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setArraySize(size);
  };

  return (
    <div className="flex flex-col gap-1 min-w-[120px] justify-center select-none font-sans">
      <div className="flex justify-between items-center text-xs text-text-secondary font-bold">
        <span>Size</span>
        <span className="text-accent-purple">{arraySize}</span>
      </div>
      <input
        type="range"
        min={5}
        max={100}
        value={arraySize}
        onChange={handleChange}
        disabled={isPlaying}
        className="w-full h-1 bg-border-default rounded-lg appearance-none cursor-pointer accent-accent-purple disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
      />
    </div>
  );
};
