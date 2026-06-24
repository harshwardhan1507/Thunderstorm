import { create } from 'zustand';
import { PathfindingStep } from '../types/algorithm.types';
import { dijkstra } from '../lib/algorithms/pathfinding/dijkstra';
import { astar } from '../lib/algorithms/pathfinding/astar';

export type PathfindingAlgorithmType = 'dijkstra' | 'astar';
export type CodeLanguageType = 'javascript' | 'java' | 'python' | 'cpp';

interface PathfindingState {
  rows: number;
  cols: number;
  startNode: string; // "r,c"
  endNode: string; // "r,c"
  walls: Set<string>; // set of "r,c" wall coords
  steps: PathfindingStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  selectedAlgorithm: PathfindingAlgorithmType;
  language: CodeLanguageType;
  executionTime: number;

  // Actions
  setRowsCols: (rows: number, cols: number) => void;
  setStartNode: (coord: string) => void;
  setEndNode: (coord: string) => void;
  toggleWall: (coord: string) => void;
  addWall: (coord: string) => void;
  removeWall: (coord: string) => void;
  clearWalls: () => void;
  resetPlayback: () => void;

  setSelectedAlgorithm: (algo: PathfindingAlgorithmType) => void;
  setLanguage: (lang: CodeLanguageType) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStepIndex: (index: number) => void;

  // Maze generators
  loadMaze: (preset: 'random' | 'checkerboard' | 'border' | 'clear') => void;
  runAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;

  getMetrics: () => { nodesVisited: number; pathLength: number };
}

export const usePathfindingStore = create<PathfindingState>((set, get) => ({
  rows: 20,
  cols: 30,
  startNode: '5,5',
  endNode: '15,25',
  walls: new Set<string>(),
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 40, // 40ms default step speed
  selectedAlgorithm: 'dijkstra',
  language: 'javascript',
  executionTime: 0,

  setRowsCols: (rows, cols) => {
    // Re-verify bounds for start and end nodes
    let startNode = get().startNode;
    let endNode = get().endNode;

    const [sr, sc] = startNode.split(',').map(Number);
    const [er, ec] = endNode.split(',').map(Number);

    if (sr >= rows || sc >= cols) startNode = '0,0';
    if (er >= rows || ec >= cols) endNode = `${rows - 1},${cols - 1}`;

    set({
      rows,
      cols,
      startNode,
      endNode,
      walls: new Set<string>(),
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  setStartNode: (coord) => {
    const { walls } = get();
    // Start node cannot be on a wall
    const newWalls = new Set(walls);
    newWalls.delete(coord);

    set({
      startNode: coord,
      walls: newWalls,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  setEndNode: (coord) => {
    const { walls } = get();
    const newWalls = new Set(walls);
    newWalls.delete(coord);

    set({
      endNode: coord,
      walls: newWalls,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  toggleWall: (coord) => {
    const { walls, startNode, endNode } = get();
    if (coord === startNode || coord === endNode) return;

    const newWalls = new Set(walls);
    if (newWalls.has(coord)) {
      newWalls.delete(coord);
    } else {
      newWalls.add(coord);
    }

    set({
      walls: newWalls,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  addWall: (coord) => {
    const { walls, startNode, endNode } = get();
    if (coord === startNode || coord === endNode) return;
    if (walls.has(coord)) return;

    const newWalls = new Set(walls);
    newWalls.add(coord);

    set({
      walls: newWalls,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  removeWall: (coord) => {
    const { walls } = get();
    if (!walls.has(coord)) return;

    const newWalls = new Set(walls);
    newWalls.delete(coord);

    set({
      walls: newWalls,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  clearWalls: () => {
    set({
      walls: new Set<string>(),
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  resetPlayback: () => {
    set({
      currentStepIndex: -1,
      isPlaying: false,
    });
  },

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

  loadMaze: (preset) => {
    const { rows, cols, startNode, endNode } = get();
    const newWalls = new Set<string>();

    if (preset === 'random') {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const coord = `${r},${c}`;
          if (coord !== startNode && coord !== endNode && Math.random() < 0.28) {
            newWalls.add(coord);
          }
        }
      }
    } else if (preset === 'checkerboard') {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const coord = `${r},${c}`;
          if (coord !== startNode && coord !== endNode && (r % 2 === 0 && c % 2 === 0)) {
            newWalls.add(coord);
          }
        }
      }
    } else if (preset === 'border') {
      // Border walls with small opening gaps
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const coord = `${r},${c}`;
          if (coord !== startNode && coord !== endNode) {
            // outer walls
            const isOuter = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
            // inner partitions
            const isPartition = c === Math.floor(cols / 2) && r > 2 && r < rows - 3;
            if (isOuter || isPartition) {
              newWalls.add(coord);
            }
          }
        }
      }
    }

    set({
      walls: newWalls,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  runAlgorithm: () => {
    const { selectedAlgorithm, rows, cols, startNode, endNode, walls } = get();

    const start = performance.now();
    const steps: PathfindingStep[] = [];
    const generator = selectedAlgorithm === 'dijkstra'
      ? dijkstra(rows, cols, startNode, endNode, walls)
      : astar(rows, cols, startNode, endNode, walls);

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

  getMetrics: () => {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex < 0 || steps.length === 0) {
      return { nodesVisited: 0, pathLength: 0 };
    }
    const currentStep = steps[currentStepIndex];
    return {
      nodesVisited: currentStep.visited.length,
      pathLength: currentStep.path.length,
    };
  },
}));
