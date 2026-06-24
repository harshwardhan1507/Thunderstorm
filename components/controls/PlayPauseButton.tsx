'use client';

import React, { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';

export const PlayPauseButton: React.FC = () => {
  const { isPlaying, setIsPlaying, stepForward, stepBackward, resetPlayback, currentStepIndex, steps, speed } = useVisualizerStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const run = () => {
        const { currentStepIndex, steps, stepForward } = useVisualizerStore.getState();
        if (currentStepIndex < steps.length - 1) {
          stepForward();
          timerRef.current = setTimeout(run, speed);
        } else {
          setIsPlaying(false);
        }
      };

      timerRef.current = setTimeout(run, speed);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, speed, setIsPlaying]);

  const togglePlay = () => {
    const { currentStepIndex, steps } = useVisualizerStore.getState();
    // If we finished, reset first
    if (currentStepIndex >= steps.length - 1) {
      resetPlayback();
    }
    setIsPlaying(!isPlaying);
  };

  const isAtStart = currentStepIndex === -1;
  const isAtEnd = steps.length > 0 && currentStepIndex === steps.length - 1;

  return (
    <div className="flex items-center gap-3 bg-card border border-border-strong rounded-xl px-4 py-2.5 shadow-lg">
      {/* Reset Button */}
      <button
        onClick={resetPlayback}
        className="p-2 text-slate-400 hover:text-slate-200 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={isAtStart}
        title="Reset"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 16h-2.118a6 6 0 10-1.89-6.57l.092-.092h-2.2v-2h6v6z" />
        </svg>
      </button>

      {/* Step Backward */}
      <button
        onClick={stepBackward}
        className="p-2 text-slate-400 hover:text-slate-200 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={isAtStart || isPlaying}
        title="Step Backward"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.447 5.223a1 1 0 00-1.553.848v3.428L3.447 6.07a1 1 0 00-1.553.848v6.164a1 1 0 001.553.848l3.447-3.428v3.428a1 1 0 001.553.848V6.071a1 1 0 00-1.553-.848z" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`p-3.5 rounded-full transition-all duration-250 cursor-pointer text-slate-900 font-bold shadow-md hover:scale-105 active:scale-95 ${
          isPlaying 
            ? 'bg-amber-400 hover:bg-amber-300' 
            : 'bg-compare hover:bg-blue-400 text-white'
        }`}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          // Pause Icon
          <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" clipRule="evenodd" />
          </svg>
        ) : (
          // Play Icon
          <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Step Forward */}
      <button
        onClick={stepForward}
        className="p-2 text-slate-400 hover:text-slate-200 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={isAtEnd || isPlaying}
        title="Step Forward"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 10a1 1 0 001-1V5.553a1 1 0 00-1.553-.848l-3.447 3.428V5.553a1 1 0 00-1.553-.848L1 8.133a1 1 0 000 1.696l3.447 3.428a1 1 0 001.553-.848V9.447l3.447 3.428A1 1 0 0010 12.181V10z" />
        </svg>
      </button>
    </div>
  );
};
