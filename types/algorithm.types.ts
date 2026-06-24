export interface SortStep {
  array: number[];
  comparing: number[];
  swapped: boolean;
  line: number;
}

export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
}

export interface AlgorithmMetadata {
  name: string;
  timeComplexity: AlgorithmComplexity;
  spaceComplexity: string;
}

// Graphs Visualizer Types
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface GraphStep {
  visitedNodes: string[]; // Node IDs in order of visit
  currentNodeId: string | null;
  edgeTrail: [string, string][]; // Edges in the current path
  line: number; // Active line in code panel
}

// Pathfinding Visualizer Types
export interface PathfindingStep {
  visited: string[]; // Visited coordinate keys "r,c"
  path: string[]; // Final path coordinate keys
  current: string | null;
  line: number;
}

// Trees Visualizer Types
export interface TreeNode {
  id: string;
  value: number;
  x: number;
  y: number;
  leftId: string | null;
  rightId: string | null;
  height: number; // For AVL balance factor
}

export interface TreeStep {
  treeStructure: Record<string, TreeNode>; // Snapshot of current nodes
  rootId: string | null;
  activeNodeId: string | null;
  comparingNodeIds: string[];
  rotationFlashIds: string[]; // Nodes flashing due to AVL rotation
  line: number;
}

// Dynamic Programming Types
export interface DPStep {
  table: (number | null)[][]; // Snapshot of DP grid values
  activeCell: [number, number] | null;
  dependentCells: [number, number][];
  formula: string;
  line: number;
}

// Greedy Types
export interface Activity {
  id: string;
  start: number;
  end: number;
}

export interface HuffmanNode {
  id: string;
  label: string;
  freq: number;
  leftId: string | null;
  rightId: string | null;
  x: number;
  y: number;
}

export interface GreedyStep {
  activities?: {
    selected: string[];
    discarded: string[];
    active: string | null;
  };
  huffmanTree?: {
    nodes: Record<string, HuffmanNode>;
    rootId: string | null;
    queue: { id: string; label: string; freq: number }[];
    activeIds: string[];
  };
  line: number;
}

