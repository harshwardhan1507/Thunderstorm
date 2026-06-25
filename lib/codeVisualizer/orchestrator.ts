import { CodeIR, VisualizerStep } from "../../types/codeVisualizer.types";
import { analyzeCode } from "./analysis";
import { extractDataset } from "./extractData";
import { matchAlgorithm, AlgorithmMatch } from "./matchAlgorithm";
import { runTier1 } from "./runTier1";
import { interpretJS } from "./jsInterpreter";
import { buildStaticReport, StaticAnalysisReport } from "./staticAnalysis";

/**
 * orchestrator
 * ------------
 * The single honest entry point for the Code Visualizer. It decides which of
 * the three tiers can TRUTHFULLY visualize the user's code and runs it:
 *
 *   Tier 1 — RECOGNIZED ALGORITHM
 *     The code matches a known DSA signature (bubble/quick/merge/heap/selection/
 *     insertion sort, recursive fibonacci/factorial, knapsack/LCS). We run the
 *     REAL generator on the user's data and map steps to their code lines.
 *
 *   Tier 2 — REAL JS EXECUTION
 *     The code is JavaScript we can actually interpret. We tree-walk the AST and
 *     emit a genuine execution trace (real lines, real call stack, real vars).
 *
 *   Tier 3 — STATIC ANALYSIS ONLY
 *     The code is a non-JS language, or JS the interpreter can't run. We do NOT
 *     fabricate a trace; we return a structural report and say so plainly.
 *
 * `dataSource` lets the UI control whether Tier 1 uses the dataset extracted
 * from the code or a manual dataset supplied by the user.
 */

export type Tier = 1 | 2 | 3;

export interface OrchestrationResult {
  tier: Tier;
  steps: VisualizerStep[];
  ir: CodeIR;

  // Tier 1 specifics
  matchedAlgorithm?: string;
  matchConfidence?: number;
  visualization?: "sorting" | "dp";

  // Dataset provenance (Tier 1 / Tier 2)
  datasetUsed?: number[] | null;
  datasetSource?: "extracted" | "manual" | "none";

  // Tier 3 specifics
  staticReport?: StaticAnalysisReport;

  // Universal flags
  truncated: boolean;
  error?: string;
  /** Human-readable note about approximations or limitations, shown in UI. */
  note: string;
}

export interface OrchestrationOptions {
  /** Which dataset to feed Tier 1/2: from the code, or the manual one. */
  dataSource?: "extracted" | "manual";
  manualDataset?: number[];
  preset?: "low" | "medium" | "high";
}

function isJavaScript(ir: CodeIR): boolean {
  return ir.language === "javascript" || ir.language === "typescript";
}

export function orchestrate(code: string, options: OrchestrationOptions = {}): OrchestrationResult {
  const { dataSource = "extracted", manualDataset = [], preset = "medium" } = options;

  const ir = analyzeCode(code);

  // Resolve dataset + provenance.
  const extracted = extractDataset(code, ir.language);
  let dataset: number[] | null;
  let datasetSource: "extracted" | "manual" | "none";
  if (dataSource === "manual" && manualDataset.length > 0) {
    dataset = manualDataset;
    datasetSource = "manual";
  } else if (extracted && extracted.length > 0) {
    dataset = extracted;
    datasetSource = "extracted";
  } else if (manualDataset.length > 0) {
    dataset = manualDataset;
    datasetSource = "manual";
  } else {
    dataset = null;
    datasetSource = "none";
  }

  // ---------------- Tier 1: recognized algorithm ----------------
  const match: AlgorithmMatch | null = matchAlgorithm(ir, code);
  if (match) {
    // Recursion algorithms can run with a scalar n even without an array.
    const isRecursion = match.matchedAlgorithm === "fibonacci" || match.matchedAlgorithm === "factorial";
    const isDP = match.matchedAlgorithm === "knapsack" || match.matchedAlgorithm === "lcs";
    const effectiveData = dataset ?? (isRecursion || isDP ? [] : null);

    if (effectiveData !== null) {
      const t1 = runTier1(match.matchedAlgorithm, code, effectiveData, preset);
      return {
        tier: 1,
        steps: t1.steps,
        ir,
        matchedAlgorithm: match.matchedAlgorithm,
        matchConfidence: match.confidence,
        visualization: t1.visualization,
        datasetUsed: dataset,
        datasetSource,
        truncated: t1.truncated,
        note:
          `Recognized as ${match.matchedAlgorithm} (${match.confidence}% confidence). ` +
          `Ran the real ${match.matchedAlgorithm} generator on ${
            datasetSource === "extracted"
              ? "the data found in your code"
              : datasetSource === "manual"
              ? "your manual dataset"
              : "a derived input"
          }. Line highlighting is approximate (mapped to structural anchors in your code).`,
      };
    }
    // Matched an array algorithm but found no data at all -> fall through to
    // Tier 2/3 rather than invent numbers.
  }

  // ---------------- Tier 2: real JS execution ----------------
  if (isJavaScript(ir)) {
    const t2 = interpretJS(code, dataset ?? undefined, preset);
    if (!t2.error && t2.steps.length > 0) {
      return {
        tier: 2,
        steps: t2.steps,
        ir,
        datasetUsed: dataset,
        datasetSource,
        truncated: t2.truncated,
        note:
          `Executed your JavaScript directly with a real interpreter. ` +
          `Line numbers, the call stack, and variable values are all genuine runtime state.`,
      };
    }
    // Interpreter failed -> honest static fallback with the real reason.
    const reason =
      t2.error
        ? `The interpreter could not run this code: ${t2.error}`
        : `The interpreter produced no executable steps for this snippet.`;
    return {
      tier: 3,
      steps: [],
      ir,
      datasetUsed: dataset,
      datasetSource,
      truncated: false,
      error: t2.error,
      staticReport: buildStaticReport(ir, reason),
      note: `Live execution unavailable. Showing static structural analysis only. ${reason}`,
    };
  }

  // ---------------- Tier 3: static analysis only ----------------
  const reason = `Live execution is only available for JavaScript. Your code was detected as ${ir.language.toUpperCase()}, so no step-by-step trace can be generated honestly.`;
  return {
    tier: 3,
    steps: [],
    ir,
    datasetUsed: dataset,
    datasetSource,
    truncated: false,
    staticReport: buildStaticReport(ir, reason),
    note: `Static structural analysis only — ${ir.language.toUpperCase()} cannot be executed in-browser.`,
  };
}
