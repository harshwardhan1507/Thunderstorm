import { VisualizerStep } from "../../types/codeVisualizer.types";

/**
 * Align abstract simulated steps to specific lines of the user's pasted code.
 */
export function mapStepLines(
  code: string,
  steps: VisualizerStep[],
  visualizationType: string
): VisualizerStep[] {
  const lines = code.split("\n").map(l => l.trim());
  
  // Find key lines by keyword heuristic
  let compareLine = -1;
  let swapLine = -1;
  let recurseLine = -1;
  let returnLine = -1;
  let defaultLoopLine = -1;

  lines.forEach((line, index) => {
    const lineLower = line.toLowerCase();
    
    // Find loop lines
    if ((lineLower.includes("for") || lineLower.includes("while")) && defaultLoopLine === -1) {
      defaultLoopLine = index + 1;
    }
    // Find comparisons
    if ((lineLower.includes("if") || lineLower.includes("<") || lineLower.includes(">") || lineLower.includes("==") || lineLower.includes("===")) && compareLine === -1) {
      compareLine = index + 1;
    }
    // Find swap or array assignment lines
    if ((lineLower.includes("temp") || lineLower.includes("swap") || (lineLower.includes("[") && lineLower.includes("=") && !lineLower.includes("let") && !lineLower.includes("const"))) && swapLine === -1) {
      swapLine = index + 1;
    }
    // Find returns
    if (lineLower.includes("return") && returnLine === -1) {
      returnLine = index + 1;
    }
    // Find recursive calls
    if (lineLower.includes("fib(") || lineLower.includes("sort(") || lineLower.includes("search(") || lineLower.includes("dfs(")) {
      recurseLine = index + 1;
    }
  });

  // Fallbacks if not detected
  if (compareLine === -1) compareLine = defaultLoopLine !== -1 ? defaultLoopLine : 1;
  if (swapLine === -1) swapLine = compareLine + 1;
  if (returnLine === -1) returnLine = lines.length;

  return steps.map((step) => {
    let mappedLine = step.line;
    
    const hasCompare = step.visualEvents.some(e => e.type === "COMPARE" || e.type === "CONDITION_TRUE" || e.type === "CONDITION_FALSE");
    const hasSwap = step.visualEvents.some(e => e.type === "SWAP" || e.type === "WRITE");
    const hasRecurse = step.visualEvents.some(e => e.type === "RECURSE");
    const hasReturn = step.visualEvents.some(e => e.type === "RETURN");

    if (hasReturn) {
      mappedLine = returnLine;
    } else if (hasRecurse && recurseLine !== -1) {
      mappedLine = recurseLine;
    } else if (hasSwap) {
      mappedLine = swapLine;
    } else if (hasCompare) {
      mappedLine = compareLine;
    } else if (defaultLoopLine !== -1) {
      mappedLine = defaultLoopLine;
    }

    return {
      ...step,
      line: mappedLine
    };
  });
}
