export interface FunctionNode {
  name: string;
  calls: string[];
  recursive: boolean;
  recursionType: "direct" | "divide_and_conquer" | "tree" | "exponential" | "none";
}

export interface CodeIR {
  language: "java" | "cpp" | "c" | "python" | "typescript" | "javascript";
  confidence: {
    language: number;      // 0 - 100
    structures: number;    // 0 - 100
    patterns: number;      // 0 - 100
    complexity: number;    // 0 - 100
  };
  inferredStructures: Array<
    "array" | "matrix" | "stack" | "queue" | "hashmap" | "heap" | "tree" | "graph" | "trie" | "linkedlist"
  >;
  inferredPatterns: Array<
    "recursion" | "backtracking" | "divide_and_conquer" | "dp" | "greedy" | "sliding_window" | "two_pointer" | "bfs" | "dfs" | "memoization"
  >;
  functions: FunctionNode[];
  nestedLoops: number;
  complexityEstimate: {
    time: "O(1)" | "O(log n)" | "O(n)" | "O(n log n)" | "O(n²)" | "O(2ⁿ)" | "O(V + E)" | "O(E log V)";
    space: "O(1)" | "O(log n)" | "O(n)" | "O(n²)" | "O(V + E)";
    confidence: number;
  };
}

export type VisualEventType =
  | "COMPARE"
  | "READ"
  | "WRITE"
  | "SWAP"
  | "VISIT"
  | "TRAVERSE"
  | "PUSH"
  | "POP"
  | "RECURSE"
  | "RETURN"
  | "CONDITION_TRUE"
  | "CONDITION_FALSE"
  | "ALLOCATE"
  | "DEALLOCATE";

export interface VisualEvent {
  type: VisualEventType;
  timestamp: number;
  payload: any;
}

export interface VariableSnapshot {
  variableId: string;
  value: any;
  timestamp: number;
}

export interface CallFrame {
  functionName: string;
  arguments: Record<string, any>;
  activeLine: number;
}

export interface StepExplanation {
  title: string;
  summary: string;
  category: "comparison" | "swap" | "recursion" | "traversal" | "general";
}

export interface VisualizerStep {
  id: string;
  line: number;
  visualEvents: VisualEvent[];
  variables: VariableSnapshot[];  // Delta variables at this point
  callStack: CallFrame[];
  explanation: StepExplanation;
  metrics: {
    comparisons: number;
    swaps: number;
    operations: number;
    recursionDepth: number;
    reads: number;
    writes: number;
  };
}

export interface ClassificationResult {
  primary: {
    algorithm: string;
    confidence: number;
    visualizationType: string;
  };
  alternatives: Array<{
    algorithm: string;
    confidence: number;
  }>;
}

export interface VisualizerCapabilities {
  supportsCompare: boolean;
  supportsBattle: boolean;
  supportsTimeline: boolean;
  supportsUserDatasets: boolean;
}

export interface VisualizerRegistry {
  [key: string]: {
    component: React.ComponentType<any>;
    capabilities: VisualizerCapabilities;
  };
}

export const PERFORMANCE_PRESETS = {
  low: { maxSteps: 1000, maxArraySize: 100, maxGraphNodes: 50 },
  medium: { maxSteps: 2500, maxArraySize: 250, maxGraphNodes: 150 },
  high: { maxSteps: 5000, maxArraySize: 500, maxGraphNodes: 300 }
} as const;

export interface VisualizerSession {
  sessionId: string;
  code: string;
  language: string;
  customDataset?: number[];
  ir: CodeIR;
  classification: ClassificationResult;
}
