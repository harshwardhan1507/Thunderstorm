import { create } from 'zustand';
import { SortStep } from '../types/algorithm.types';
import { bubbleSort } from '../lib/algorithms/sorting/bubbleSort';
import { quickSort } from '../lib/algorithms/sorting/quickSort';
import { mergeSort } from '../lib/algorithms/sorting/mergeSort';
import { heapSort } from '../lib/algorithms/sorting/heapSort';

export type SortingAlgorithmType = 'bubble' | 'quick' | 'merge' | 'heap';
export type CodeLanguageType = 'javascript' | 'java' | 'python' | 'cpp';

interface VisualizerState {
  // State variables
  array: number[];
  initialArray: number[]; // stored to allow reset
  steps: SortStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // Interval speed in ms: lower is faster
  arraySize: number;
  selectedAlgorithm: SortingAlgorithmType;
  language: CodeLanguageType;
  executionTime: number; // Time in ms to run generator

  // Setters and Simple Actions
  setSelectedAlgorithm: (algo: SortingAlgorithmType) => void;
  setLanguage: (lang: CodeLanguageType) => void;
  setArraySize: (size: number) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStepIndex: (index: number) => void;

  // Complex Operations
  generateNewArray: () => void;
  runAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;

  // Selectors/Computed values
  getMetrics: () => { comparisons: number; swaps: number };
}

const getGenerator = (algo: SortingAlgorithmType, arr: number[]) => {
  switch (algo) {
    case 'bubble':
      return bubbleSort(arr);
    case 'quick':
      return quickSort(arr);
    case 'merge':
      return mergeSort(arr);
    case 'heap':
      return heapSort(arr);
  }
};

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  array: [],
  initialArray: [],
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 100, // 100ms per step by default
  arraySize: 25,
  selectedAlgorithm: 'bubble',
  language: 'javascript',
  executionTime: 0,

  setSelectedAlgorithm: (algo) => {
    set({ selectedAlgorithm: algo });
    get().runAlgorithm();
  },

  setLanguage: (lang) => {
    set({ language: lang });
  },

  setArraySize: (size) => {
    set({ arraySize: size });
    get().generateNewArray();
  },

  setSpeed: (speed) => {
    set({ speed });
  },

  setIsPlaying: (isPlaying) => {
    set({ isPlaying });
  },

  setCurrentStepIndex: (index) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({
        currentStepIndex: index,
        array: steps[index].array,
      });
    }
  },

  generateNewArray: () => {
    const { arraySize } = get();
    const newArray: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      // Numbers from 10 to 350 (nice heights for bars)
      newArray.push(Math.floor(Math.random() * 340) + 10);
    }
    set({
      initialArray: [...newArray],
      array: [...newArray],
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  runAlgorithm: () => {
    const { selectedAlgorithm, initialArray } = get();
    if (initialArray.length === 0) return;

    const start = performance.now();
    const steps: SortStep[] = [];
    const generator = getGenerator(selectedAlgorithm, initialArray);
    
    for (const step of generator) {
      steps.push(step);
    }
    const executionTime = performance.now() - start;

    set({
      steps,
      executionTime,
      currentStepIndex: -1,
      isPlaying: false,
      array: [...initialArray],
    });
  },

  stepForward: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      set({
        currentStepIndex: nextIndex,
        array: steps[nextIndex].array,
      });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex, steps, initialArray } = get();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      set({
        currentStepIndex: prevIndex,
        array: steps[prevIndex].array,
      });
    } else if (currentStepIndex === 0) {
      set({
        currentStepIndex: -1,
        array: [...initialArray],
      });
    }
  },

  resetPlayback: () => {
    const { initialArray } = get();
    set({
      currentStepIndex: -1,
      isPlaying: false,
      array: [...initialArray],
    });
  },

  getMetrics: () => {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex < 0 || steps.length === 0) {
      return { comparisons: 0, swaps: 0 };
    }
    const currentSlice = steps.slice(0, currentStepIndex + 1);
    
    // comparisons are steps where we are comparing but not swapping
    const comparisons = currentSlice.filter((s) => !s.swapped && s.comparing.length > 0).length;
    // swaps are steps where swapped is true
    const swaps = currentSlice.filter((s) => s.swapped).length;

    return { comparisons, swaps };
  },
}));
