import { create } from 'zustand';
import { GraphNode, GraphEdge, GraphStep } from '../types/algorithm.types';
import { bfs } from '../lib/algorithms/graphs/bfs';
import { dfs } from '../lib/algorithms/graphs/dfs';

export type GraphAlgorithmType = 'bfs' | 'dfs';
export type CodeLanguageType = 'javascript' | 'java' | 'python' | 'cpp';

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  steps: GraphStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  selectedAlgorithm: GraphAlgorithmType;
  startNodeId: string;
  language: CodeLanguageType;
  executionTime: number;

  // Setters
  setSelectedAlgorithm: (algo: GraphAlgorithmType) => void;
  setLanguage: (lang: CodeLanguageType) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setStartNodeId: (id: string) => void;

  // Graph editing
  addNode: (x: number, y: number) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  addEdge: (fromId: string, toId: string) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (fromId: string, toId: string) => void;

  // Operations
  generateNewGraph: () => void;
  loadPreset: (presetType: 'tree' | 'cycle' | 'star' | 'grid' | 'default') => void;
  runAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;
  
  // Selectors
  getMetrics: () => { nodesVisited: number; queueSize?: number; pathLength: number };
}

const defaultNodes: GraphNode[] = [
  { id: 'A', label: 'A', x: 150, y: 100 },
  { id: 'B', label: 'B', x: 450, y: 100 },
  { id: 'C', label: 'C', x: 150, y: 300 },
  { id: 'D', label: 'D', x: 450, y: 300 },
  { id: 'E', label: 'E', x: 300, y: 200 },
];

const defaultEdges: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'D' },
  { from: 'E', to: 'A' },
  { from: 'E', to: 'D' },
];

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: defaultNodes,
  edges: defaultEdges,
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 600, // slower default for graphs to watch traversal
  selectedAlgorithm: 'bfs',
  startNodeId: 'A',
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

  setStartNodeId: (id) => {
    set({ startNodeId: id });
    get().runAlgorithm();
  },

  addNode: (x, y) => {
    const { nodes } = get();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let nextLabel = '';
    
    // Find next available character
    for (let i = 0; i < alphabet.length; i++) {
      const char = alphabet[i];
      if (!nodes.some((n) => n.label === char)) {
        nextLabel = char;
        break;
      }
    }

    if (!nextLabel) {
      nextLabel = `N${nodes.length + 1}`;
    }

    const newNode: GraphNode = {
      id: nextLabel,
      label: nextLabel,
      x,
      y,
    };

    set({
      nodes: [...nodes, newNode],
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  updateNodePosition: (id, x, y) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    }));
  },

  addEdge: (fromId, toId) => {
    const { edges } = get();
    // Prevent self-loops or duplicate edges
    if (fromId === toId) return;
    const exists = edges.some(
      (e) => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    );
    if (exists) return;

    const newEdge: GraphEdge = { from: fromId, to: toId };
    set({
      edges: [...edges, newEdge],
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  deleteNode: (id) => {
    const { nodes, edges, startNodeId } = get();
    const updatedNodes = nodes.filter((n) => n.id !== id);
    const updatedEdges = edges.filter((e) => e.from !== id && e.to !== id);
    let nextStartNodeId = startNodeId;
    
    if (startNodeId === id && updatedNodes.length > 0) {
      nextStartNodeId = updatedNodes[0].id;
    }

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
      startNodeId: nextStartNodeId,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  deleteEdge: (fromId, toId) => {
    const { edges } = get();
    const updatedEdges = edges.filter(
      (e) => !((e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId))
    );
    set({
      edges: updatedEdges,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  generateNewGraph: () => {
    get().loadPreset('default');
  },

  loadPreset: (presetType) => {
    let nodes: GraphNode[] = [];
    let edges: GraphEdge[] = [];

    switch (presetType) {
      case 'tree':
        nodes = [
          { id: 'A', label: 'A', x: 300, y: 60 },
          { id: 'B', label: 'B', x: 180, y: 150 },
          { id: 'C', label: 'C', x: 420, y: 150 },
          { id: 'D', label: 'D', x: 100, y: 260 },
          { id: 'E', label: 'E', x: 260, y: 260 },
          { id: 'F', label: 'F', x: 340, y: 260 },
          { id: 'G', label: 'G', x: 500, y: 260 },
        ];
        edges = [
          { from: 'A', to: 'B' },
          { from: 'A', to: 'C' },
          { from: 'B', to: 'D' },
          { from: 'B', to: 'E' },
          { from: 'C', to: 'F' },
          { from: 'C', to: 'G' },
        ];
        break;

      case 'cycle':
        nodes = [
          { id: 'A', label: 'A', x: 300, y: 70 },
          { id: 'B', label: 'B', x: 450, y: 160 },
          { id: 'C', label: 'C', x: 390, y: 310 },
          { id: 'D', label: 'D', x: 210, y: 310 },
          { id: 'E', label: 'E', x: 150, y: 160 },
        ];
        edges = [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'D' },
          { from: 'D', to: 'E' },
          { from: 'E', to: 'A' },
        ];
        break;

      case 'star':
        nodes = [
          { id: 'A', label: 'A', x: 300, y: 200 }, // Center
          { id: 'B', label: 'B', x: 300, y: 70 },
          { id: 'C', label: 'C', x: 440, y: 150 },
          { id: 'D', label: 'D', x: 390, y: 310 },
          { id: 'E', label: 'E', x: 210, y: 310 },
          { id: 'F', label: 'F', x: 160, y: 150 },
        ];
        edges = [
          { from: 'A', to: 'B' },
          { from: 'A', to: 'C' },
          { from: 'A', to: 'D' },
          { from: 'A', to: 'E' },
          { from: 'A', to: 'F' },
        ];
        break;

      case 'grid':
        nodes = [
          { id: 'A', label: 'A', x: 180, y: 100 },
          { id: 'B', label: 'B', x: 300, y: 100 },
          { id: 'C', label: 'C', x: 420, y: 100 },
          { id: 'D', label: 'D', x: 180, y: 220 },
          { id: 'E', label: 'E', x: 300, y: 220 },
          { id: 'F', label: 'F', x: 420, y: 220 },
          { id: 'G', label: 'G', x: 180, y: 340 },
          { id: 'H', label: 'H', x: 300, y: 340 },
          { id: 'I', label: 'I', x: 420, y: 340 },
        ];
        edges = [
          { from: 'A', to: 'B' }, { from: 'B', to: 'C' },
          { from: 'A', to: 'D' }, { from: 'B', to: 'E' }, { from: 'C', to: 'F' },
          { from: 'D', to: 'E' }, { from: 'E', to: 'F' },
          { from: 'D', to: 'G' }, { from: 'E', to: 'H' }, { from: 'F', to: 'I' },
          { from: 'G', to: 'H' }, { from: 'H', to: 'I' },
        ];
        break;

      case 'default':
      default:
        nodes = defaultNodes;
        edges = defaultEdges;
        break;
    }

    const nextStartNodeId = nodes[0]?.id || 'A';
    set({
      nodes,
      edges,
      startNodeId: nextStartNodeId,
      isPlaying: false,
      currentStepIndex: -1,
    });
    get().runAlgorithm();
  },

  runAlgorithm: () => {
    const { selectedAlgorithm, nodes, edges, startNodeId } = get();
    if (nodes.length === 0) {
      set({ steps: [], currentStepIndex: -1 });
      return;
    }

    const start = performance.now();
    const steps: GraphStep[] = [];
    const generator = selectedAlgorithm === 'bfs'
      ? bfs(nodes, edges, startNodeId)
      : dfs(nodes, edges, startNodeId);

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
      return { nodesVisited: 0, pathLength: 0 };
    }
    const currentStep = steps[currentStepIndex];
    return {
      nodesVisited: currentStep.visitedNodes.length,
      pathLength: currentStep.edgeTrail.length,
    };
  },
}));
