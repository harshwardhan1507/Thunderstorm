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
