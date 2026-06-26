'use client';

import React, { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useGraphStore, GraphAlgorithmType } from '../../store/graphStore';
import { GraphCanvas } from '../../components/visualizers/GraphCanvas';
import { CodePanel } from '../../components/code/CodePanel';
import { bfsSnippets } from '../../lib/snippets/graphs/bfs';
import { dfsSnippets } from '../../lib/snippets/graphs/dfs';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Clock, Activity, Share2, Compass } from 'lucide-react';
import { AlgorithmExplanation } from '../../components/educational/AlgorithmExplanation';
import { ComplexityChart } from '../../components/educational/ComplexityChart';
import { useDeepLinking } from '../../lib/hooks/useDeepLinking';
import { ShareModal } from '../../components/controls/ShareModal';
import { ThunderBurst } from '../../components/visualizers/ThunderBurst';

const snippetMap = {
  bfs: bfsSnippets,
  dfs: dfsSnippets,
};

interface ChromePerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

export default function GraphsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#555555] font-mono text-xs">Loading Graphs Visualizer...</div>}>
      <GraphsPageInner />
    </Suspense>
  );
}

function GraphsPageInner() {
  const {
    nodes,
    edges,
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
    loadPreset,
    startNodeId,
    setStartNodeId,
  } = useGraphStore();

  const [heapMemory, setHeapMemory] = useState<string>('N/A');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'metrics' | 'code' | 'explanation'>('visualizer');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Wire Deep Linking
  const handleRestoreFromUrl = useCallback((params: Record<string, string>) => {
    if (params.algo) setSelectedAlgorithm(params.algo as GraphAlgorithmType);
    if (params.speed) setSpeed(Number(params.speed));
    if (params.startNode) setStartNodeId(params.startNode);
  }, [setSelectedAlgorithm, setSpeed, setStartNodeId]);

  const { updateUrl } = useDeepLinking(
    () => ({
      algo: selectedAlgorithm,
      speed: speed,
      startNode: startNodeId,
    }),
    handleRestoreFromUrl
  );

  // Initialize graph on mount if not deep linked
  useEffect(() => {
    const hasParams = typeof window !== 'undefined' && new URLSearchParams(window.location.search).size > 0;
    if (!hasParams) {
      loadPreset('default');
    }
  }, [loadPreset]);

  // Sync state back to URL when these variables change
  useEffect(() => {
    updateUrl();
  }, [selectedAlgorithm, speed, startNodeId, updateUrl]);

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
        const { currentStepIndex, steps, stepForward } = useGraphStore.getState();
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

  const algoLabel = selectedAlgorithm === 'bfs' ? 'BFS (Breadth-First Search)' : 'DFS (Depth-First Search)';
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

  const isFinished = steps.length > 0 && currentStepIndex === steps.length - 1 && !isPlaying;

  return (
    <div className="flex-1 w-full px-6 py-6 flex flex-col select-none">
      {/* Breadcrumbs */}
      <div className="text-xs text-[#555555] font-mono mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#888888] transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-[#888888]">Graphs</span>
        <span>›</span>
        <span className="text-[#f0f0f0] font-semibold">{selectedAlgorithm.toUpperCase()}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Graphs</h1>
          <p className="text-[#888888] text-sm mt-1">
            Visualize graph traversal algorithms (BFS and DFS) step-by-step
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 bg-[#141414] hover:bg-[#1c1c1c] border border-[#333333] rounded-lg text-[#f0f0f0] hover:text-white transition duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Share Configuration"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex gap-1 bg-[#141414] border border-[#2a2a2a] rounded-lg p-1 self-start mb-6">
        <button
          onClick={() => setSelectedAlgorithm('bfs')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            selectedAlgorithm === 'bfs'
              ? 'bg-[#232323] text-white shadow-sm'
              : 'text-[#888888] hover:text-white hover:bg-[#1c1c1c]'
          }`}
        >
          Breadth-First Search (BFS)
        </button>
        <button
          onClick={() => setSelectedAlgorithm('dfs')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            selectedAlgorithm === 'dfs'
              ? 'bg-[#232323] text-white shadow-sm'
              : 'text-[#888888] hover:text-white hover:bg-[#1c1c1c]'
          }`}
        >
          Depth-First Search (DFS)
        </button>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex lg:hidden gap-1 bg-[#141414]/60 border border-[#2a2a2a] rounded-lg p-0.5 mb-6 w-full overflow-x-auto">
        {(['visualizer', 'metrics', 'code', 'explanation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? 'bg-[#7c3aed] text-white shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:rounded-xl lg:overflow-hidden lg:border lg:border-[#2a2a2a] mb-6 shadow-2xl relative">
        {/* Visualizer Canvas */}
        <div className={`bg-[#141414] border-[#2a2a2a] p-0 h-[420px] w-full min-w-0 relative border rounded-xl lg:border-none lg:rounded-none lg:border-r ${activeTab === 'visualizer' ? 'block' : 'hidden lg:block'}`}>
          <GraphCanvas />
          <ThunderBurst
            show={isFinished}
            title={`${selectedAlgorithm.toUpperCase()} Completed`}
            metricsText={`Nodes Visited: ${nodesVisited}\nPath Length: ${pathLength} edges\nTime: ${executionTime.toFixed(2)}ms`}
          />
        </div>

        {/* Code Panel */}
        <div className={`bg-[#0f0f0f] h-[420px] w-full min-w-0 flex flex-col border border-[#2a2a2a] rounded-xl lg:border-none lg:rounded-none ${activeTab === 'code' ? 'block' : 'hidden lg:block'}`}>
          <CodePanel
            code={activeSnippet}
            language={language}
            activeLine={activeLine}
            setLanguage={setLanguage}
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className={`flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] mb-6 shadow-lg ${activeTab === 'visualizer' || activeTab === 'metrics' ? 'flex' : 'hidden lg:flex'}`}>
        {/* Play Playback Controls */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={resetPlayback}
            disabled={currentStepIndex === -1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#888888] hover:text-white hover:border-[#333333] transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepBackward}
            disabled={currentStepIndex === -1 || isPlaying}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#888888] hover:text-white hover:border-[#333333] transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step Backward"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#7c3aed] text-white hover:bg-[#8b5cf6] transition duration-250 cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.4)] active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={stepForward}
            disabled={totalSteps === 0 || currentStepIndex === totalSteps - 1 || isPlaying}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-[#888888] hover:text-white hover:border-[#333333] transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 w-full min-w-[200px] flex items-center gap-3 font-mono">
          <span className="text-[#555555] text-xs w-6 text-center">0</span>
          <div className="relative flex-1 flex items-center h-6 cursor-pointer">
            <div className="absolute left-0 right-0 h-1.5 bg-[#232323] rounded-full pointer-events-none border border-[#2a2a2a]/50"></div>
            <div
              className="absolute left-0 h-1.5 bg-[#7c3aed] rounded-full pointer-events-none"
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
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#7c3aed] [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(124,58,237,0.8)] [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
                [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-125
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#7c3aed] [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(124,58,237,0.8)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150
                [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-125"
            />
          </div>
          <span className="text-[#888888] text-xs whitespace-nowrap min-w-[70px] text-right">
            {scrubberValue} / {totalSteps}
          </span>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#555555] text-[11px] font-bold uppercase tracking-wider">Speed:</span>
            <input
              type="range"
              min={100}
              max={1500}
              step={100}
              value={1600 - speed} // inverse speed since lower is faster
              onChange={(e) => setSpeed(1600 - parseInt(e.target.value, 10))}
              className="w-24 h-1.5 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
            />
            <span className="text-[#f0f0f0] text-xs w-12 text-right">
              {((1600 - speed) / 100).toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className={`flex flex-col gap-4 w-full ${activeTab === 'metrics' ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Nodes Visited */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#333333] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#555555] text-[11px] font-bold uppercase tracking-wider">Nodes Visited</span>
              <Compass className="w-3.5 h-3.5 text-[#555555]" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">{nodesVisited}</div>
          </div>

          {/* Path Length / Edges Traversed */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#333333] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#555555] text-[11px] font-bold uppercase tracking-wider">Path Length</span>
              <Compass className="w-3.5 h-3.5 text-[#555555]" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">{pathLength}</div>
          </div>

          {/* Execution Time */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#333333] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#555555] text-[11px] font-bold uppercase tracking-wider">Time</span>
              <Clock className="w-3.5 h-3.5 text-[#555555]" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">
              {executionTime.toFixed(2)}ms
            </div>
          </div>

          {/* Heap Memory */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] hover:border-[#333333] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#555555] text-[11px] font-bold uppercase tracking-wider">Heap</span>
              <Activity className="w-3.5 h-3.5 text-[#555555]" />
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono leading-none mt-1">{heapMemory}</div>
              {heapMemory !== 'N/A' && (
                <div className="text-[9px] text-[#555555] mt-1 leading-none font-mono">Chrome only, approx</div>
              )}
            </div>
          </div>
        </div>

        {/* Complexity Badges */}
        <div className="flex gap-2.5 mt-2 flex-wrap font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-xs font-semibold text-[#888888]">
            Time Complexity: <span className="text-[#22C55E]">O(V + E)</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-xs font-semibold text-[#888888]">
            Space Complexity: <span className="text-[#60A5FA]">O(V)</span>
          </span>
        </div>
      </div>

      {/* Educational Panels */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 ${activeTab === 'explanation' ? 'grid' : 'hidden lg:grid'}`}>
        <div className="md:col-span-2">
          <AlgorithmExplanation algorithmId={selectedAlgorithm} />
        </div>
        <div>
          <ComplexityChart activeComplexity="O(n)" />
        </div>
      </div>

      {/* Share Modal overlay */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={algoLabel}
        metrics={{
          nodesVisited,
          pathLength,
          executionTime,
        }}
      />
    </div>
  );
}
