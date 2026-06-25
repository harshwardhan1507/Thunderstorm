import { describe, it, expect } from "vitest";
import { orchestrate } from "./orchestrator";

describe("orchestrate — Tier 1 (recognized algorithms)", () => {
  it("routes bubble sort to Tier 1 and runs the real generator on extracted data", () => {
    const code = `
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
}
let data = [5, 2, 8, 1];`;
    const res = orchestrate(code);
    expect(res.tier).toBe(1);
    expect(res.matchedAlgorithm).toBe("bubbleSort");
    expect(res.datasetSource).toBe("extracted");
    expect(res.datasetUsed).toEqual([5, 2, 8, 1]);
    expect(res.steps.length).toBeGreaterThan(0);
  });

  it("uses the manual dataset when dataSource is manual", () => {
    const code = `
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length - 1; j++)
      if (arr[j] > arr[j+1]) { let t = arr[j]; arr[j]=arr[j+1]; arr[j+1]=t; }
}
let data = [1, 2, 3];`;
    const res = orchestrate(code, { dataSource: "manual", manualDataset: [9, 7, 5] });
    expect(res.tier).toBe(1);
    expect(res.datasetSource).toBe("manual");
    expect(res.datasetUsed).toEqual([9, 7, 5]);
  });

  it("routes recursive fibonacci to Tier 1 even with no array", () => {
    const code = `function fib(n){ if(n<=1) return n; return fib(n-1)+fib(n-2); }`;
    const res = orchestrate(code);
    expect(res.tier).toBe(1);
    expect(res.matchedAlgorithm).toBe("fibonacci");
  });
});

describe("orchestrate — Tier 2 (real JS execution)", () => {
  it("routes generic JS to Tier 2 with a real trace", () => {
    const code = `
let total = 0;
for (let i = 0; i < 4; i++) {
  total = total + i * 2;
}`;
    const res = orchestrate(code);
    expect(res.tier).toBe(2);
    expect(res.steps.length).toBeGreaterThan(0);
    const last = res.steps[res.steps.length - 1];
    expect(last.variables.find((v) => v.variableId === "total")?.value).toBe(12);
  });

  it("falls back to Tier 3 when JS uses unsupported syntax", () => {
    const code = `class Stack { constructor() { this.items = []; } }
const s = new Stack();`;
    const res = orchestrate(code);
    expect(res.tier).toBe(3);
    expect(res.staticReport).toBeDefined();
    expect(res.error).toBeDefined();
  });
});

describe("orchestrate — Tier 3 (static only)", () => {
  it("routes Java to Tier 3 static analysis", () => {
    const code = `
public class Main {
  public static void main(String[] args) {
    int x = 5;
    System.out.println(x);
  }
}`;
    const res = orchestrate(code);
    expect(res.tier).toBe(3);
    expect(res.staticReport).toBeDefined();
    expect(res.staticReport!.language).toBe("java");
    expect(res.steps.length).toBe(0);
  });

  it("routes Python to Tier 3 static analysis with structure detection", () => {
    const code = `
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`;
    const res = orchestrate(code);
    expect(res.tier).toBe(3);
    expect(res.staticReport!.language).toBe("python");
  });
});
