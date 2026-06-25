import { CodeIR } from "../../types/codeVisualizer.types";

/**
 * extractDataset
 * --------------
 * Scans the user's pasted source for the FIRST literal numeric array/list
 * initialization and returns it as number[]. This is a deliberately small,
 * honest extractor:
 *   - It only finds literal arrays written directly in the source.
 *   - It does NOT track variable reassignment, computed values, or input
 *     coming from stdin / Scanner / argv.
 *   - If nothing literal is found it returns `null` so the caller can be
 *     honest with the user ("no array found in your code") instead of
 *     silently substituting a fake dataset.
 *
 * Supported per-language literal forms (at minimum):
 *   Java:        int[] arr = {1, 2, 3}   |  int arr[] = {1, 2, 3}
 *   C++:         vector<int> arr = {1,2,3} | int arr[] = {1, 2, 3}
 *   Python:      arr = [1, 2, 3]
 *   JS/TS:       const/let/var arr = [1, 2, 3]
 */
export function extractDataset(
  code: string,
  language: CodeIR["language"]
): number[] | null {
  if (!code || !code.trim()) return null;

  // Collect candidate "inside-the-brackets" strings in source order, then
  // pick the first one that parses to a non-empty numeric array.
  const candidates: { index: number; body: string }[] = [];

  const pushMatches = (regex: RegExp, bodyGroup: number) => {
    let m: RegExpExecArray | null;
    const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
    while ((m = re.exec(code)) !== null) {
      const body = m[bodyGroup];
      if (body !== undefined) {
        candidates.push({ index: m.index, body });
      }
      if (m.index === re.lastIndex) re.lastIndex++; // avoid zero-width loops
    }
  };

  // Curly-brace initializers: Java / C++  ->  = { 1, 2, 3 }
  // Matches `... = { ... }` capturing the inner body.
  pushMatches(/=\s*\{([^{}]*)\}/g, 1);

  // Square-bracket initializers: Python / JS / TS  ->  = [ 1, 2, 3 ]
  pushMatches(/=\s*\[([^\[\]]*)\]/g, 1);

  if (candidates.length === 0) return null;

  // Sort by position so "first literal array found" wins regardless of which
  // regex matched it.
  candidates.sort((a, b) => a.index - b.index);

  for (const cand of candidates) {
    const parsed = parseNumberList(cand.body);
    if (parsed && parsed.length > 0) {
      return parsed;
    }
  }

  return null;
}

/**
 * Parse a raw comma-separated body (the text between the brackets) into
 * number[]. Defensively handles whitespace, trailing commas, and ignores any
 * token that is not a clean number (so `{1, 2, x}` yields null because it is
 * not a pure numeric literal array — we don't want to silently drop symbols
 * and pretend we understood the data).
 */
function parseNumberList(body: string): number[] | null {
  const trimmed = body.trim();
  if (trimmed === "") return null;

  const tokens = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0); // tolerate trailing comma -> empty token

  if (tokens.length === 0) return null;

  const out: number[] = [];
  for (const tok of tokens) {
    // Accept integers and decimals, optional leading sign. Reject anything
    // containing letters/identifiers/expressions.
    if (!/^[-+]?\d+(\.\d+)?$/.test(tok)) {
      return null; // not a pure numeric literal array
    }
    out.push(Number(tok));
  }

  return out;
}
