import { CodeIR, ClassificationResult } from "../../types/codeVisualizer.types";

/**
 * Classifies the pasted code against algorithm signatures and returns ranked candidates.
 */
export function classifyCode(code: string, ir: CodeIR): ClassificationResult {
  const codeLower = code.toLowerCase();
  const candidates: Array<{ algorithm: string; confidence: number; visualizationType: string }> = [];

  // 1. Sorting Algorithms
  if (ir.inferredStructures.includes("array")) {
    // Bubble Sort
    let bubbleScore = 0;
    if (ir.nestedLoops === 2) bubbleScore += 40;
    if (codeLower.includes("swap") || codeLower.includes("temp =")) bubbleScore += 20;
    if (codeLower.includes("bubble")) bubbleScore += 30;
    if (codeLower.includes("arr[j] > arr[j+1]") || codeLower.includes("arr[j] < arr[j+1]")) bubbleScore += 15;
    candidates.push({ algorithm: "Bubble Sort", confidence: Math.min(99, bubbleScore), visualizationType: "sorting" });

    // Quick Sort
    let quickScore = 0;
    if (ir.inferredPatterns.includes("divide_and_conquer")) quickScore += 30;
    if (codeLower.includes("pivot")) quickScore += 45;
    if (codeLower.includes("partition")) quickScore += 20;
    if (codeLower.includes("quick")) quickScore += 20;
    candidates.push({ algorithm: "Quick Sort", confidence: Math.min(99, quickScore), visualizationType: "sorting" });

    // Merge Sort
    let mergeScore = 0;
    if (ir.inferredPatterns.includes("divide_and_conquer")) mergeScore += 35;
    if (codeLower.includes("merge")) mergeScore += 45;
    if (codeLower.includes("mid") && codeLower.includes("concat")) mergeScore += 10;
    candidates.push({ algorithm: "Merge Sort", confidence: Math.min(99, mergeScore), visualizationType: "sorting" });

    // Selection/Insertion Sort
    let selectionScore = 0;
    if (ir.nestedLoops === 2) selectionScore += 30;
    if (codeLower.includes("min_idx") || codeLower.includes("minidx") || codeLower.includes("smallest")) selectionScore += 50;
    candidates.push({ algorithm: "Selection Sort", confidence: Math.min(99, selectionScore), visualizationType: "sorting" });

    // Binary Search
    let binarySearchScore = 0;
    if (ir.complexityEstimate.time === "O(log n)") binarySearchScore += 30;
    if (codeLower.includes("low") || codeLower.includes("left") || /\bl\b/.test(codeLower)) binarySearchScore += 15;
    if (codeLower.includes("high") || codeLower.includes("right") || /\br\b/.test(codeLower)) binarySearchScore += 15;
    if (codeLower.includes("mid") || /\bm\b/.test(codeLower)) binarySearchScore += 20;
    if (codeLower.includes("binary") || codeLower.includes("search")) binarySearchScore += 20;
    candidates.push({ algorithm: "Binary Search", confidence: Math.min(99, binarySearchScore), visualizationType: "sorting" });
  }

  // 2. Graph Algorithms
  if (ir.inferredStructures.includes("graph")) {
    // Dijkstra
    let dijkstraScore = 0;
    if (codeLower.includes("dist") || codeLower.includes("distance")) dijkstraScore += 30;
    if (codeLower.includes("priorityqueue") || codeLower.includes("pq") || codeLower.includes("minheap")) dijkstraScore += 35;
    if (codeLower.includes("dijkstra")) dijkstraScore += 30;
    candidates.push({ algorithm: "Dijkstra's Algorithm", confidence: Math.min(99, dijkstraScore), visualizationType: "graph" });

    // BFS
    let bfsScore = 0;
    if (ir.inferredStructures.includes("queue")) bfsScore += 35;
    if (codeLower.includes("visited") && codeLower.includes("queue")) bfsScore += 35;
    if (codeLower.includes("bfs") || codeLower.includes("breadth")) bfsScore += 25;
    candidates.push({ algorithm: "BFS (Breadth-First Search)", confidence: Math.min(99, bfsScore), visualizationType: "graph" });

    // DFS
    let dfsScore = 0;
    if (ir.inferredPatterns.includes("recursion")) dfsScore += 30;
    if (codeLower.includes("visited") && codeLower.includes("dfs")) dfsScore += 45;
    if (codeLower.includes("depth") || codeLower.includes("stack")) dfsScore += 20;
    candidates.push({ algorithm: "DFS (Depth-First Search)", confidence: Math.min(99, dfsScore), visualizationType: "graph" });
  }

  // 3. Tree Algorithms
  if (ir.inferredStructures.includes("tree")) {
    // BST Operations
    let bstScore = 0;
    if (codeLower.includes("insert") || codeLower.includes("delete") || codeLower.includes("remove")) bstScore += 30;
    if (codeLower.includes("bst") || codeLower.includes("binary search tree")) bstScore += 45;
    candidates.push({ algorithm: "BST Operations", confidence: Math.min(99, bstScore), visualizationType: "tree" });

    // AVL Tree balancing
    let avlScore = 0;
    if (codeLower.includes("rotate") || codeLower.includes("rotation") || codeLower.includes("balance")) avlScore += 50;
    if (codeLower.includes("avl")) avlScore += 40;
    candidates.push({ algorithm: "AVL Rotations", confidence: Math.min(99, avlScore), visualizationType: "tree" });
  }

  // 4. Dynamic Programming
  if (ir.inferredPatterns.includes("dp")) {
    let dpScore = 0;
    if (ir.inferredStructures.includes("matrix")) dpScore += 35;
    if (codeLower.includes("lcs") || codeLower.includes("knapsack") || codeLower.includes("coin")) dpScore += 40;
    if (codeLower.includes("dp[i]") || codeLower.includes("memo[")) dpScore += 20;
    candidates.push({ algorithm: "DP Table Visualizer", confidence: Math.min(99, dpScore), visualizationType: "dp" });
  }

  // Sort candidates by confidence descending
  candidates.sort((a, b) => b.confidence - a.confidence);

  // Filter candidates with confidence > 10
  const validCandidates = candidates.filter((c) => c.confidence > 10);

  if (validCandidates.length > 0) {
    const primary = validCandidates[0];
    const alternatives = validCandidates.slice(1).map((c) => ({
      algorithm: c.algorithm,
      confidence: c.confidence,
    }));

    return {
      primary,
      alternatives,
    };
  }

  // Default fallback: Generic Array or Recursion Explorer
  const defaultVisualizer = ir.inferredPatterns.includes("recursion")
    ? "generic-recursion"
    : ir.inferredStructures.includes("tree")
    ? "generic-tree"
    : ir.inferredStructures.includes("graph")
    ? "generic-graph"
    : "generic-array";

  return {
    primary: {
      algorithm: "Generic Structural Representation",
      confidence: 100,
      visualizationType: defaultVisualizer,
    },
    alternatives: [],
  };
}
