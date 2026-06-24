'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useDPStore, DPAlgorithmType } from '../../store/dpStore';
import { DPTable } from '../../components/visualizers/DPTable';
import { CodePanel } from '../../components/code/CodePanel';
import { lcsSnippets } from '../../lib/snippets/dp/lcs';
import { knapsackSnippets } from '../../lib/snippets/dp/knapsack';
import { fibonacciSnippets } from '../../lib/snippets/dp/fibonacci';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Clock, Activity, Grid3X3, Layers, Share2 } from 'lucide-react';
import { AlgorithmExplanation } from '../../components/educational/AlgorithmExplanation';
import { ComplexityChart } from '../../components/educational/ComplexityChart';
import { useDeepLinking } from '../../lib/hooks/useDeepLinking';
import { ShareModal } from '../../components/controls/ShareModal';
import { ThunderBurst } from '../../components/visualizers/ThunderBurst';

const snippetMap = {
  lcs: lcsSnippets,
  knapsack: knapsackSnippets,
  fibonacci: fibonacciSnippets,
};

interface ChromePerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

export default function DPPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-text-muted font-mono text-xs">Loading DP Visualizer...</div>}>
      <DPPageInner />
    </Suspense>
  );
}

function DPPageInner() {
  const {
    selectedAlgorithm,
    strA,
    strB,
    knapsackItems,
    knapsackCapacity,
    fibN,
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    language,
    executionTime,
    setSelectedAlgorithm,
    setLanguage,
    setSpeed,
    setIsPlaying,
    setCurrentStepIndex,
    updateLCSInputs,
    updateKnapsackInputs,
    updateFibInput,
    stepForward,
    stepBackward,
    resetPlayback,
    getMetrics,
    runAlgorithm,
  } = useDPStore();

  const [inputLcsA, setInputLcsA] = useState(strA);
  const [inputLcsB, setInputLcsB] = useState(strB);
  
  const [inputFibN, setInputFibN] = useState<string>(String(fibN));
  const [inputCapacity, setInputCapacity] = useState<string>(String(knapsackCapacity));

  const [heapMemory, setHeapMemory] = useState<string>('N/A');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'metrics' | 'code' | 'explanation'>('visualizer');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Wire Deep Linking
  const { updateUrl } = useDeepLinking(
    () => ({
      algo: selectedAlgorithm,
      speed: speed,
    }),
    (params) => {
      if (params.algo) setSelectedAlgorithm(params.algo as DPAlgorithmType);
      if (params.speed) setSpeed(Number(params.speed));
    }
  );

  // Initialize DP state on mount if not deep linked
  useEffect(() => {
    const hasParams = typeof window !== 'undefined' && new URLSearchParams(window.location.search).size > 0;
    if (!hasParams) {
      runAlgorithm();
    }
  }, [runAlgorithm]);

  // Sync state back to URL when these variables change
  useEffect(() => {
    updateUrl();
  }, [selectedAlgorithm, speed]);

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
        const { currentStepIndex, steps, stepForward } = useDPStore.getState();
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

  const handleLCSUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputLcsA && inputLcsB) {
      updateLCSInputs(inputLcsA.toUpperCase(), inputLcsB.toUpperCase());
    }
  };

  const handleFibUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputFibN, 10);
    if (!isNaN(val) && val >= 2 && val <= 12) {
      updateFibInput(val);
    }
  };

  const handleKnapsackUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseInt(inputCapacity, 10);
    if (!isNaN(cap)) {
      updateKnapsackInputs(knapsackItems, cap);
    }
  };

  const activeSnippet = snippetMap[selectedAlgorithm]?.[language] || '';
  const activeLine = steps[currentStepIndex]?.line || -1;
  const { activeVal, cellCalculatedCount } = getMetrics();

  // Scrubber percentage calculation
  const totalSteps = steps.length;
  const scrubberValue = currentStepIndex + 1;
  const percentage = totalSteps > 0 ? (scrubberValue / totalSteps) * 100 : 0;

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentStepIndex(val - 1);
  };

  const algoLabelMap = {
    lcs: 'LCS (Longest Common Subsequence)',
    knapsack: '0-1 Knapsack Problem',
    fibonacci: 'Fibonacci Tabulation',
  };

  const isFinished = steps.length > 0 && currentStepIndex === steps.length - 1 && !isPlaying;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col font-sans select-none relative">
      {/* Breadcrumbs */}
      <div className="text-xs text-text-muted font-mono mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Dynamic Programming</span>
        <span>›</span>
        <span className="text-text-primary font-semibold">{selectedAlgorithm.toUpperCase()}</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dynamic Programming</h1>
          <p className="text-text-secondary text-sm mt-1">
            Watch bottom-up tabulation tables fill cell-by-cell with interactive transitions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 bg-surface hover:bg-elevated border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:text-white transition duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Share Configuration"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* DP Algorithm Selection Tabs */}
      <div className="flex gap-1 bg-[#141414]/40 border border-[#2a2a2a] rounded-lg p-0.5 self-start mb-6">
        {(['lcs', 'knapsack', 'fibonacci'] as DPAlgorithmType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedAlgorithm(type)}
            disabled={isPlaying}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              selectedAlgorithm === type
                ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
                : 'text-text-secondary hover:text-white hover:bg-elevated'
            }`}
          >
            {algoLabelMap[type]}
          </button>
        ))}
      </div>

      {/* Dynamic Inputs Panel */}
      <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-[#2a2a2a] mb-6 shadow-md ${activeTab === 'visualizer' ? 'flex' : 'hidden lg:flex'}`}>
        {selectedAlgorithm === 'lcs' && (
          <form onSubmit={handleLCSUpdate} className="flex flex-wrap items-center gap-3 w-full">
            <span className="text-[10px] uppercase font-bold text-text-muted">Strings:</span>
            <input
              type="text"
              value={inputLcsA}
              onChange={(e) => setInputLcsA(e.target.value)}
              disabled={isPlaying}
              placeholder="String A"
              className="px-2.5 py-1.5 rounded bg-[#1a1a1a] border border-[#333333] text-xs text-white w-28 focus:outline-none focus:border-accent-purple transition"
            />
            <input
              type="text"
              value={inputLcsB}
              onChange={(e) => setInputLcsB(e.target.value)}
              disabled={isPlaying}
              placeholder="String B"
              className="px-2.5 py-1.5 rounded bg-[#1a1a1a] border border-[#333333] text-xs text-white w-28 focus:outline-none focus:border-accent-purple transition"
            />
            <button
              type="submit"
              disabled={isPlaying || !inputLcsA || !inputLcsB}
              className="px-3 py-1.5 rounded bg-accent-purple text-xs font-semibold text-white transition hover:bg-accent-violet cursor-pointer disabled:opacity-40"
            >
              Update Strings
            </button>
          </form>
        )}

        {selectedAlgorithm === 'knapsack' && (
          <form onSubmit={handleKnapsackUpdate} className="flex flex-wrap items-center gap-3 w-full">
            <span className="text-[10px] uppercase font-bold text-text-muted">Max Capacity:</span>
            <input
              type="number"
              min={2}
              max={10}
              value={inputCapacity}
              onChange={(e) => setInputCapacity(e.target.value)}
              disabled={isPlaying}
              className="px-2.5 py-1.5 rounded bg-[#1a1a1a] border border-[#333333] text-xs text-white w-20 focus:outline-none focus:border-accent-purple transition"
            />
            <button
              type="submit"
              disabled={isPlaying || !inputCapacity}
              className="px-3 py-1.5 rounded bg-accent-purple text-xs font-semibold text-white transition hover:bg-accent-violet cursor-pointer disabled:opacity-40"
            >
              Update Capacity
            </button>
            <span className="text-[10px] text-text-muted">Items: [wt: 1, v: 6], [wt: 2, v: 10], [wt: 3, v: 12], [wt: 5, v: 20]</span>
          </form>
        )}

        {selectedAlgorithm === 'fibonacci' && (
          <form onSubmit={handleFibUpdate} className="flex flex-wrap items-center gap-3 w-full">
            <span className="text-[10px] uppercase font-bold text-text-muted">N (Term Index):</span>
            <input
              type="number"
              min={2}
              max={12}
              value={inputFibN}
              onChange={(e) => setInputFibN(e.target.value)}
              disabled={isPlaying}
              className="px-2.5 py-1.5 rounded bg-[#1a1a1a] border border-[#333333] text-xs text-white w-20 focus:outline-none focus:border-accent-purple transition"
            />
            <button
              type="submit"
              disabled={isPlaying || !inputFibN}
              className="px-3 py-1.5 rounded bg-accent-purple text-xs font-semibold text-white transition hover:bg-accent-violet cursor-pointer disabled:opacity-40"
            >
              Update N
            </button>
            <span className="text-[10px] text-text-muted">N must be between 2 and 12 for canvas spacing</span>
          </form>
        )}
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex lg:hidden gap-1 bg-[#141414]/60 border border-[#2a2a2a] rounded-lg p-0.5 mb-6 w-full overflow-x-auto">
        {(['visualizer', 'metrics', 'code', 'explanation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? 'bg-accent-purple text-white shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:rounded-xl lg:overflow-hidden lg:border lg:border-[#2a2a2a] mb-6 shadow-2xl relative">
        {/* Visualizer Canvas */}
        <div className={`bg-[#141414] border-[#2a2a2a] p-0 h-[420px] w-full min-w-0 flex items-center justify-center border rounded-xl lg:border-none lg:rounded-none lg:border-r ${activeTab === 'visualizer' ? 'block' : 'hidden lg:block'} relative`}>
          <DPTable />
          <ThunderBurst
            show={isFinished}
            title={`${algoLabelMap[selectedAlgorithm]} Complete`}
            metricsText={`Cells Calculated: ${cellCalculatedCount}\nOptimal Result: ${activeVal !== null && activeVal !== undefined ? activeVal : '-'}\nTime: ${executionTime.toFixed(2)}ms`}
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
      <div className={`flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-surface border border-[#2a2a2a] mb-6 shadow-lg ${activeTab === 'visualizer' || activeTab === 'metrics' ? 'flex' : 'hidden lg:flex'}`}>
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
              min={100}
              max={1500}
              step={100}
              value={1600 - speed} // inverse speed since lower is faster
              onChange={(e) => setSpeed(1600 - parseInt(e.target.value, 10))}
              className="w-24 h-1.5 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
            />
            <span className="text-text-primary text-xs w-12 text-right">
              {((1600 - speed) / 100).toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className={`flex flex-col gap-4 w-full ${activeTab === 'metrics' ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Cells Calculated */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Cells Calculated</span>
              <Grid3X3 className="w-3.5 h-3.5 text-text-secondary" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">{cellCalculatedCount}</div>
          </div>

          {/* Active Value */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Active Value</span>
              <Layers className="w-3.5 h-3.5 text-text-secondary" />
            </div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">
              {activeVal !== null && activeVal !== undefined ? activeVal : '-'}
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
            LCS Complexity: <span className="text-success">O(M * N) time/space</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-elevated border border-border-default text-xs font-semibold text-text-secondary shadow-sm">
            Knapsack Complexity: <span className="text-success">O(N * W) time/space</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-elevated border border-border-default text-xs font-semibold text-text-secondary shadow-sm">
            Fibonacci Complexity: <span className="text-success">O(N) tabulation</span>
          </span>
        </div>
      </div>

      {/* Educational Panels */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 ${activeTab === 'explanation' ? 'grid' : 'hidden lg:grid'}`}>
        <div className="md:col-span-2">
          <AlgorithmExplanation algorithmId={selectedAlgorithm} />
        </div>
        <div>
          <ComplexityChart
            activeComplexity={
              selectedAlgorithm === 'fibonacci' ? 'O(n)' : 'O(n^2)'
            }
          />
        </div>
      </div>

      {/* Share Modal overlay */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={algoLabelMap[selectedAlgorithm]}
        metrics={{
          steps: totalSteps,
          executionTime,
        }}
      />
    </div>
  );
}
