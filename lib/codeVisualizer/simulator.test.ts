import { describe, it, expect } from "vitest";
import { simulateCode } from "./simulator";
import { mapStepLines } from "./lineMapper";

describe("simulateCode", () => {
  it("simulates array sorting correctly", () => {
    const code = `
      for (let i = 0; i < n; i++) {
        if (arr[j] > arr[j+1]) {
          swap(arr, j, j+1);
        }
      }
    `;
    const { steps } = simulateCode(code, "sorting");
    expect(steps.length).toBeGreaterThan(0);
    
    const step = steps[0];
    expect(step.visualEvents.some(e => e.type === "READ")).toBe(true);
    expect(step.visualEvents.some(e => e.type === "COMPARE")).toBe(true);
    expect(step.metrics.operations).toBeGreaterThan(0);
  });

  it("simulates recursion call stack", () => {
    const code = `
      function fib(n) {
        if (n <= 1) return n;
        return fib(n-1) + fib(n-2);
      }
    `;
    const { steps } = simulateCode(code, "generic-recursion");
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some(s => s.visualEvents.some(e => e.type === "RECURSE"))).toBe(true);
  });
});

describe("mapStepLines", () => {
  it("maps lines based on visual events", () => {
    const code = `
      function bubbleSort(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > arr[i+1]) {
            let temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
          }
        }
      }
    `;
    const { steps } = simulateCode(code, "sorting");
    const mapped = mapStepLines(code, steps, "sorting");
    
    // Step with swap should be on swap line (line 5, 6 or 7)
    const swapStep = mapped.find(s => s.visualEvents.some(e => e.type === "SWAP"));
    if (swapStep) {
      expect(swapStep.line).toBe(5); // first swap line keyword matching "temp"
    }
  });
});
