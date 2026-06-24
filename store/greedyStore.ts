import { create } from 'zustand';
import { GreedyStep, Activity } from '../types/algorithm.types';
import { activitySelection, huffmanCoding } from '../lib/algorithms/greedy/greedyAlgorithms';

export type GreedyAlgorithmType = 'activity' | 'huffman';
export type CodeLanguageType = 'javascript' | 'java' | 'python' | 'cpp';

interface GreedyState {
  selectedAlgorithm: GreedyAlgorithmType;
  activities: Activity[];
  charFreqs: { char: string; freq: number }[];

  steps: GreedyStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  language: CodeLanguageType;
  executionTime: number;

  // Setters
  setSelectedAlgorithm: (algo: GreedyAlgorithmType) => void;
  setLanguage: (lang: CodeLanguageType) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStepIndex: (index: number) => void;

  // Custom updates
  updateActivities: (acts: Activity[]) => void;
  updateCharFreqs: (freqs: { char: string; freq: number }[]) => void;

  // Operations
  runAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;
  
  getMetrics: () => { selectedCount: number; discardedCount: number; treeDepth: number };
}

const defaultActivities: Activity[] = [
  { id: 'Act 1', start: 1, end: 4 },
  { id: 'Act 2', start: 3, end: 5 },
  { id: 'Act 3', start: 0, end: 6 },
  { id: 'Act 4', start: 5, end: 7 },
  { id: 'Act 5', start: 3, end: 8 },
  { id: 'Act 6', start: 5, end: 9 },
  { id: 'Act 7', start: 6, end: 10 },
  { id: 'Act 8', start: 8, end: 11 },
];

const defaultCharFreqs = [
  { char: 'A', freq: 5 },
  { char: 'B', freq: 9 },
  { char: 'C', freq: 12 },
  { char: 'D', freq: 13 },
  { char: 'E', freq: 16 },
  { char: 'F', freq: 45 },
];

export const useGreedyStore = create<GreedyState>((set, get) => ({
  selectedAlgorithm: 'activity',
  activities: defaultActivities,
  charFreqs: defaultCharFreqs,
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 600, // 600ms default speed
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

  updateActivities: (activities) => {
    set({ activities, isPlaying: false, currentStepIndex: -1 });
    get().runAlgorithm();
  },

  updateCharFreqs: (charFreqs) => {
    set({ charFreqs, isPlaying: false, currentStepIndex: -1 });
    get().runAlgorithm();
  },

  runAlgorithm: () => {
    const { selectedAlgorithm, activities, charFreqs } = get();

    const start = performance.now();
    const steps: GreedyStep[] = [];
    const generator = selectedAlgorithm === 'activity'
      ? activitySelection(activities)
      : huffmanCoding(charFreqs);

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
    const { steps, currentStepIndex, selectedAlgorithm } = get();
    if (currentStepIndex < 0 || steps.length === 0) {
      return { selectedCount: 0, discardedCount: 0, treeDepth: 0 };
    }
    const step = steps[currentStepIndex];

    let selectedCount = 0;
    let discardedCount = 0;
    let treeDepth = 0;

    if (selectedAlgorithm === 'activity' && step.activities) {
      selectedCount = step.activities.selected.length;
      discardedCount = step.activities.discarded.length;
    } else if (selectedAlgorithm === 'huffman' && step.huffmanTree) {
      const tree = step.huffmanTree.nodes;
      const rootId = step.huffmanTree.rootId;
      selectedCount = Object.keys(tree).filter((k) => k.startsWith('leaf-')).length; // total leaves
      
      const getHeight = (id: string | null): number => {
        if (!id || !tree[id]) return 0;
        return 1 + Math.max(getHeight(tree[id].leftId), getHeight(tree[id].rightId));
      };
      treeDepth = getHeight(rootId);
    }

    return { selectedCount, discardedCount, treeDepth };
  },
}));
