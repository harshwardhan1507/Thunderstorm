'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { useCompareStore, CompareInstanceState } from '../../store/compareStore';
import { CompareCanvas } from '../../components/visualizers/CompareCanvas';
import { SORTING_ALGORITHMS_METADATA } from '../../lib/algorithms/metadata';
import { SortingAlgorithmType, CodeLanguageType } from '../../store/visualizerStore';
import { bubbleSnippets } from '../../lib/snippets/sorting/bubble';
import { quickSnippets } from '../../lib/snippets/sorting/quick';
import { mergeSnippets } from '../../lib/snippets/sorting/merge';
import { heapSnippets } from '../../lib/snippets/sorting/heap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const snippetMap: Record<SortingAlgorithmType, Record<CodeLanguageType, string>> = {
  bubble: bubbleSnippets,
  quick: quickSnippets,
  merge: mergeSnippets,
  heap: heapSnippets,
};

export default function ComparePage() {
  const {
    left,
    right,
    isPlaying,
    speed,
    arraySize,
    mode,
    setMode,
    setSelectedAlgorithm,
    setArraySize,
    setSpeed,
    setIsPlaying,
    generateNewArrays,
    stepForwardBoth,
    stepBackwardBoth,
    resetBothPlayback,
    getMetrics,
    setCurrentStepIndex,
  } = useCompareStore();

  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'left' | 'right'>('left');
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguageType>('javascript');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize arrays on mount
  useEffect(() => {
    generateNewArrays();
  }, [generateNewArrays]);

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

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col font-sans select-none pb-24">
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
        <div className="flex flex-col bg-surface border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center px-4 py-3 bg-[#0a0a0a]/50 border-b border-[#2a2a2a]">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-purple font-mono">
              Left Algorithm
            </span>
            <select
              value={left.selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm('left', e.target.value as SortingAlgorithmType)}
              disabled={isPlaying}
              className="bg-base border border-[#333333] hover:border-text-secondary text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer outline-none focus:border-accent-purple"
            >
              {algos.map((algo) => (
                <option key={algo.key} value={algo.key}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#141414] h-[300px] w-full border-b border-[#2a2a2a] p-0">
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
        <div className="flex flex-col bg-surface border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center px-4 py-3 bg-[#0a0a0a]/50 border-b border-[#2a2a2a]">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-violet font-mono">
              Right Algorithm
            </span>
            <select
              value={right.selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm('right', e.target.value as SortingAlgorithmType)}
              disabled={isPlaying}
              className="bg-base border border-[#333333] hover:border-text-secondary text-white text-xs font-semibold px-2 py-1 rounded cursor-pointer outline-none focus:border-accent-violet"
            >
              {algos.map((algo) => (
                <option key={algo.key} value={algo.key}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#141414] h-[300px] w-full border-b border-[#2a2a2a] p-0">
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
            onClick={togglePlay}
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
        {/* Toggle Bar */}
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
            {/* Header controls inside Expanded Drawer */}
            <div className="flex justify-between items-center px-6 py-2 bg-[#080808] border-b border-[#202020]">
              {/* Tab Selector (Left vs Right code) */}
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

              {/* Language Selector */}
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

            {/* Code syntax container */}
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
    </div>
  );
}
