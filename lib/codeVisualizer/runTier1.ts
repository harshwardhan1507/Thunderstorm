import {
  VisualizerStep,
  VisualEvent,
  VariableSnapshot,
  CallFrame,
  PERFORMANCE_PRESETS,
} from "../../types/codeVisualizer.types";
import { SortStep, DPStep } from "../../types/algorithm.types";
import { MatchedAlgorithmId } from "./matchAlgorithm";
import { findLineAnchors } from "./lineAnchors";

// Real generators — the SAME ones that power the main visualizer pages.
import { bubbleSort } from "../algorithms/sorting/bubbleSort";
import { mergeSort } from "../algorithms/sorting/mergeSort";
import { quickSort } from "../algorithms/sorting/quickSort";
import { heapSort } from "../algorithms/sorting/heapSort";
import { fibonacci, knapsack, lcs } from "../algorithms/dp/dpAlgorithms";

export interface Tier1Result {
  steps: VisualizerStep[];
  /** Which native visualizer best represents this run. */
  visualization: "sorting" | "dp";
  truncated: boolean;
  metrics: { totalReads: number; totalWrites: number; totalCompares: number; totalSwaps: number };
}

/**
 * Selection-sort and insertion-sort don't have dedicated generators in
 * lib/algorithms yet. Rather than ship a signature with no real backing
 * generator (which the spec forbids), we provide small REAL generators here
 * that genuinely execute the algorithm and yield accurate SortStep data.
 * These are real implementations, not canned traces.
 */
function* selectionSort(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], comparing: [min, j], swapped: false, line: 0 };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      yield { array: [...a], comparing: [i, min], swapped: true, line: 0 };
    }
  }
}

function* insertionSort(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      yield { array: [...a], comparing: [j, j + 1], swapped: false, line: 0 };
      a[j + 1] = a[j];
      j--;
      yield { array: [...a], comparing: [j + 1, i], swapped: true, line: 0 };
    }
    a[j + 1] = key;
  }
}

/**
 * Factorial as a real recursive generator yielding RECURSE/RETURN-style steps.
 * We model it with SortStep-incompatible data, so we adapt it directly to
 * VisualizerStep below (handled in the recursion branch).
 */
type RecStep = { kind: "call" | "return"; n: number; depth: number; value?: number; stack: number[] };
function* factorialRec(n: number): Generator<RecStep> {
  const stack: number[] = [];
  function* go(k: number, depth: number): Generator<RecStep, number> {
    stack.push(k);
    yield { kind: "call", n: k, depth, stack: [...stack] };
    let result: number;
    if (k <= 1) {
      result = 1;
    } else {
      const sub = yield* go(k - 1, depth + 1);
      result = k * sub;
    }
    yield { kind: "return", n: k, depth, value: result, stack: [...stack] };
    stack.pop();
    return result;
  }
  yield* go(n, 1);
}

function* fibonacciRec(n: number): Generator<RecStep> {
  const stack: number[] = [];
  function* go(k: number, depth: number): Generator<RecStep, number> {
    stack.push(k);
    yield { kind: "call", n: k, depth, stack: [...stack] };
    let result: number;
    if (k <= 1) {
      result = k;
    } else {
      const a = yield* go(k - 1, depth + 1);
      const b = yield* go(k - 2, depth + 1);
      result = a + b;
    }
    yield { kind: "return", n: k, depth, value: result, stack: [...stack] };
    stack.pop();
    return result;
  }
  yield* go(n, 1);
}

const SORTING_GENERATORS: Partial<Record<MatchedAlgorithmId, (arr: number[]) => Generator<SortStep>>> = {
  bubbleSort,
  mergeSort,
  quickSort,
  heapSort,
  selectionSort,
  insertionSort,
};

/**
 * Run a Tier-1 match through its REAL generator using the user's data, and
 * adapt the native step stream into VisualizerStep[] with approximate line
 * mapping into the user's pasted code.
 */
export function runTier1(
  matchedAlgorithm: MatchedAlgorithmId,
  userCode: string,
  dataset: number[],
  preset: "low" | "medium" | "high" = "medium"
): Tier1Result {
  const limits = PERFORMANCE_PRESETS[preset];
  const anchors = findLineAnchors(userCode);

  // ----- Sorting family -----
  if (SORTING_GENERATORS[matchedAlgorithm]) {
    return adaptSorting(
      SORTING_GENERATORS[matchedAlgorithm]!,
      matchedAlgorithm,
      dataset,
      anchors,
      limits.maxSteps
    );
  }

  // ----- Recursion family (factorial / fibonacci) -----
  if (matchedAlgorithm === "factorial" || matchedAlgorithm === "fibonacci") {
    // For recursion we visualize the call tree, driven by the user's chosen n.
    // Use the first dataset value as n (clamped) if provided, else default.
    const nRaw = dataset.length > 0 ? dataset[0] : matchedAlgorithm === "factorial" ? 5 : 6;
    const n = Math.max(0, Math.min(matchedAlgorithm === "fibonacci" ? 9 : 8, Math.round(nRaw)));
    const gen = matchedAlgorithm === "factorial" ? factorialRec(n) : fibonacciRec(n);
    return adaptRecursion(gen, matchedAlgorithm, n, anchors, limits.maxSteps);
  }

  // ----- DP family (knapsack / lcs) -----
  if (matchedAlgorithm === "knapsack") {
    // Build small items from the dataset: treat values as the dataset and
    // weights as a simple derivation so the run is real and reproducible.
    const values = dataset.length > 0 ? dataset.slice(0, 6) : [60, 100, 120];
    const items = values.map((v, i) => ({ value: v, weight: Math.max(1, Math.round(v / 20) + i + 1) }));
    const capacity = Math.max(...items.map((it) => it.weight)) + 4;
    return adaptDP(knapsack(items, capacity), "knapsack", anchors, limits.maxSteps);
  }

  if (matchedAlgorithm === "lcs") {
    // LCS needs two strings; derive deterministic demo strings.
    return adaptDP(lcs("AGCAT", "GAC"), "lcs", anchors, limits.maxSteps);
  }

  // Should never reach here because every signature id is handled above.
  return {
    steps: [],
    visualization: "sorting",
    truncated: false,
    metrics: { totalReads: 0, totalWrites: 0, totalCompares: 0, totalSwaps: 0 },
  };
}

// ----------------------------------------------------------------------------
// Adapters
// ----------------------------------------------------------------------------

function adaptSorting(
  gen: (arr: number[]) => Generator<SortStep>,
  algoId: MatchedAlgorithmId,
  dataset: number[],
  anchors: ReturnType<typeof findLineAnchors>,
  maxSteps: number
): Tier1Result {
  const steps: VisualizerStep[] = [];
  let compares = 0;
  let swaps = 0;
  let reads = 0;
  let writes = 0;
  let truncated = false;
  let idCounter = 0;

  for (const s of gen(dataset)) {
    if (steps.length >= maxSteps) {
      truncated = true;
      break;
    }
    const [a, b] = s.comparing;
    const valA = a !== undefined ? s.array[a] : undefined;
    const valB = b !== undefined ? s.array[b] : undefined;

    const events: VisualEvent[] = [];
    if (s.swapped) {
      swaps++;
      writes += 2;
      events.push({ type: "SWAP", timestamp: idCounter, payload: { indices: [a, b], values: [valA, valB] } });
    } else {
      compares++;
      reads += 2;
      events.push({ type: "COMPARE", timestamp: idCounter, payload: { left: a, right: b, indices: [a, b] } });
    }

    const vars: VariableSnapshot[] = [
      { variableId: "arr", value: [...s.array], timestamp: idCounter },
    ];
    if (a !== undefined) vars.push({ variableId: "i", value: a, timestamp: idCounter });
    if (b !== undefined) vars.push({ variableId: "j", value: b, timestamp: idCounter });

    const line = s.swapped ? anchors.swapLine : anchors.compareLine;

    steps.push({
      id: `t1-${idCounter++}`,
      line,
      visualEvents: events,
      variables: vars,
      callStack: [{ functionName: algoId, arguments: { arr: [...s.array] }, activeLine: line }],
      explanation: {
        title: s.swapped ? "Swapped elements" : "Compared elements",
        summary: s.swapped
          ? `Swapping arr[${a}] (${valB}) and arr[${b}] (${valA}).`
          : `Comparing arr[${a}] (${valA}) and arr[${b}] (${valB}).`,
        category: s.swapped ? "swap" : "comparison",
      },
      metrics: { comparisons: compares, swaps, operations: compares + swaps, recursionDepth: 0, reads, writes },
    });
  }

  return {
    steps,
    visualization: "sorting",
    truncated,
    metrics: { totalReads: reads, totalWrites: writes, totalCompares: compares, totalSwaps: swaps },
  };
}

function adaptRecursion(
  gen: Generator<RecStep>,
  algoId: MatchedAlgorithmId,
  n: number,
  anchors: ReturnType<typeof findLineAnchors>,
  maxSteps: number
): Tier1Result {
  const steps: VisualizerStep[] = [];
  let truncated = false;
  let idCounter = 0;
  let ops = 0;

  const fnName = algoId === "factorial" ? "factorial" : "fib";

  for (const s of gen) {
    if (steps.length >= maxSteps) {
      truncated = true;
      break;
    }
    ops++;
    const isCall = s.kind === "call";
    const events: VisualEvent[] = [
      isCall
        ? { type: "RECURSE", timestamp: idCounter, payload: { function: `${fnName}(${s.n})`, depth: s.depth } }
        : { type: "RETURN", timestamp: idCounter, payload: { value: s.value, function: `${fnName}(${s.n})` } },
    ];

    const callStack: CallFrame[] = s.stack.map((k) => ({
      functionName: fnName,
      arguments: { n: k },
      activeLine: isCall ? anchors.recurseLine : anchors.returnLine,
    }));

    steps.push({
      id: `t1-${idCounter++}`,
      line: isCall ? anchors.recurseLine : anchors.returnLine,
      visualEvents: events,
      variables: [{ variableId: "n", value: s.n, timestamp: idCounter }],
      callStack,
      explanation: {
        title: isCall ? `Call ${fnName}(${s.n})` : `Return ${s.value}`,
        summary: isCall
          ? `Entering ${fnName}(${s.n}) at depth ${s.depth}.`
          : `${fnName}(${s.n}) returns ${s.value}.`,
        category: "recursion",
      },
      metrics: { comparisons: 0, swaps: 0, operations: ops, recursionDepth: s.depth, reads: 0, writes: 0 },
    });
  }

  return {
    steps,
    visualization: "sorting", // recursion uses the CallStack visualizer, not bars
    truncated,
    metrics: { totalReads: 0, totalWrites: 0, totalCompares: 0, totalSwaps: 0 },
  };
}

function adaptDP(
  gen: Generator<DPStep>,
  algoId: MatchedAlgorithmId,
  anchors: ReturnType<typeof findLineAnchors>,
  maxSteps: number
): Tier1Result {
  const steps: VisualizerStep[] = [];
  let truncated = false;
  let idCounter = 0;
  let ops = 0;

  for (const s of gen) {
    if (steps.length >= maxSteps) {
      truncated = true;
      break;
    }
    ops++;
    const events: VisualEvent[] = [
      { type: "WRITE", timestamp: idCounter, payload: { activeCell: s.activeCell, dependentCells: s.dependentCells } },
    ];

    steps.push({
      id: `t1-${idCounter++}`,
      line: s.activeCell ? anchors.compareLine : anchors.loopLine,
      visualEvents: events,
      // Stash the full DP table so a DP visualizer can render it honestly.
      variables: [
        { variableId: "dpTable", value: s.table, timestamp: idCounter },
        { variableId: "activeCell", value: s.activeCell, timestamp: idCounter },
        { variableId: "dependentCells", value: s.dependentCells, timestamp: idCounter },
      ],
      callStack: [{ functionName: algoId, arguments: {}, activeLine: anchors.loopLine }],
      explanation: {
        title: "DP cell update",
        summary: s.formula,
        category: "general",
      },
      metrics: { comparisons: 0, swaps: 0, operations: ops, recursionDepth: 0, reads: 0, writes: 1 },
    });
  }

  return {
    steps,
    visualization: "dp",
    truncated,
    metrics: { totalReads: 0, totalWrites: ops, totalCompares: 0, totalSwaps: 0 },
  };
}
