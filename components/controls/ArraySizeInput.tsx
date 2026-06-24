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
    <div className="flex flex-col gap-1 bg-card border border-border-strong rounded-xl px-4 py-2 shadow-lg min-w-[160px] justify-center">
      <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
        <span>Size</span>
        <span className="text-code font-bold">{arraySize}</span>
      </div>
      <input
        type="range"
        min={5}
        max={100}
        value={arraySize}
        onChange={handleChange}
        disabled={isPlaying}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-compare disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
      />
    </div>
  );
};
