import { CodeIR } from "../../types/codeVisualizer.types";

/**
 * staticAnalysis (Tier 3)
 * -----------------------
 * For code we CANNOT honestly execute (non-JS languages, or JS that the
 * interpreter doesn't support), we refuse to fabricate a step-by-step trace.
 * Instead we return a structural report derived entirely from the already
 * computed CodeIR. The UI presents this as a clearly-labelled "Static Analysis
 * Only — no execution trace available" view.
 *
 * This is the honesty backstop: no fake animation, no invented dataset, no
 * pretend line cursor. Just what we can truthfully infer about the code.
 */

export interface StaticAnalysisReport {
  language: string;
  detectedStructures: string[];
  detectedPatterns: string[];
  functions: Array<{ name: string; recursive: boolean; recursionType: string; calls: string[] }>;
  nestedLoops: number;
  estimatedTime: string;
  estimatedSpace: string;
  complexityConfidence: number;
  /** Plain-language reason why a live trace is not available. */
  reason: string;
}

export function buildStaticReport(ir: CodeIR, reason: string): StaticAnalysisReport {
  return {
    language: ir.language,
    detectedStructures: [...ir.inferredStructures],
    detectedPatterns: [...ir.inferredPatterns],
    functions: ir.functions.map((f) => ({
      name: f.name,
      recursive: f.recursive,
      recursionType: f.recursionType,
      calls: [...f.calls],
    })),
    nestedLoops: ir.nestedLoops,
    estimatedTime: ir.complexityEstimate.time,
    estimatedSpace: ir.complexityEstimate.space,
    complexityConfidence: ir.complexityEstimate.confidence,
    reason,
  };
}
