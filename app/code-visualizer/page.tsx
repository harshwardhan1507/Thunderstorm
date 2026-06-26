"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCodeVisualizerStore } from "../../store/codeVisualizerStore";
import { TimelineBuffer } from "../../lib/codeVisualizer/timeline";
import { GenericArrayVisualizer } from "../../components/visualizers/GenericArrayVisualizer";
import { CallStackTreeVisualizer } from "../../components/visualizers/CallStackTreeVisualizer";
import { GenericGraphVisualizer } from "../../components/visualizers/GenericGraphVisualizer";
import { GenericTreeVisualizer } from "../../components/visualizers/GenericTreeVisualizer";
import { DPDependencyGrid } from "../../components/visualizers/DPDependencyGrid";
import { SortingCanvas } from "../../components/visualizers/SortingCanvas";
import { TreeCanvas } from "../../components/visualizers/TreeCanvas";
import { GraphCanvas } from "../../components/visualizers/GraphCanvas";
import { DPTable } from "../../components/visualizers/DPTable";
import { useVisualizerStore } from "../../store/visualizerStore";
import { useTreeStore } from "../../store/treeStore";
import { useGraphStore } from "../../store/graphStore";
import { useDPStore } from "../../store/dpStore";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Clock, ShieldAlert, Cpu, Sparkles } from "lucide-react";

export default function CodeVisualizerPage() {
  const {
    code,
    language,
    currentStepIndex,
    isPlaying,
    speed,
    analyzeCode,
    setIsPlaying,
    setSpeed,
    setCurrentStepIndex,
    stepForward,
    stepBackward,
    resetPlayback,
  } = useCodeVisualizerStore();
  
  // Get actual state from store
  const totalSteps = useCodeVisualizerStore((state) => state.totalSteps);
  const targetVisualizer: string = "sorting"; // Can be expanded based on detected mode
  const detectedMode: string = "sorting"; // Can be expanded based on code analysis

  const [inputCode, setInputCode] = useState<string>(`// Paste your sorting algorithm here
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`);

  const [customInput, setCustomInput] = useState<string>("50, 30, 80, 10, 40, 90, 20");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize handcrafted visualizers stores with the simulation data deltas
  const step = TimelineBuffer.getStep(currentStepIndex);

  useEffect(() => {
    if (!step) return;

    // A. Sync Sorting Canvas
    const arrVar = step.variables.find((v) => v.variableId === "arr");
    if (arrVar && Array.isArray(arrVar.value)) {
      useVisualizerStore.setState({ array: arrVar.value });
    }

    // B. Sync Tree Canvas
    if (targetVisualizer === "tree" || targetVisualizer === "generic-tree") {
      const nodeCount = step.metrics.recursionDepth || 0;
      const height = Math.min(5, Math.ceil(nodeCount / 2));
      useTreeStore.setState({
        executionTime: step.metrics.operations * 0.1,
      });
    }
  }, [step, targetVisualizer]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      const run = () => {
        const { currentStepIndex, totalSteps, stepForward } = useCodeVisualizerStore.getState();
        if (currentStepIndex < totalSteps - 1) {
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
  }, [isPlaying, speed, setIsPlaying, stepForward, totalSteps]);

  const handleAnalyze = () => {
    const vals = customInput
      .split(",")
      .map((v) => parseInt(v.trim(), 10))
      .filter((v) => !isNaN(v));
    
    // Validate input
    if (inputCode.trim().length === 0) {
      alert("Please paste some code to analyze");
      return;
    }
    
    // Set manual dataset and switch to manual mode
    if (vals.length > 0) {
      useCodeVisualizerStore.setState({ manualDataset: vals, dataSource: "manual" });
    } else if (customInput.trim().length > 0) {
      alert("Please enter valid comma-separated numbers");
      return;
    }
    
    // Reset playback state before analyzing
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    
    analyzeCode(inputCode);
  };

  const togglePlay = () => {
    const { currentStepIndex: idx, totalSteps: total, isPlaying: playing } = useCodeVisualizerStore.getState();
    // If we finished, reset first
    if (idx >= total - 1 && !playing) {
      resetPlayback();
      setIsPlaying(true);
    } else {
      setIsPlaying(!playing);
    }
  };

  // Render proper canvas depending on selection & mode
  const renderVisualizerCanvas = () => {
    if (detectedMode === "handcrafted") {
      switch (targetVisualizer) {
        case "sorting":
          return <SortingCanvas />;
        case "tree":
          return <TreeCanvas />;
        case "graph":
          return <GraphCanvas />;
        case "dp":
          return <DPTable />;
        default:
          return <GenericArrayVisualizer />;
      }
    } else {
      switch (targetVisualizer) {
        case "generic-recursion":
          return <CallStackTreeVisualizer />;
        case "generic-tree":
          return <GenericTreeVisualizer />;
        case "generic-graph":
          return <GenericGraphVisualizer />;
        case "dp":
          return <DPDependencyGrid />;
        default:
          return <GenericArrayVisualizer />;
      }
    }
  };

  const percentage = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
  const isAtStart = currentStepIndex === -1;
  const isAtEnd = totalSteps > 0 && currentStepIndex === totalSteps - 1;
  const canStepForward = !isAtEnd && totalSteps > 0;
  const canStepBackward = !isAtStart && totalSteps > 0;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col font-sans select-none relative pt-24 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-purple" />
            AI Code Visualizer
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Paste standalone DSA code to automatically extract structure and simulate execution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left column: Paste Code and Settings */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-surface border border-[#2a2a2a] shadow-md flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Paste Source Code:</span>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full h-64 p-3 rounded-lg bg-[#0d0d0d] border border-[#222] font-mono text-xs text-white focus:outline-none focus:border-accent-purple resize-none"
              placeholder="Paste Java, Python, C++, or JS/TS function here..."
            />

            <div className="flex flex-col gap-1.5 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Dataset (comma-separated):</span>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="50, 30, 80, 10"
                className="px-3 py-1.5 rounded bg-[#0d0d0d] border border-[#222] text-xs focus:outline-none focus:border-accent-purple"
              />
            </div>

            <button
              onClick={handleAnalyze}
              className="w-full py-2.5 rounded bg-accent-purple text-xs font-bold text-white transition hover:bg-accent-violet shadow-[0_0_12px_rgba(124,58,237,0.3)] active:scale-95 cursor-pointer"
            >
              Analyze & Simulate
            </button>
          </div>

          {/* Analysis Info and Classification overrides */}
          {/* Removed since ir and classification are no longer in the store */}
        </div>

        {/* Right column: Canvas and Synced Code */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visualizer Frame */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl h-[320px] relative overflow-hidden flex items-center justify-center">
              {code ? renderVisualizerCanvas() : (
                <div className="text-text-muted font-mono text-xs flex flex-col items-center gap-2">
                  <Cpu className="w-8 h-8 opacity-40 animate-pulse text-accent-purple" />
                  <span>Awaiting code simulation...</span>
                </div>
              )}
            </div>

            {/* Step Explanation Frame */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 h-[320px] flex flex-col">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-2 block font-mono">
                Simulation Narrator
              </span>
              <div className="flex-1 overflow-y-auto font-mono text-xs text-text-secondary pr-2">
                {step ? (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white font-bold text-sm border-b border-[#222] pb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent-purple" />
                      {step.explanation.title}
                    </h3>
                    <p className="leading-relaxed leading-normal">{step.explanation.summary}</p>

                    <div className="mt-4 p-2 bg-[#0c0c0c] border border-[#222] rounded text-[10px]">
                      <span className="text-text-muted block uppercase font-bold text-[9px] mb-1">State Variables:</span>
                      {step.variables.map((v) => (
                        <div key={v.variableId} className="flex justify-between py-0.5 border-b border-[#181818]/60">
                          <span className="text-accent-purple font-bold">{v.variableId}</span>
                          <span className="text-white">{JSON.stringify(v.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted text-center font-mono">
                    Press Play/Simulate to read narrator steps
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline and Playback Controllers */}
          {totalSteps > 0 && (
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-surface border border-[#2a2a2a] shadow-md font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={resetPlayback}
                  disabled={isAtStart}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-elevated border border-[#333333] hover:border-text-secondary hover:text-white transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={stepBackward}
                  disabled={!canStepBackward || isPlaying}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-elevated border border-[#333333] hover:border-text-secondary hover:text-white transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Step Backward"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-purple hover:bg-accent-violet text-white transition duration-200 cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={stepForward}
                  disabled={!canStepForward || isPlaying}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-elevated border border-[#333333] hover:border-text-secondary hover:text-white transition duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Step Forward"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Timeline seek scrubber */}
              <div className="flex-1 w-full min-w-[200px] flex items-center gap-3 font-mono">
                <div className="relative flex-1 flex items-center h-6 cursor-pointer">
                  <div className="absolute left-0 right-0 h-1 bg-highlight rounded-full pointer-events-none border border-border-subtle/50"></div>
                  <div
                    className="absolute left-0 h-1 bg-accent-purple rounded-full pointer-events-none"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <input
                    type="range"
                    min={0}
                    max={totalSteps}
                    value={Math.max(0, Math.min(currentStepIndex + 1, totalSteps))}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val >= 0 && val <= totalSteps) {
                        setCurrentStepIndex(val - 1);
                      }
                    }}
                    disabled={totalSteps === 0}
                    className="absolute w-full h-6 appearance-none bg-transparent cursor-pointer disabled:cursor-not-allowed focus:outline-none z-10
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-purple [&::-webkit-slider-thumb]:border-0"
                  />
                </div>
                <span className="text-text-secondary whitespace-nowrap min-w-[65px] text-right font-mono text-[10px]">
                  {currentStepIndex + 1} / {totalSteps}
                </span>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Speed:</span>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={1050 - speed}
                  onChange={(e) => setSpeed(1050 - parseInt(e.target.value, 10))}
                  className="w-20 h-1 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
                />
                <span className="text-text-primary text-[10px] w-10 text-right">
                  {((1050 - speed) / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
