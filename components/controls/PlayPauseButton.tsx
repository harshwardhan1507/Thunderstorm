'use client';

import React, { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

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
    <div className="flex items-center gap-2 select-none">
      {/* Reset/Restart */}
      <button
        onClick={resetPlayback}
        disabled={isAtStart}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#888888] hover:text-white hover:border-[#333333] transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        title="Reset"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Step Backward */}
      <button
        onClick={stepBackward}
        disabled={isAtStart || isPlaying}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#888888] hover:text-white hover:border-[#333333] transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        title="Step Backward"
      >
        <SkipBack className="w-3.5 h-3.5" />
      </button>

      {/* Play/Pause (Primary, larger) */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#7c3aed] text-white hover:bg-[#8b5cf6] transition duration-250 cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.4)] active:scale-95"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Step Forward */}
      <button
        onClick={stepForward}
        disabled={isAtEnd || isPlaying}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#888888] hover:text-white hover:border-[#333333] transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        title="Step Forward"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
