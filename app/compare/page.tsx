'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ChevronUp, ChevronDown, Trophy, X, Share2 } from 'lucide-react';
import { useCompareStore } from '../../store/compareStore';
import { CompareCanvas } from '../../components/visualizers/CompareCanvas';
import { SORTING_ALGORITHMS_METADATA } from '../../lib/algorithms/metadata';
import { SortingAlgorithmType, CodeLanguageType } from '../../store/visualizerStore';
import { bubbleSnippets } from '../../lib/snippets/sorting/bubble';
import { quickSnippets } from '../../lib/snippets/sorting/quick';
import { mergeSnippets } from '../../lib/snippets/sorting/merge';
import { heapSnippets } from '../../lib/snippets/sorting/heap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useDeepLinking } from '../../lib/hooks/useDeepLinking';
import { ShareModal } from '../../components/controls/ShareModal';

const snippetMap: Record<SortingAlgorithmType, Record<CodeLanguageType, string>> = {
  bubble: bubbleSnippets,
  quick: quickSnippets,
  merge: mergeSnippets,
  heap: heapSnippets,
};

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col font-mono text-xs text-text-muted justify-center items-center h-[400px]">
        Loading Compare Visualizer...
      </div>
    }>
      <CompareDashboard />
    </Suspense>
  );
}

function CompareDashboard() {
  const {
    left,
    right,
    isPlaying,
    speed,
    arraySize,
    mode,
    winner,
    setMode,
    setSelectedAlgorithm,
    setArraySize,
    setSpeed,
    setIsPlaying,
    generateNewArrays,
    stepForwardBoth,
    stepBackwardBoth,
    resetBothPlayback,
    clearWinner,
    getMetrics,
  } = useCompareStore();

  const searchParams = useSearchParams();
  const modeParam = searchParams ? searchParams.get('mode') : null;

  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'left' | 'right'>('left');
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguageType>('javascript');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | 'BATTLE!' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Wire Deep Linking
  const { updateUrl } = useDeepLinking(
    () => ({
      mode: mode,
      leftAlgo: left.selectedAlgorithm,
      rightAlgo: right.selectedAlgorithm,
      speed: speed,
      size: arraySize,
    }),
    (params) => {
      if (params.mode) setMode(params.mode as 'compare' | 'battle');
      if (params.leftAlgo) setSelectedAlgorithm('left', params.leftAlgo as SortingAlgorithmType);
      if (params.rightAlgo) setSelectedAlgorithm('right', params.rightAlgo as SortingAlgorithmType);
      if (params.speed) setSpeed(Number(params.speed));
      if (params.size) setArraySize(Number(params.size));
    }
  );

  // Sync mode from URL parameters
  useEffect(() => {
    if (modeParam === 'battle' || modeParam === 'compare') {
      setMode(modeParam);
    }
  }, [modeParam, setMode]);

  // Initialize arrays on mount if not deep linked
  useEffect(() => {
    const hasParams = typeof window !== 'undefined' && new URLSearchParams(window.location.search).size > 0;
    if (!hasParams) {
      generateNewArrays();
    }
  }, [generateNewArrays]);

  // Sync state back to URL when these variables change
  useEffect(() => {
    updateUrl();
  }, [mode, left.selectedAlgorithm, right.selectedAlgorithm, speed, arraySize]);

  // Synchronized Playback Loop
  useEffect(() => {
    if (isPlaying) {
      const run = () => {
        const { left, right, stepForwardBoth, setIsPlaying } = useCompareStore.getState();
        const leftHasNext = left.currentStepIndex < left.steps.length - 1;
        const rightHasNext = right.currentStepIndex < right.steps.length - 1;

        if (leftHasNext || rightHasNext) {
          stepForwardBoth();
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

  const startBattleSequence = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    
    // Check if we are at the start of the race
    const isAtStart = left.currentStepIndex === -1 && right.currentStepIndex === -1;
    if (mode === 'battle' && isAtStart) {
      setCountdown(3);
      const startTimer = (count: number) => {
        setTimeout(() => {
          if (count > 1) {
            setCountdown((count - 1) as any);
            startTimer(count - 1);
          } else if (count === 1) {
            setCountdown('BATTLE!');
            setTimeout(() => {
              setCountdown(null);
              setIsPlaying(true);
            }, 800);
          }
        }, 800);
      };
      startTimer(3);
    } else {
      togglePlay();
    }
  };

  const algos: { key: SortingAlgorithmType; label: string }[] = [
    { key: 'bubble', label: 'Bubble Sort' },
    { key: 'merge', label: 'Merge Sort' },
    { key: 'quick', label: 'Quick Sort' },
    { key: 'heap', label: 'Heap Sort' },
  ];

  const langLabelMap: Record<CodeLanguageType, string> = {
    javascript: 'JavaScript',
    java: 'Java',
    python: 'Python',
    cpp: 'C++',
  };

  const metrics = getMetrics();

  // Code Display variables
  const currentDisplaySide = activeCodeTab === 'left' ? left : right;
  const currentCode = snippetMap[currentDisplaySide.selectedAlgorithm]?.[codeLanguage] || '';
  const currentStep = currentDisplaySide.steps[currentDisplaySide.currentStepIndex];
  const activeLine = currentStep ? currentStep.line : -1;

  const togglePlay = () => {
    const { left, right } = useCompareStore.getState();
    const leftHasNext = left.currentStepIndex < left.steps.length - 1;
    const rightHasNext = right.currentStepIndex < right.steps.length - 1;

    // Reset if both finished
    if (!leftHasNext && !rightHasNext) {
      resetBothPlayback();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    resetBothPlayback();
    setIsPlaying(true);
  };

  // Calculate efficiency metrics for Battle Modal
  const leftName = SORTING_ALGORITHMS_METADATA[left.selectedAlgorithm]?.name || 'Left Sort';
  const rightName = SORTING_ALGORITHMS_METADATA[right.selectedAlgorithm]?.name || 'Right Sort';
  
  const winnerName = winner === 'left' ? leftName : winner === 'right' ? rightName : 'Tie';
  const winnerColor = winner === 'left' ? 'text-accent-purple' : winner === 'right' ? 'text-accent-violet' : 'text-white';
  
  const leftTotalSteps = left.steps.length;
  const rightTotalSteps = right.steps.length;
  
  const speedup = leftTotalSteps > 0 && rightTotalSteps > 0
    ? Math.max(leftTotalSteps, rightTotalSteps) / Math.min(leftTotalSteps, rightTotalSteps)
    : 1;

  // Compare Mode differences HUD
  const showDeltaHUD = mode === 'compare' && (left.currentStepIndex >= 0 || right.currentStepIndex >= 0);
  let deltaText = '';
  let deltaColor = 'text-white';
  
  if (showDeltaHUD) {
    const leftSteps = left.currentStepIndex + 1;
    const rightSteps = right.currentStepIndex + 1;
    
    if (leftSteps !== rightSteps) {
      const diff = Math.abs(leftSteps - rightSteps);
      const ratio = Math.max(leftSteps, rightSteps) / Math.min(leftSteps, rightSteps || 1);
      const fasterSide = leftSteps < rightSteps ? leftName : rightName;
      deltaText = `${fasterSide} algorithm is ahead by ${diff} operations (${ratio.toFixed(1)}x faster)`;
      deltaColor = leftSteps < rightSteps ? 'text-accent-purple' : 'text-accent-violet';
    } else {
      deltaText = 'Both algorithms are running in lockstep (exact same operations count)';
    }
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col font-sans select-none pb-24 relative">
      {/* Breadcrumb Bar */}
      <div className="text-xs text-text-muted font-mono mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-text-secondary transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Practice</span>
        <span>›</span>
        <span className="text-text-primary font-semibold">Compare & Battle</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compare & Battle</h1>
          <p className="text-text-secondary text-sm mt-1">
            Analyze two sorting algorithms side-by-side or race them head-to-head.
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
          <button
            onClick={() => generateNewArrays()}
            disabled={isPlaying}
            className="px-4 py-2 text-xs font-bold uppercase bg-surface border border-[#333333] hover:border-text-secondary rounded-lg text-text-primary hover:bg-elevated transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate New Data
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-1 bg-[#141414]/40 border border-[#2a2a2a] rounded-lg p-0.5 self-start mb-6">
        <button
          onClick={() => setMode('compare')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            mode === 'compare'
              ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
              : 'text-text-secondary hover:text-white hover:bg-elevated'
          }`}
        >
          Compare Mode (Sync)
        </button>
        <button
          onClick={() => setMode('battle')}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            mode === 'battle'
              ? 'bg-highlight text-white border-b border-accent-purple shadow-sm'
              : 'text-text-secondary hover:text-white hover:bg-elevated'
          }`}
        >
          Battle Mode (Race)
        </button>
      </div>

      {/* Main Dual Visualizer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Algorithm Panel */}
        <div className="flex flex-col bg-surface border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl relative">
          {left.isFinished && mode === 'battle' && (
            <div className="absolute top-12 left-0 right-0 bottom-14 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-[#22c55e]/90 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                Finished! 🏁
              </span>
            </div>
          )}
          
          {/* Winner Highlight Left */}
          {winner === 'left' && mode === 'battle' && (
            <div className="absolute inset-x-0 top-12 bottom-14 bg-black/25 pointer-events-none z-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-accent-purple/10 animate-pulse border-2 border-accent-purple shadow-[inset_0_0_40px_rgba(124,58,237,0.35)]" />
              <div className="z-30 flex flex-col items-center">
                <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.7)] animate-bounce" />
                <span className="bg-accent-purple text-white font-extrabold uppercase font-mono tracking-wider text-xs px-3 py-1.5 rounded-full shadow-lg border border-accent-purple/50 mt-3 animate-pulse">
                  🏆 WINNER
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-4 py-3 bg-[#0a0a0a]/50 border-b border-[#2a2a2a]">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-purple font-mono">
              Left Algorithm
            </span>
            <select
              value={left.selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm('left', e.target.value as SortingAlgorithmType)}
              disabled={isPlaying}
              className="bg-base border border-[#333333] hover:border-text-secondary text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer outline-none focus:border-accent-purple animate-all duration-200"
            >
              {algos.map((algo) => (
                <option key={algo.key} value={algo.key}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#141414] h-[300px] w-full border-b border-[#2a2a2a] p-0 relative">
            <CompareCanvas side="left" />
          </div>

          <div className="p-4 grid grid-cols-3 gap-2 bg-[#0c0c0c] text-center border-b border-[#2a2a2a]/50">
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Comparisons</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.left.comparisons}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Swaps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.left.swaps}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Steps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.left.steps}</div>
            </div>
          </div>
        </div>

        {/* Right Algorithm Panel */}
        <div className="flex flex-col bg-surface border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl relative">
          {right.isFinished && mode === 'battle' && (
            <div className="absolute top-12 left-0 right-0 bottom-14 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-[#22c55e]/90 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                Finished! 🏁
              </span>
            </div>
          )}
          
          {/* Winner Highlight Right */}
          {winner === 'right' && mode === 'battle' && (
            <div className="absolute inset-x-0 top-12 bottom-14 bg-black/25 pointer-events-none z-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-accent-violet/10 animate-pulse border-2 border-accent-violet shadow-[inset_0_0_40px_rgba(139,92,246,0.35)]" />
              <div className="z-30 flex flex-col items-center">
                <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.7)] animate-bounce" />
                <span className="bg-accent-violet text-white font-extrabold uppercase font-mono tracking-wider text-xs px-3 py-1.5 rounded-full shadow-lg border border-accent-violet/50 mt-3 animate-pulse">
                  🏆 WINNER
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-4 py-3 bg-[#0a0a0a]/50 border-b border-[#2a2a2a]">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-violet font-mono">
              Right Algorithm
            </span>
            <select
              value={right.selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm('right', e.target.value as SortingAlgorithmType)}
              disabled={isPlaying}
              className="bg-base border border-[#333333] hover:border-text-secondary text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer outline-none focus:border-accent-violet animate-all duration-200"
            >
              {algos.map((algo) => (
                <option key={algo.key} value={algo.key}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#141414] h-[300px] w-full border-b border-[#2a2a2a] p-0 relative">
            <CompareCanvas side="right" />
          </div>

          <div className="p-4 grid grid-cols-3 gap-2 bg-[#0c0c0c] text-center border-b border-[#2a2a2a]/50">
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Comparisons</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.right.comparisons}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Swaps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.right.swaps}</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-mono uppercase">Steps</div>
              <div className="text-lg font-bold text-white mt-1">{metrics.right.steps}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Delta HUD */}
      {showDeltaHUD && (
        <div className="w-full flex items-center justify-center p-3 rounded-xl bg-[#0c0c0c] border border-[#2a2a2a] mb-6 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 font-mono text-xs">
          <span className="mr-2">⚡</span>
          <span className={`font-bold ${deltaColor}`}>{deltaText}</span>
        </div>
      )}

      {/* Control Bar (Unified Playback controls) */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-surface border border-[#2a2a2a] mb-6 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={stepBackwardBoth}
            disabled={isPlaying}
            title="Step Backward"
            className="w-10 h-10 rounded-lg border border-[#333333] hover:border-text-secondary text-text-primary hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={mode === 'battle' && left.currentStepIndex === -1 && right.currentStepIndex === -1 ? startBattleSequence : togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-12 h-12 rounded-lg bg-gradient-to-r from-accent-purple to-indigo-700 hover:from-accent-violet hover:to-accent-purple text-white flex items-center justify-center transition shadow-md cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button
            onClick={stepForwardBoth}
            disabled={isPlaying}
            title="Step Forward"
            className="w-10 h-10 rounded-lg border border-[#333333] hover:border-text-secondary text-text-primary hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={resetBothPlayback}
            title="Reset"
            className="w-10 h-10 rounded-lg border border-[#333333] hover:border-text-secondary text-text-primary hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 w-full md:w-auto flex flex-col gap-1.5 min-w-[150px]">
          <div className="flex justify-between items-center text-xs font-mono text-text-secondary">
            <span>Playback Speed</span>
            <span className="text-white">{(1000 / speed).toFixed(1)} steps/s</span>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={1010 - speed}
            onChange={(e) => setSpeed(1010 - parseInt(e.target.value))}
            className="w-full h-1 bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-purple"
          />
        </div>

        <div className="flex-1 w-full md:w-auto flex flex-col gap-1.5 min-w-[150px]">
          <div className="flex justify-between items-center text-xs font-mono text-text-secondary">
            <span>Array Size</span>
            <span className="text-white">{arraySize} items</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            disabled={isPlaying}
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value))}
            className="w-full h-1 bg-elevated rounded-lg appearance-none cursor-pointer accent-accent-purple disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Expandable Code Panel Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c] border-t border-[#2a2a2a] transition-all duration-300 ${isCodeExpanded ? 'h-[360px]' : 'h-11'} flex flex-col`}>
        <div
          onClick={() => setIsCodeExpanded(!isCodeExpanded)}
          className="h-11 px-6 flex justify-between items-center border-b border-[#2a2a2a] cursor-pointer hover:bg-elevated transition duration-200 select-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary font-mono">
              Code Drawer
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              ({langLabelMap[codeLanguage]} — {activeCodeTab === 'left' ? 'Left' : 'Right'} Algorithm)
            </span>
          </div>
          <div className="text-text-secondary">
            {isCodeExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>

        {isCodeExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-2 bg-[#080808] border-b border-[#202020]">
              <div className="flex gap-1.5 p-0.5 bg-[#141414]/80 border border-[#2a2a2a] rounded-lg">
                <button
                  onClick={() => setActiveCodeTab('left')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeCodeTab === 'left'
                      ? 'bg-accent-purple text-white shadow-sm'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  Left Code ({SORTING_ALGORITHMS_METADATA[left.selectedAlgorithm]?.name})
                </button>
                <button
                  onClick={() => setActiveCodeTab('right')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeCodeTab === 'right'
                      ? 'bg-accent-purple text-white shadow-sm'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  Right Code ({SORTING_ALGORITHMS_METADATA[right.selectedAlgorithm]?.name})
                </button>
              </div>

              <div className="flex gap-1">
                {(['javascript', 'java', 'python', 'cpp'] as CodeLanguageType[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCodeLanguage(lang)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      codeLanguage === lang
                        ? 'bg-elevated text-white border border-[#444444]'
                        : 'text-text-secondary hover:text-white hover:bg-elevated'
                    }`}
                  >
                    {langLabelMap[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto text-sm font-mono bg-[#050505]">
              <SyntaxHighlighter
                language={codeLanguage === 'cpp' ? 'cpp' : codeLanguage}
                style={atomDark}
                customStyle={{
                  margin: 0,
                  background: 'transparent',
                  padding: '1rem 0',
                  minHeight: '100%',
                }}
                wrapLines={true}
                lineProps={(lineNum) => {
                  const isHighlighted = lineNum === activeLine;
                  return {
                    className: isHighlighted ? 'active-line' : '',
                    style: {
                      display: 'block',
                      width: '100%',
                      transition: 'background-color 0.15s ease, border-left-color 0.15s ease',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                    },
                  };
                }}
              >
                {currentCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>

      {/* Battle Mode Results Glassmorphic Modal */}
      {winner && mode === 'battle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-all duration-200">
          <div className="relative max-w-md w-full bg-[#0f0f0f]/90 backdrop-blur-md border border-[#2a2a2a] p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center">
            {/* Close Button */}
            <button
              onClick={clearWinner}
              className="absolute top-4 right-4 text-text-secondary hover:text-white cursor-pointer transition duration-150"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Winner Trophy Header */}
            <div className="w-16 h-16 rounded-full bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight mb-1">
              Race Completed!
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              {winner === 'tie' ? (
                "It's a dead heat! Both finished in the exact same step count."
              ) : (
                <>
                  <span className={`font-bold ${winnerColor}`}>{winnerName}</span> wins the race!
                </>
              )}
            </p>

            {/* Detailed Side-by-Side metrics table */}
            <div className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden mb-6 text-xs font-mono">
              <div className="grid grid-cols-3 gap-2 px-4 py-2 border-b border-[#2a2a2a] bg-[#0c0c0c] text-text-muted uppercase text-[9px] font-bold">
                <div>Metric</div>
                <div>{leftName}</div>
                <div>{rightName}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-[#2a2a2a]/50 text-white items-center">
                <div className="text-text-secondary text-left font-sans font-medium text-[11px]">Total Steps</div>
                <div className={winner === 'left' ? 'text-[#22c55e] font-bold' : ''}>{leftTotalSteps}</div>
                <div className={winner === 'right' ? 'text-[#22c55e] font-bold' : ''}>{rightTotalSteps}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-[#2a2a2a]/50 text-white items-center">
                <div className="text-text-secondary text-left font-sans font-medium text-[11px]">Comparisons</div>
                <div className={winner === 'left' && metrics.left.comparisons < metrics.right.comparisons ? 'text-[#22c55e] font-bold' : ''}>{metrics.left.comparisons}</div>
                <div className={winner === 'right' && metrics.right.comparisons < metrics.left.comparisons ? 'text-[#22c55e] font-bold' : ''}>{metrics.right.comparisons}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 px-4 py-3 text-white items-center">
                <div className="text-text-secondary text-left font-sans font-medium text-[11px]">Swaps</div>
                <div className={winner === 'left' && metrics.left.swaps < metrics.right.swaps ? 'text-[#22c55e] font-bold' : ''}>{metrics.left.swaps}</div>
                <div className={winner === 'right' && metrics.right.swaps < metrics.left.swaps ? 'text-[#22c55e] font-bold' : ''}>{metrics.right.swaps}</div>
              </div>
            </div>

            {/* Efficiency breakdown message */}
            {winner !== 'tie' && speedup > 1.05 && (
              <p className="text-xs text-text-secondary leading-relaxed bg-elevated/40 border border-border-subtle/30 px-3 py-2.5 rounded-lg mb-6 w-full font-sans">
                💡 <span className="font-semibold text-white">{winnerName}</span> completed the sort{' '}
                <span className="text-accent-violet font-bold">{(speedup).toFixed(1)}x faster</span> (in visual operations) than {winner === 'left' ? rightName : leftName}.
              </p>
            )}

            {/* Play Again Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={clearWinner}
                className="flex-1 py-2.5 rounded-lg border border-[#333333] hover:border-text-secondary text-text-primary hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                Inspect Results
              </button>
              <button
                onClick={handleReplay}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-accent-purple to-indigo-700 hover:from-accent-violet hover:to-accent-purple text-white text-xs font-semibold transition shadow-lg cursor-pointer"
              >
                Race Again ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Battle Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none">
          <div className="text-center animate-pulse">
            <h2 className="text-sm font-bold tracking-widest text-text-muted uppercase font-mono mb-2">BATTLE SPEEDWAY</h2>
            <div className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(124,58,237,0.8)] scale-110 transition-all duration-200">
              {countdown}
            </div>
            <p className="text-xs text-text-secondary font-mono mt-4">READY TO SPEEDRUN...</p>
          </div>
        </div>
      )}

      {/* Share Modal overlay */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={`Compare: ${leftName} vs ${rightName}`}
        metrics={{
          size: arraySize,
          steps: Math.max(leftTotalSteps, rightTotalSteps),
        }}
      />
    </div>
  );
}
