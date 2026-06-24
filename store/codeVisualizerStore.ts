import { create } from "zustand";
import { CodeIR, ClassificationResult } from "../types/codeVisualizer.types";
import { analyzeCode } from "../lib/codeVisualizer/analysis";
import { classifyCode } from "../lib/codeVisualizer/classifier";
import { simulateCode } from "../lib/codeVisualizer/simulator";
import { mapStepLines } from "../lib/codeVisualizer/lineMapper";
import { TimelineBuffer } from "../lib/codeVisualizer/timeline";

interface CodeVisualizerState {
  // Source & Meta
  code: string;
  language: string;
  ir: CodeIR | null;
  classification: ClassificationResult | null;
  customDataset: number[];
  
  // Playback indicators
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  totalSteps: number;
  
  // Visualizer settings
  detectedMode: "handcrafted" | "generic";
  targetVisualizer: string;
  playbackSessionId: string;

  // Actions
  analyzeCode: (source: string, customDataset?: number[]) => void;
  setLanguage: (lang: string) => void;
  setSpeed: (ms: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;
  setCustomDataset: (arr: number[]) => void;
  setDetectedMode: (mode: "handcrafted" | "generic") => void;
}

export const useCodeVisualizerStore = create<CodeVisualizerState>((set, get) => ({
  code: "",
  language: "javascript",
  ir: null,
  classification: null,
  customDataset: [],
  
  currentStepIndex: -1,
  isPlaying: false,
  speed: 200,
  totalSteps: 0,
  
  detectedMode: "generic",
  targetVisualizer: "generic-array",
  playbackSessionId: "",

  analyzeCode: (source: string, customDataset?: number[]) => {
    if (!source.trim()) return;

    // 1. Analyze structure & signature
    const ir = analyzeCode(source);
    const classification = classifyCode(source, ir);

    // 2. Determine mode (handcrafted vs generic)
    // Mode threshold check: Confidence >= 90% is handcrafted
    const confidence = classification.primary.confidence;
    const mode = confidence >= 90 ? "handcrafted" : "generic";
    const visualizer = classification.primary.visualizationType;

    // 3. Run simulator to populate step buffer
    const activeDataset = customDataset || get().customDataset;
    const { steps: rawSteps } = simulateCode(
      source,
      visualizer,
      activeDataset
    );

    // 4. Align steps to code lines
    const alignedSteps = mapStepLines(source, rawSteps, visualizer);

    // 5. Store aligned steps in the static buffer
    TimelineBuffer.setSteps(alignedSteps);

    // 6. Update state
    set({
      code: source,
      language: ir.language,
      ir,
      classification,
      detectedMode: mode,
      targetVisualizer: visualizer,
      totalSteps: alignedSteps.length,
      currentStepIndex: -1,
      isPlaying: false,
      playbackSessionId: `session-${Date.now()}`,
    });
  },

  setLanguage: (lang) => {
    set({ language: lang });
  },

  setSpeed: (speed) => {
    set({ speed });
  },

  setIsPlaying: (isPlaying) => {
    set({ isPlaying });
  },

  setCurrentStepIndex: (index) => {
    const total = get().totalSteps;
    if (index >= -1 && index < total) {
      set({ currentStepIndex: index });
    }
  },

  stepForward: () => {
    const { currentStepIndex, totalSteps } = get();
    if (currentStepIndex < totalSteps - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > -1) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  resetPlayback: () => {
    set({
      currentStepIndex: -1,
      isPlaying: false,
    });
  },

  setCustomDataset: (arr) => {
    set({ customDataset: arr });
    // Re-run analysis with new dataset if code exists
    const code = get().code;
    if (code) {
      get().analyzeCode(code, arr);
    }
  },

  setDetectedMode: (mode) => {
    set({ detectedMode: mode });
  },
}));
