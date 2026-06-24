'use client';

import React from 'react';
import { useVisualizerStore, SortingAlgorithmType } from '../../store/visualizerStore';

export const AlgorithmSelector: React.FC = () => {
  const { selectedAlgorithm, setSelectedAlgorithm, isPlaying } = useVisualizerStore();

  const algorithms: { key: SortingAlgorithmType; label: string }[] = [
    { key: 'bubble', label: 'Bubble Sort' },
    { key: 'quick', label: 'Quick Sort' },
    { key: 'merge', label: 'Merge Sort' },
    { key: 'heap', label: 'Heap Sort' }
  ];

  return (
    <div className="flex bg-card border border-border-strong rounded-xl p-1 shadow-lg overflow-x-auto max-w-full">
      {algorithms.map((algo) => (
        <button
          key={algo.key}
          onClick={() => setSelectedAlgorithm(algo.key)}
          disabled={isPlaying}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${
            selectedAlgorithm === algo.key
              ? 'bg-compare text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          {algo.label}
        </button>
      ))}
    </div>
  );
};
