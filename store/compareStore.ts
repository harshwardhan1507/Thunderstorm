import { create } from 'zustand';
import { SortStep } from '../types/algorithm.types';
import { SortingAlgorithmType } from './visualizerStore';
import { bubbleSort } from '../lib/algorithms/sorting/bubbleSort';
import { quickSort } from '../lib/algorithms/sorting/quickSort';
import { mergeSort } from '../lib/algorithms/sorting/mergeSort';
import { heapSort } from '../lib/algorithms/sorting/heapSort';

export interface CompareInstanceState {
  array: number[];
  initialArray: number[];
  steps: SortStep[];
  currentStepIndex: number;
  selectedAlgorithm: SortingAlgorithmType;
  executionTime: number;
  isFinished: boolean;
  finishStepCount: number;
  finishRealTime: number;
}

interface CompareState {
  left: CompareInstanceState;
  right: CompareInstanceState;
  isPlaying: boolean;
  speed: number;
  arraySize: number;
  mode: 'compare' | 'battle';
  winner: 'left' | 'right' | 'tie' | null;

  setMode: (mode: 'compare' | 'battle') => void;
  setSelectedAlgorithm: (side: 'left' | 'right', algo: SortingAlgorithmType) => void;
  setArraySize: (size: number) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStepIndex: (side: 'left' | 'right', index: number) => void;
  
  generateNewArrays: () => void;
  runBothAlgorithms: () => void;
  stepForwardBoth: () => void;
  stepBackwardBoth: () => void;
  resetBothPlayback: () => void;
  clearWinner: () => void;
  getMetrics: () => {
    left: { comparisons: number; swaps: number; steps: number };
    right: { comparisons: number; swaps: number; steps: number };
  };
}

const getGenerator = (algo: SortingAlgorithmType, arr: number[]) => {
  switch (algo) {
    case 'bubble': return bubbleSort(arr);
    case 'quick': return quickSort(arr);
    case 'merge': return mergeSort(arr);
    case 'heap': return heapSort(arr);
  }
};

const initialInstance = (algo: SortingAlgorithmType): CompareInstanceState => ({
  array: [],
  initialArray: [],
  steps: [],
  currentStepIndex: -1,
  selectedAlgorithm: algo,
  executionTime: 0,
  isFinished: false,
  finishStepCount: 0,
  finishRealTime: 0,
});

export const useCompareStore = create<CompareState>((set, get) => ({
  left: initialInstance('bubble'),
  right: initialInstance('quick'),
  isPlaying: false,
  speed: 100,
  arraySize: 20,
  mode: 'compare',
  winner: null,

  setMode: (mode) => set({ mode, winner: null }),
  
  setSelectedAlgorithm: (side, algo) => {
    set((state) => ({
      [side]: { ...state[side], selectedAlgorithm: algo, isFinished: false }
    }));
    get().runBothAlgorithms();
  },

  setArraySize: (size) => {
    set({ arraySize: size });
    get().generateNewArrays();
  },

  setSpeed: (speed) => set({ speed }),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentStepIndex: (side, index) => {
    set((state) => {
      const inst = state[side];
      if (index >= -1 && index < inst.steps.length) {
        const arr = index === -1 ? inst.initialArray : inst.steps[index].array;
        return {
          [side]: { ...inst, currentStepIndex: index, array: [...arr] }
        };
      }
      return {};
    });
  },

  generateNewArrays: () => {
    const { arraySize } = get();
    const newArray: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 340) + 10);
    }
    
    set((state) => ({
      winner: null,
      isPlaying: false,
      left: {
        ...state.left,
        initialArray: [...newArray],
        array: [...newArray],
        currentStepIndex: -1,
        isFinished: false,
      },
      right: {
        ...state.right,
        initialArray: [...newArray],
        array: [...newArray],
        currentStepIndex: -1,
        isFinished: false,
      }
    }));
    get().runBothAlgorithms();
  },

  runBothAlgorithms: () => {
    const { left, right } = get();
    if (left.initialArray.length === 0) return;

    // Run Left
    const leftStart = performance.now();
    const leftSteps: SortStep[] = [];
    const leftGen = getGenerator(left.selectedAlgorithm, left.initialArray);
    for (const step of leftGen) leftSteps.push(step);
    const leftTime = performance.now() - leftStart;

    // Run Right
    const rightStart = performance.now();
    const rightSteps: SortStep[] = [];
    const rightGen = getGenerator(right.selectedAlgorithm, right.initialArray);
    for (const step of rightGen) rightSteps.push(step);
    const rightTime = performance.now() - rightStart;

    set((state) => ({
      left: {
        ...state.left,
        steps: leftSteps,
        executionTime: leftTime,
        isFinished: false,
        currentStepIndex: -1,
        array: [...state.left.initialArray]
      },
      right: {
        ...state.right,
        steps: rightSteps,
        executionTime: rightTime,
        isFinished: false,
        currentStepIndex: -1,
        array: [...state.right.initialArray]
      }
    }));
  },

  stepForwardBoth: () => {
    const { left, right, mode } = get();
    
    if (mode === 'compare') {
      const leftNext = left.currentStepIndex < left.steps.length - 1 ? left.currentStepIndex + 1 : left.currentStepIndex;
      const rightNext = right.currentStepIndex < right.steps.length - 1 ? right.currentStepIndex + 1 : right.currentStepIndex;

      set((state) => ({
        left: {
          ...state.left,
          currentStepIndex: leftNext,
          array: leftNext === -1 ? state.left.initialArray : [...state.left.steps[leftNext].array],
        },
        right: {
          ...state.right,
          currentStepIndex: rightNext,
          array: rightNext === -1 ? state.right.initialArray : [...state.right.steps[rightNext].array],
        }
      }));

      if (leftNext === left.steps.length - 1 && rightNext === right.steps.length - 1) {
        set({ isPlaying: false });
      }
    } else {
      // Battle Mode
      set((state) => {
        const nextLeftIndex = state.left.currentStepIndex < state.left.steps.length - 1 ? state.left.currentStepIndex + 1 : state.left.currentStepIndex;
        const nextRightIndex = state.right.currentStepIndex < state.right.steps.length - 1 ? state.right.currentStepIndex + 1 : state.right.currentStepIndex;
        
        const leftFinishedNow = nextLeftIndex === state.left.steps.length - 1;
        const rightFinishedNow = nextRightIndex === state.right.steps.length - 1;
        
        const leftIsFinished = state.left.isFinished || leftFinishedNow || state.left.steps.length === 0;
        const rightIsFinished = state.right.isFinished || rightFinishedNow || state.right.steps.length === 0;
        
        let winner: 'left' | 'right' | 'tie' | null = state.winner;
        if (leftIsFinished && rightIsFinished && !state.winner) {
          const leftSteps = state.left.steps.length;
          const rightSteps = state.right.steps.length;
          if (leftSteps < rightSteps) {
            winner = 'left';
          } else if (rightSteps < leftSteps) {
            winner = 'right';
          } else {
            winner = 'tie';
          }
        }
        
        return {
          winner,
          isPlaying: !(leftIsFinished && rightIsFinished),
          left: {
            ...state.left,
            currentStepIndex: nextLeftIndex,
            array: nextLeftIndex === -1 ? state.left.initialArray : [...state.left.steps[nextLeftIndex].array],
            isFinished: leftIsFinished,
          },
          right: {
            ...state.right,
            currentStepIndex: nextRightIndex,
            array: nextRightIndex === -1 ? state.right.initialArray : [...state.right.steps[nextRightIndex].array],
            isFinished: rightIsFinished,
          }
        };
      });
    }
  },

  stepBackwardBoth: () => {
    const { left, right } = get();
    const leftPrev = left.currentStepIndex > -1 ? left.currentStepIndex - 1 : -1;
    const rightPrev = right.currentStepIndex > -1 ? right.currentStepIndex - 1 : -1;

    set((state) => ({
      left: {
        ...state.left,
        currentStepIndex: leftPrev,
        array: leftPrev === -1 ? state.left.initialArray : [...state.left.steps[leftPrev].array],
      },
      right: {
        ...state.right,
        currentStepIndex: rightPrev,
        array: rightPrev === -1 ? state.right.initialArray : [...state.right.steps[rightPrev].array],
      }
    }));
  },

  resetBothPlayback: () => {
    set((state) => ({
      isPlaying: false,
      winner: null,
      left: {
        ...state.left,
        currentStepIndex: -1,
        array: [...state.left.initialArray],
        isFinished: false,
      },
      right: {
        ...state.right,
        currentStepIndex: -1,
        array: [...state.right.initialArray],
        isFinished: false,
      }
    }));
  },

  clearWinner: () => {
    set({ winner: null });
  },

  getMetrics: () => {
    const { left, right } = get();
    const getMetricsForSide = (inst: CompareInstanceState) => {
      if (inst.currentStepIndex < 0 || inst.steps.length === 0) {
        return { comparisons: 0, swaps: 0, steps: 0 };
      }
      const slice = inst.steps.slice(0, inst.currentStepIndex + 1);
      const comparisons = slice.filter(s => !s.swapped && s.comparing.length > 0).length;
      const swaps = slice.filter(s => s.swapped).length;
      return { comparisons, swaps, steps: inst.currentStepIndex + 1 };
    };

    return {
      left: getMetricsForSide(left),
      right: getMetricsForSide(right)
    };
  }
}));
