import { CodeIR } from "../../types/codeVisualizer.types";
import { preprocessCode } from "./analysis";

/**
 * matchAlgorithm
 * --------------
 * Scores the already-computed CodeIR (+ raw code) against a registry of known
 * algorithm signatures and returns the single best match IF it clears the
 * confidence threshold. Otherwise returns null, which means: this snippet is
 * NOT a recognized DSA algorithm, fall through to Tier 2 / Tier 3.
 *
 * Design rules:
 *   - We REUSE ir.functions / ir.inferredStructures / ir.inferredPatterns /
 *     ir.nestedLoops rather than re-parsing the code.
 *   - Each signature combines MULTIPLE structural signals so a single stray
 *     regex can't trigger a false positive.
 *   - Every `id` here MUST correspond to a real generator we can run in
 *     runTier1.ts. Do not add a signature without a backing generator.
 */

export const MATCH_CONFIDENCE_THRESHOLD = 60;

export type MatchedAlgorithmId =
  | "bubbleSort"
  | "selectionSort"
  | "insertionSort"
  | "mergeSort"
  | "quickSort"
  | "heapSort"
  | "fibonacci"
  | "factorial"
  | "knapsack"
  | "lcs";

export interface AlgorithmMatch {
  matchedAlgorithm: MatchedAlgorithmId;
  confidence: number;
}

interface AlgorithmSignature {
  id: MatchedAlgorithmId;
  category: "sorting" | "dp" | "recursion";
  /** Returns a 0-100 confidence score for this snippet being `id`. */
  match: (ir: CodeIR, code: string) => number;
}

/**
 * Find any function that calls itself, directly from the source. This is more
 * robust than relying on ir.functions[].recursive, which can miss single-line
 * function bodies where the definition and the self-call share a line.
 * Returns the self-call count (occurrences of `name(` minus the definition).
 */
function detectSelfCall(ir: CodeIR, code: string): { name: string; count: number } | null {
  let best: { name: string; count: number } | null = null;
  for (const fn of ir.functions) {
    const re = new RegExp(`\\b${fn.name}\\s*\\(`, "g");
    const total = (code.match(re) || []).length;
    const calls = Math.max(0, total - 1); // subtract the definition
    if (calls >= 1 && (!best || calls > best.count)) {
      best = { name: fn.name, count: calls };
    }
  }
  return best;
}

/** Whether any function is recursive (IR flag OR direct self-call detection). */
function hasRecursion(ir: CodeIR, code: string): boolean {
  if (ir.functions.some((f) => f.recursive) || ir.inferredPatterns.includes("recursion")) {
    return true;
  }
  return detectSelfCall(ir, code) !== null;
}

/** Count how many recursive self-calls the recursive function makes. */
function selfCallCount(ir: CodeIR, code: string): number {
  const recFn = ir.functions.find((f) => f.recursive);
  if (recFn) {
    const re = new RegExp(`\\b${recFn.name}\\s*\\(`, "g");
    const total = (code.match(re) || []).length;
    return Math.max(0, total - 1);
  }
  const detected = detectSelfCall(ir, code);
  return detected ? detected.count : 0;
}

const SIGNATURES: AlgorithmSignature[] = [
  // ---------------------------------------------------------------- Bubble
  {
    id: "bubbleSort",
    category: "sorting",
    match: (ir, code) => {
      let score = 0;
      if (ir.nestedLoops >= 2) score += 35;
      if (!hasRecursion(ir, code)) score += 10;
      // Adjacent-index comparison: arr[j] > arr[j+1] (bracket or .at variants)
      if (/\w+\s*\[\s*\w+\s*\]\s*[<>]=?\s*\w+\s*\[\s*\w+\s*\+\s*1\s*\]/.test(code)) score += 30;
      // Temp-variable swap OR destructuring swap
      if (/temp\s*=|tmp\s*=/.test(code)) score += 15;
      if (/\[\s*\w+\s*\[\s*\w+\s*\]\s*,\s*\w+\s*\[\s*\w+\s*\+\s*1\s*\]\s*\]\s*=/.test(code)) score += 15;
      if (/\bbubble/i.test(code)) score += 15;
      return Math.min(100, score);
    },
  },
  // ------------------------------------------------------------- Selection
  {
    id: "selectionSort",
    category: "sorting",
    match: (ir, code) => {
      let score = 0;
      if (ir.nestedLoops >= 2) score += 25;
      if (!hasRecursion(ir, code)) score += 5;
      // Tracks a min / minIndex variable
      if (/min[_]?(idx|index)?\s*=/i.test(code) || /\bsmallest\b/i.test(code)) score += 35;
      // The defining structural trait: the swap happens AFTER the inner loop,
      // not inside it. We approximate by detecting a swap that is NOT directly
      // guarded by an adjacent-index comparison (which would be bubble).
      const hasAdjacentCompare = /\w+\s*\[\s*\w+\s*\]\s*[<>]=?\s*\w+\s*\[\s*\w+\s*\+\s*1\s*\]/.test(code);
      if (!hasAdjacentCompare) score += 15;
      if (/\bselection\b/i.test(code)) score += 20;
      return Math.min(100, score);
    },
  },
  // ------------------------------------------------------------- Insertion
  {
    id: "insertionSort",
    category: "sorting",
    match: (ir, code) => {
      let score = 0;
      // Single outer for + inner while (shifting), NOT classic nested-for.
      const hasFor = /\bfor\b/.test(code);
      const hasWhile = /\bwhile\b/.test(code);
      if (hasFor && hasWhile) score += 35;
      if (ir.nestedLoops <= 2) score += 5;
      // Value shifting: arr[j+1] = arr[j]  (move element up, no temp swap pair)
      if (/\w+\s*\[\s*\w+\s*\+\s*1\s*\]\s*=\s*\w+\s*\[\s*\w+\s*\]/.test(code)) score += 30;
      // A "key" / "current" value being held while shifting
      if (/\b(key|current|val)\s*=/.test(code)) score += 15;
      if (/\binsertion\b/i.test(code)) score += 20;
      return Math.min(100, score);
    },
  },
  // ----------------------------------------------------------------- Merge
  {
    id: "mergeSort",
    category: "sorting",
    match: (ir, code) => {
      let score = 0;
      if (hasRecursion(ir, code)) score += 25;
      if (selfCallCount(ir, code) >= 2) score += 20;
      // A merge helper or merging loop comparing two sub-array pointers.
      if (/\bmerge\b/i.test(code)) score += 35;
      if (/\bmid\b|\bmiddle\b|\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\s*2/.test(code)) score += 15;
      if (ir.inferredPatterns.includes("divide_and_conquer")) score += 10;
      return Math.min(100, score);
    },
  },
  // ----------------------------------------------------------------- Quick
  {
    id: "quickSort",
    category: "sorting",
    match: (ir, code) => {
      let score = 0;
      if (hasRecursion(ir, code)) score += 25;
      if (/\bpivot\b/i.test(code)) score += 35;
      if (/\bpartition\b/i.test(code)) score += 20;
      // Recursive calls on two distinct sub-ranges (low, p-1) and (p+1, high)
      if (/\(\s*\w+\s*,\s*\w+\s*-\s*1\s*\)/.test(code) && /\(\s*\w+\s*\+\s*1\s*,\s*\w+\s*\)/.test(code)) score += 20;
      if (/\bquick\b/i.test(code)) score += 10;
      return Math.min(100, score);
    },
  },
  // ------------------------------------------------------------------ Heap
  {
    id: "heapSort",
    category: "sorting",
    match: (ir, code) => {
      let score = 0;
      if (/\bheapify\b/i.test(code)) score += 45;
      // Sift-down child index patterns 2*i+1 / 2*i+2
      if (/2\s*\*\s*\w+\s*\+\s*1/.test(code)) score += 25;
      if (/2\s*\*\s*\w+\s*\+\s*2/.test(code)) score += 20;
      if (/\bheap\b/i.test(code)) score += 10;
      return Math.min(100, score);
    },
  },
  // ------------------------------------------------------------- Fibonacci
  {
    id: "fibonacci",
    category: "recursion",
    match: (ir, code) => {
      let score = 0;
      if (hasRecursion(ir, code)) score += 20;
      const recFn = ir.functions.find((f) => f.recursive);
      // Exponential: two-or-more self-calls (IR flag OR direct detection)
      if ((recFn && recFn.recursionType === "exponential") || selfCallCount(ir, code) >= 2) score += 25;
      // Two recursive self-calls with n-1 and n-2 style arguments
      if (/\b\w+\s*\(\s*\w+\s*-\s*1\s*\)/.test(code) && /\b\w+\s*\(\s*\w+\s*-\s*2\s*\)/.test(code)) score += 35;
      if (/\bfib/i.test(code)) score += 20;
      return Math.min(100, score);
    },
  },
  // ------------------------------------------------------------- Factorial
  {
    id: "factorial",
    category: "recursion",
    match: (ir, code) => {
      let score = 0;
      if (hasRecursion(ir, code)) score += 20;
      const recFn = ir.functions.find((f) => f.recursive);
      if ((recFn && recFn.recursionType === "direct") || selfCallCount(ir, code) === 1) score += 20;
      if (selfCallCount(ir, code) === 1) score += 15;
      // Single recursive self-call with n-1, multiplied by n
      if (/\b\w+\s*\(\s*\w+\s*-\s*1\s*\)/.test(code) && !/\(\s*\w+\s*-\s*2\s*\)/.test(code)) score += 20;
      if (/\bn\s*\*|\*\s*\w+\s*\(\s*\w+\s*-\s*1/.test(code)) score += 15;
      if (/\bfact/i.test(code)) score += 25;
      return Math.min(100, score);
    },
  },
  // -------------------------------------------------------------- Knapsack
  {
    id: "knapsack",
    category: "dp",
    match: (ir, code) => {
      let score = 0;
      if (ir.inferredPatterns.includes("dp")) score += 25;
      // 2D dp/memo/K array
      if (/\b(dp|memo|K)\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]/.test(code)) score += 20;
      if (/\bknapsack\b/i.test(code)) score += 35;
      if (/\bweight\b/i.test(code) && /\b(value|val|profit)\b/i.test(code)) score += 20;
      if (/\bcapacity\b|\bW\b/.test(code)) score += 10;
      return Math.min(100, score);
    },
  },
  // ------------------------------------------------------------------- LCS
  {
    id: "lcs",
    category: "dp",
    match: (ir, code) => {
      let score = 0;
      if (ir.inferredPatterns.includes("dp")) score += 25;
      if (/\blcs\b/i.test(code) || /longest\s+common\s+subsequence/i.test(code)) score += 40;
      // 2D dp + diagonal access dp[i-1][j-1]
      if (/\b\w+\s*\[\s*\w+\s*-\s*1\s*\]\s*\[\s*\w+\s*-\s*1\s*\]/.test(code)) score += 25;
      // string length comparisons in loop bounds
      if (/\.length|len\s*\(/.test(code)) score += 10;
      return Math.min(100, score);
    },
  },
];

export function matchAlgorithm(ir: CodeIR, rawCode: string): AlgorithmMatch | null {
  // Strip comments/strings so signature regexes match real code, not prose.
  const code = preprocessCode(rawCode);

  let best: AlgorithmMatch | null = null;
  for (const sig of SIGNATURES) {
    const confidence = sig.match(ir, code);
    if (!best || confidence > best.confidence) {
      best = { matchedAlgorithm: sig.id, confidence };
    }
  }

  if (best && best.confidence >= MATCH_CONFIDENCE_THRESHOLD) {
    return best;
  }
  return null;
}
