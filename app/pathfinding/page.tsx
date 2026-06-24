'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathfindingStore, PathfindingAlgorithmType } from '../../store/pathfindingStore';
import { GridCanvas } from '../../components/visualizers/GridCanvas';
import { CodePanel } from '../../components/code/CodePanel';
import { dijkstraSnippets } from '../../lib/snippets/pathfinding/dijkstra';
import { astarSnippets } from '../../lib/snippets/pathfinding/astar';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Clock, Activity, Flag, Route } from 'lucide-react';
import { AlgorithmExplanation } from '../../components/educational/AlgorithmExplanation';
import { ComplexityChart } from '../../components/educational/ComplexityChart';

const snippetMap = {
  dijkstra: dijkstraSnippets,
  astar: astarSnippets,
};

interface ChromePerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

export default function PathfindingPage() {
  const {
    rows,
    cols,
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    selectedAlgorithm,
    language,
    executionTime,
    setSelectedAlgorithm,
    setLanguage,
    setSpeed,
    setIsPlaying,
    setCurrentStepIndex,
    stepForward,
    stepBackward,
    resetPlayback,
    getMetrics,
    loadMaze,
    clearWalls,
  } = usePathfindingStore();

  const [heapMemory, setHeapMemory] = useState<string>('N/A');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize maze on mount
  useEffect(() => {
    loadMaze('clear');
  }, [loadMaze]);

  // Read memory heap usage (approximate check)
  useEffect(() => {
    const updateMemory = () => {
      const perf = typeof window !== 'undefined' ? (window.performance as ChromePerformance) : undefined;
      if (perf && perf.memory) {
        setHeapMemory(`${(perf.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB`);
      }
    };
    updateMemory();
    const interval = setInterval(updateMemory, 2000);
    return () => clearInterval(interval);
  }, []);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      const run = () => {
        const { currentStepIndex, steps, stepForward } = usePathfindingStore.getState();
        if (currentStepIndex < steps.length - 1) {
          stepForward();
          timerRef.current = setTimeout(run, speed);
        } else {
          setIsPlaying(false);
        }
      };
      timerRef.current = setTimeout(run, speed);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, speed, setIsPlaying]);

  const togglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      resetPlayback();
    }
    setIsPlaying(!isPlaying);
  };

  const activeSnippet = snippetMap[selectedAlgorithm]?.[language] || '';
  const activeLine = steps[currentStepIndex]?.line || -1;
  const { nodesVisited, pathLength } = getMetrics();

  // Scrubber percentage calculation
  const totalSteps = steps.length;
  const scrubberValue = currentStepIndex + 1;
  const percentage = totalSteps > 0 ? (scrubberValue / totalSteps) * 100 : 0;

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentStepIndex(val - 1);
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col font-sans select-none">
      {/* Breadcrumbs */}
      <div className="text-xs text-text-muted font-mono mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Pathfinding</span>
        <span>›</span>
        <span className="text-text-primary font-semibold">{selectedAlgorithm.toUpperCase()}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pathfinding</h1>
          <p className="text-text-secondary text-sm mt-1">
            Visualize shortest path algorithms on an interactive 2D grid
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadMaze('random')}
            disabled={isPlaying}
            className="px-3 py-1.5 text-xs font-bold uppercase bg-surface border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:bg-elevated transition duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Random Maze
          </button>
          <button
            onClick={() => loadMaze('border')}
            disabled={isPlaying}
            className="px-3 py-1.5 text-xs font-bold uppercase bg-surface border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:bg-elevated transition duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Border Partition
          </button>
          <button
            onClick={clearWalls}
            disabled={isPlaying}
            className="px-3 py-1.5 text-xs font-bold uppercase bg-surface border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:bg-elevated transition duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear Walls
          </button>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex gap-1 bg-[#141414]/40 border border-[#2a2a2a] rounded-lg p-0.5 self-start mb-6">
        <button
          onClick={() => setSelectedAlgorithm('dijkstra')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            selectedAlgorithm === 'dijkstra'
              ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
              : 'text-text-secondary hover:text-white hover:bg-elevated'
          }`}
        >
          Dijkstra's Algorithm
        </button>
        <button
          onClick={() => setSelectedAlgorithm('astar')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            selectedAlgorithm === 'astar'
              ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
              : 'text-text-secondary hover:text-white hover:bg-elevated'
          }`}
        >
          A* Search (Heuristic)
        </button>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-[#2a2a2a] mb-6 shadow-2xl">
        {/* Visualizer Canvas */}
        <div className="bg-[#141414] border-b lg:border-b-0 lg:border-r border-[#2a2a2a] p-0 h-[420px] w-full min-w-0">
          <GridCanvas />
        </div>

        {/* Code Panel */}
        <div className="bg-[#0f0f0f] h-[420px] w-full min-w-0 flex flex-col">
          <CodePanel
            code={activeSnippet}
            language={language}
            activeLine={activeLine}
            setLanguage={setLanguage}
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-surface border border-[#2a2a2a] mb-6 shadow-lg">
        {/* Play Pause Controls */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={resetPlayback}
            disabled={currentStepIndex === -1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-elevated border border-border-subtle text-text-secondary hover:text-white hover:border-border-default transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepBackward}
            disabled={currentStepIndex === -1 || isPlaying}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-elevated border border-border-subtle text-text-secondary hover:text-white hover:border-border-default transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step Backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-purple text-white hover:bg-accent-violet transition duration-250 cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.4)] active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={stepForward}
            disabled={totalSteps === 0 || currentStepIndex === totalSteps - 1 || isPlaying}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-elevated border border-border-subtle text-text-secondary hover:text-white hover:border-border-default transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 w-full min-w-[200px] flex items-center gap-3 font-mono">
          <span className="text-text-muted text-xs w-6 text-center">0</span>
          <div className="relative flex-1 flex items-center h-6 cursor-pointer">
            <div className="absolute left-0 right-0 h-1.5 bg-highlight rounded-full pointer-events-none border border-border-subtle/50"></div>
            <div
              className="absolute left-0 h-1.5 bg-accent-purple rounded-full pointer-events-none"
              style={{ width: `${percentage}%` }}
            ></div>
            <input
              type="range"
              min={0}
              max={totalSteps}
              value={scrubberValue}
              onChange={handleScrubberChange}
              disabled={totalSteps === 0 || isPlaying}
              className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer disabled:cursor-not-allowed focus:outline-none z-10
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-purple [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(124,58,237,0.8)] [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
                [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-125
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-purple [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(124,58,237,0.8)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150
                [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-125"
            />
          </div>
          <span className="text-text-secondary text-xs whitespace-nowrap min-w-[70px] text-right">
            {scrubberValue} / {totalSteps}
          </span>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Speed:</span>
            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={205 - speed} // inverse speed since lower is faster
              onChange={(e) => setSpeed(205 - parseInt(e.target.value, 10))}
              className="w-24 h-1.5 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
            />
            <span className="text-text-primary text-xs w-12 text-right">
              {((205 - speed) / 10).toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Nodes Visited */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Nodes Visited</span>
              <Flag className="w-3.5 h-3.5 text-text-secondary" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">{nodesVisited}</div>
          </div>

          {/* Path Length */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Path Length</span>
              <Route className="w-3.5 h-3.5 text-text-secondary" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">
              {pathLength > 0 ? `${pathLength} cells` : 'No path'}
            </div>
          </div>

          {/* Execution Time */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Time</span>
              <Clock className="w-3.5 h-3.5 text-text-secondary" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">
              {executionTime.toFixed(2)}ms
            </div>
          </div>

          {/* Heap Memory */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Heap</span>
              <Activity className="w-3.5 h-3.5 text-text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono leading-none mt-1">{heapMemory}</div>
              {heapMemory !== 'N/A' && (
                <div className="text-[9px] text-text-muted mt-1 leading-none font-mono">Chrome only, approx</div>
              )}
            </div>
          </div>
        </div>

        {/* Complexity Badges */}
        <div className="flex gap-2.5 mt-2 flex-wrap font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-elevated border border-border-default text-xs font-semibold text-text-secondary shadow-sm">
            Dijkstra Complexity: <span className="text-success">O((V + E) log V)</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-elevated border border-border-default text-xs font-semibold text-text-secondary shadow-sm">
            A* Complexity: <span className="text-success">O(E log V) average</span>
          </span>
        </div>
      </div>

      {/* Instructions overlay */}
      {!isPlaying && (
        <div className="mt-6 bg-[#0f0f0f]/80 border border-[#2a2a2a] rounded-xl p-4 text-xs text-text-secondary font-mono">
          <span className="text-white font-bold block mb-1">Grid Canvas Instructions:</span>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click and drag empty cells to **draw wall obstacles**.</li>
            <li>Click and drag a wall cell to **erase walls**.</li>
            <li>Drag the **green pointer** to relocate the Start Node.</li>
            <li>Drag the **red target** to relocate the End Node.</li>
          </ul>
        </div>
      )}

      {/* Educational Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <AlgorithmExplanation algorithmId={selectedAlgorithm} />
        </div>
        <div>
          <ComplexityChart activeComplexity="O(n log n)" />
        </div>
      </div>
    </div>
  );
}
