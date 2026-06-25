import { create } from "zustand";
import { CodeIR } from "../types/codeVisualizer.types";
import { orchestrate, Tier, OrchestrationResult } from "../lib/codeVisualizer/orchestrator";
import { StaticAnalysisReport } from "../lib/codeVisualizer/staticAnalysis";
import { TimelineBuffer } from "../lib/codeVisualizer/timeline";

export type DataSource = "extracted" | "manual";

interface CodeVisualizerState {
  // Source & Meta
  code: string;
  language: string;
  ir: CodeIR | null;

  // Tier / routing metadata (the honest core)
  tier: Tier | null;
  matchedAlgorithm: string | null;
  matchConfidence: number | null;
  visualization: "sorting" | "dp" | null;
  staticReport: StaticAnalysisReport | null;
  note: string;
  error: string | null;
  truncated: boolean;

  // Dataset provenance
  dataSource: DataSource;
  manualDataset: number[];
  datasetUsed: number[] | null;
  datasetSource: "extracted" | "manual" | "none";

  // Playback
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  totalSteps: number;
  playbackSessionId: string;

  // Actions
  analyzeCode: (source: string) => void;
  setLanguage: (lang: string) => void;
  setSpeed: (ms: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;
  setDataSource: (src: DataSource) => void;
  setManualDataset: (arr: number[]) => void;
}

function applyResult(result: OrchestrationResult) {
  TimelineBuffer.setSteps(result.steps);
  return {
    language: result.ir.language,
    ir: result.ir,
    tier: result.tier,
    matchedAlgorithm: result.matchedAlgorithm ?? null,
    matchConfidence: result.matchConfidence ?? null,
    visualization: result.visualization ?? null,
    staticReport: result.staticReport ?? null,
    note: result.note,
    error: result.error ?? null,
    truncated: result.truncated,
    datasetUsed: result.datasetUsed ?? null,
    datasetSource: result.datasetSource ?? "none",
    totalSteps: result.steps.length,
    currentStepIndex: -1,
    isPlaying: false,
    playbackSessionId: `session-${Date.now()}`,
  };
}

export const useCodeVisualizerStore = create<CodeVisualizerState>((set, get) => ({
  code: "",
  language: "javascript",
  ir: null,

  tier: null,
  matchedAlgorithm: null,
  matchConfidence: null,
  visualization: null,
  staticReport: null,
  note: "",
  error: null,
  truncated: false,

  dataSource: "extracted",
  manualDataset: [],
  datasetUsed: null,
  datasetSource: "none",

  currentStepIndex: -1,
  isPlaying: false,
  speed: 200,
  totalSteps: 0,
  playbackSessionId: "",

  analyzeCode: (source: string) => {
    if (!source.trim()) return;
    const { dataSource, manualDataset } = get();
    const result = orchestrate(source, { dataSource, manualDataset });
    set({ code: source, ...applyResult(result) });
  },

  setLanguage: (lang) => set({ language: lang }),
  setSpeed: (speed) => set({ speed }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentStepIndex: (index) => {
    const total = get().totalSteps;
    if (index >= -1 && index < total) set({ currentStepIndex: index });
  },

  stepForward: () => {
    const { currentStepIndex, totalSteps } = get();
    if (currentStepIndex < totalSteps - 1) set({ currentStepIndex: currentStepIndex + 1 });
    else set({ isPlaying: false });
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > -1) set({ currentStepIndex: currentStepIndex - 1 });
  },

  resetPlayback: () => set({ currentStepIndex: -1, isPlaying: false }),

  setDataSource: (src) => {
    set({ dataSource: src });
    const code = get().code;
    if (code) get().analyzeCode(code);
  },

  setManualDataset: (arr) => {
    set({ manualDataset: arr });
    // Switching to manual data implies the user wants to use it.
    const code = get().code;
    if (code && get().dataSource === "manual") get().analyzeCode(code);
  },
}));
