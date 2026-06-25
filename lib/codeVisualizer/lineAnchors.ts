/**
 * lineAnchors
 * -----------
 * APPROXIMATE line mapping for Tier 1.
 *
 * The real generators (lib/algorithms/...) yield `step.line` numbers that refer
 * to THEIR OWN internal reference snippet, not the user's pasted code. To
 * highlight a sensible line in the USER's code instead, we scan the user's
 * source once and identify a small set of "anchor" lines by regex:
 *
 *   - loopLine      : the (first) for/while loop header
 *   - compareLine   : the (first) comparison / if condition
 *   - swapLine      : the (first) swap / array write / shift line
 *   - recurseLine   : the (first) recursive-call-looking line
 *   - returnLine    : the (first) return statement
 *
 * Then each canonical "step category" (compare / swap / recurse / return /
 * loop) maps to the nearest matching anchor. This is intentionally a
 * heuristic: it does NOT claim per-statement precision, only that the
 * highlighted line is the structurally-relevant one for that kind of step.
 * It is "honest" because the trace data itself is real (from the real
 * generator); only the visual line cursor is approximate, and the UI labels
 * it as such.
 */

export interface LineAnchors {
  loopLine: number;
  compareLine: number;
  swapLine: number;
  recurseLine: number;
  returnLine: number;
}

export function findLineAnchors(code: string): LineAnchors {
  const rawLines = code.split("\n");

  let loopLine = -1;
  let compareLine = -1;
  let swapLine = -1;
  let recurseLine = -1;
  let returnLine = -1;

  rawLines.forEach((line, idx) => {
    const lineNo = idx + 1; // 1-indexed
    const l = line.trim();
    const lower = l.toLowerCase();
    if (!l) return;

    if (loopLine === -1 && /\bfor\b|\bwhile\b/.test(lower)) {
      loopLine = lineNo;
    }
    if (
      compareLine === -1 &&
      (/\bif\b/.test(lower) ||
        /[<>]=?|===|==|!=/.test(l))
    ) {
      compareLine = lineNo;
    }
    if (
      swapLine === -1 &&
      (/\btemp\b|\btmp\b|\bswap\b/.test(lower) ||
        // array write: arr[..] = ...  (not a declaration)
        (/\w+\s*\[[^\]]*\]\s*=/.test(l) &&
          !/\b(let|const|var|int|double|float|vector)\b/.test(lower)))
    ) {
      swapLine = lineNo;
    }
    // recursive-ish call: identifier( ... ) appearing on a return or assignment
    if (
      recurseLine === -1 &&
      /\breturn\b.*\w+\s*\(|=\s*\w+\s*\(/.test(l) &&
      /\(.*\b\w+\s*[-+]\s*\d+/.test(l)
    ) {
      recurseLine = lineNo;
    }
    if (returnLine === -1 && /\breturn\b/.test(lower)) {
      returnLine = lineNo;
    }
  });

  // Sensible fallbacks so we never return -1.
  if (loopLine === -1) loopLine = 1;
  if (compareLine === -1) compareLine = loopLine;
  if (swapLine === -1) swapLine = compareLine;
  if (recurseLine === -1) recurseLine = returnLine !== -1 ? returnLine : compareLine;
  if (returnLine === -1) returnLine = Math.max(1, rawLines.length);

  return { loopLine, compareLine, swapLine, recurseLine, returnLine };
}
