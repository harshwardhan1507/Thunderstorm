import { create } from 'zustand';
import { DPStep } from '../types/algorithm.types';
import { lcs, knapsack, fibonacci, KnapsackItem } from '../lib/algorithms/dp/dpAlgorithms';

export type DPAlgorithmType = 'lcs' | 'knapsack' | 'fibonacci';
export type CodeLanguageType = 'javascript' | 'java' | 'python' | 'cpp';

interface DPState {
  selectedAlgorithm: DPAlgorithmType;
  strA: string;
  strB: string;
  knapsackItems: KnapsackItem[];
  knapsackCapacity: number;
  fibN: number;

  steps: DPStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  language: CodeLanguageType;
  executionTime: number;

  // Setters
  setSelectedAlgorithm: (algo: DPAlgorithmType) => void;
  setLanguage: (lang: CodeLanguageType) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStepIndex: (index: number) => void;

  // Custom updates
  updateLCSInputs: (a: string, b: string) => void;
  updateKnapsackInputs: (items: KnapsackItem[], cap: number) => void;
  updateFibInput: (n: number) => void;

  // Operations
  runAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;
  
  getMetrics: () => { activeVal: number | null; cellCalculatedCount: number };
}

const defaultKnapsackItems: KnapsackItem[] = [
  { weight: 1, value: 6 },
  { weight: 2, value: 10 },
  { weight: 3, value: 12 },
  { weight: 5, value: 20 },
];

export const useDPStore = create<DPState>((set, get) => ({
  selectedAlgorithm: 'lcs',
  strA: 'ABCBDAB',
  strB: 'BDCABA',
  knapsackItems: defaultKnapsackItems,
  knapsackCapacity: 5,
  fibN: 6,
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 500, // 500ms default speed
  language: 'javascript',
  executionTime: 0,

  setSelectedAlgorithm: (algo) => {
    set({ selectedAlgorithm: algo });
    get().runAlgorithm();
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
    const { steps } = get();
    if (index >= -1 && index < steps.length) {
      set({ currentStepIndex: index });
    }
  },

  updateLCSInputs: (a, b) => {
    set({ strA: a, strB: b, isPlaying: false, currentStepIndex: -1 });
    get().runAlgorithm();
  },

  updateKnapsackInputs: (items, cap) => {
    set({ knapsackItems: items, knapsackCapacity: cap, isPlaying: false, currentStepIndex: -1 });
    get().runAlgorithm();
  },

  updateFibInput: (n) => {
    set({ fibN: n, isPlaying: false, currentStepIndex: -1 });
    get().runAlgorithm();
  },

  runAlgorithm: () => {
    const { selectedAlgorithm, strA, strB, knapsackItems, knapsackCapacity, fibN } = get();

    const start = performance.now();
    const steps: DPStep[] = [];
    
    let generator: Generator<DPStep>;
    if (selectedAlgorithm === 'lcs') {
      generator = lcs(strA, strB);
    } else if (selectedAlgorithm === 'knapsack') {
      generator = knapsack(knapsackItems, knapsackCapacity);
    } else {
      generator = fibonacci(fibN);
    }

    for (const step of generator) {
      steps.push(step);
    }
    const executionTime = performance.now() - start;

    set({
      steps,
      executionTime,
      currentStepIndex: -1,
      isPlaying: false,
    });
  },

  stepForward: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
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

  getMetrics: () => {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex < 0 || steps.length === 0) {
      return { activeVal: 0, cellCalculatedCount: 0 };
    }
    const step = steps[currentStepIndex];
    let cellCalculatedCount = 0;
    step.table.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== null) cellCalculatedCount++;
      });
    });

    let activeVal: number | null = null;
    if (step.activeCell) {
      const [r, c] = step.activeCell;
      activeVal = step.table[r][c];
    }

    return { activeVal, cellCalculatedCount };
  },
}));
