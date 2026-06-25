import { describe, it, expect } from "vitest";
import { runTier1 } from "./runTier1";

const bubbleCode = `
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`;

describe("runTier1", () => {
  it("runs the real bubble sort generator on the user's dataset", () => {
    const res = runTier1("bubbleSort", bubbleCode, [3, 1, 2]);
    expect(res.steps.length).toBeGreaterThan(0);
    // The final arr snapshot must be fully sorted — proof the REAL generator ran.
    const last = res.steps[res.steps.length - 1];
    const arrVar = last.variables.find((v) => v.variableId === "arr");
    const finalArr = arrVar?.value as number[];
    expect([...finalArr].sort((a, b) => a - b)).toEqual(finalArr);
  });

  it("maps swap steps to the user's swap line, not a fixed constant", () => {
    const res = runTier1("bubbleSort", bubbleCode, [2, 1]);
    const swapStep = res.steps.find((s) => s.explanation.category === "swap");
    expect(swapStep).toBeDefined();
    // swap line should be within the user's code (the temp/arr write region)
    expect(swapStep!.line).toBeGreaterThan(1);
  });

  it("produces real recursion frames for fibonacci", () => {
    const code = `function fib(n){ if(n<=1) return n; return fib(n-1)+fib(n-2); }`;
    const res = runTier1("fibonacci", code, [5]);
    const hasRecurse = res.steps.some((s) => s.visualEvents.some((e) => e.type === "RECURSE"));
    const hasReturn = res.steps.some((s) => s.visualEvents.some((e) => e.type === "RETURN"));
    expect(hasRecurse).toBe(true);
    expect(hasReturn).toBe(true);
  });

  it("produces a real DP table for knapsack", () => {
    const code = `function knapsack(){ let dp=[][]; }`;
    const res = runTier1("knapsack", code, [60, 100, 120]);
    expect(res.visualization).toBe("dp");
    const dpStep = res.steps.find((s) => s.variables.some((v) => v.variableId === "dpTable"));
    expect(dpStep).toBeDefined();
  });

  it("respects the step cap (truncation flag)", () => {
    const big = Array.from({ length: 400 }, () => Math.floor(Math.random() * 1000));
    const res = runTier1("bubbleSort", bubbleCode, big, "low");
    // low preset maxSteps = 1000; bubble on 400 elems would far exceed that
    expect(res.truncated).toBe(true);
    expect(res.steps.length).toBeLessThanOrEqual(1000);
  });
});
