import { describe, it, expect } from "vitest";
import { interpretJS } from "./jsInterpreter";

describe("interpretJS", () => {
  it("executes a simple loop and accumulates a sum", () => {
    const code = `
let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum = sum + i;
}`;
    const res = interpretJS(code);
    expect(res.error).toBeUndefined();
    // Final snapshot should have sum = 15
    const last = res.steps[res.steps.length - 1];
    const sumVar = last.variables.find((v) => v.variableId === "sum");
    expect(sumVar?.value).toBe(15);
  });

  it("tracks real line numbers from the source", () => {
    const code = `let a = 1;\nlet b = 2;\nlet c = a + b;`;
    const res = interpretJS(code);
    const lines = res.steps.map((s) => s.line);
    // Should include lines 1, 2, and 3
    expect(lines).toContain(1);
    expect(lines).toContain(2);
    expect(lines).toContain(3);
  });

  it("produces a real recursive call stack for factorial", () => {
    const code = `
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
factorial(4);`;
    const res = interpretJS(code);
    expect(res.error).toBeUndefined();
    // Maximum recursion depth observed should reach 4
    const maxDepth = Math.max(...res.steps.map((s) => s.metrics.recursionDepth));
    expect(maxDepth).toBeGreaterThanOrEqual(4);
    // There must be RECURSE and RETURN events
    expect(res.steps.some((s) => s.visualEvents.some((e) => e.type === "RECURSE"))).toBe(true);
    expect(res.steps.some((s) => s.visualEvents.some((e) => e.type === "RETURN"))).toBe(true);
  });

  it("handles array indexing and mutation", () => {
    const code = `
let arr = [3, 1, 2];
arr[0] = arr[1];
let x = arr[0];`;
    const res = interpretJS(code);
    expect(res.error).toBeUndefined();
    const last = res.steps[res.steps.length - 1];
    const xVar = last.variables.find((v) => v.variableId === "x");
    expect(xVar?.value).toBe(1);
  });

  it("injects the user dataset into the first array literal", () => {
    const code = `let arr = [1, 2, 3];\nlet n = arr.length;`;
    const res = interpretJS(code, [9, 9, 9, 9]);
    const last = res.steps[res.steps.length - 1];
    const nVar = last.variables.find((v) => v.variableId === "n");
    expect(nVar?.value).toBe(4);
  });

  it("reports an honest error for unsupported syntax (classes)", () => {
    const code = `class Foo { bar() { return 1; } }`;
    const res = interpretJS(code);
    expect(res.error).toBeDefined();
  });

  it("reports a parse error for invalid JS", () => {
    const code = `for (let i = 0; {`;
    const res = interpretJS(code);
    expect(res.error).toContain("Parse error");
  });

  it("truncates infinite loops via the step/time budget", () => {
    const code = `let i = 0;\nwhile (i >= 0) { i = i + 1; }`;
    const res = interpretJS(code, undefined, "low");
    expect(res.truncated).toBe(true);
    expect(res.steps.length).toBeLessThanOrEqual(1000);
  });

  it("evaluates Math.floor and ternary expressions", () => {
    const code = `let mid = Math.floor((0 + 7) / 2);\nlet label = mid > 3 ? 100 : 200;`;
    const res = interpretJS(code);
    const last = res.steps[res.steps.length - 1];
    expect(last.variables.find((v) => v.variableId === "mid")?.value).toBe(3);
    expect(last.variables.find((v) => v.variableId === "label")?.value).toBe(200);
  });
});
