import { describe, it, expect } from "vitest";
import { analyzeCode } from "./analysis";
import { matchAlgorithm, MATCH_CONFIDENCE_THRESHOLD } from "./matchAlgorithm";

function match(code: string) {
  const ir = analyzeCode(code);
  return matchAlgorithm(ir, code);
}

describe("matchAlgorithm", () => {
  it("matches bubble sort", () => {
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
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("bubbleSort");
    expect(res!.confidence).toBeGreaterThanOrEqual(MATCH_CONFIDENCE_THRESHOLD);
  });

  it("matches quick sort", () => {
    const code = `
function quickSort(arr, low, high) {
  if (low < high) {
    let pivot = partition(arr, low, high);
    quickSort(arr, low, pivot - 1);
    quickSort(arr, pivot + 1, high);
  }
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("quickSort");
  });

  it("matches merge sort", () => {
    const code = `
function mergeSort(arr) {
  if (arr.length < 2) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("mergeSort");
  });

  it("matches heap sort via heapify", () => {
    const code = `
function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("heapSort");
  });

  it("matches recursive fibonacci", () => {
    const code = `
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("fibonacci");
  });

  it("matches recursive factorial", () => {
    const code = `
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("factorial");
  });

  it("matches knapsack", () => {
    const code = `
function knapsack(weights, values, capacity, n) {
  let dp = [];
  for (let i = 0; i <= n; i++) dp[i] = [];
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]]);
    }
  }
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("knapsack");
  });

  it("matches LCS", () => {
    const code = `
function lcs(a, b) {
  let dp = [];
  for (let i = 0; i <= a.length; i++) dp[i] = [];
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
}`;
    const res = match(code);
    expect(res?.matchedAlgorithm).toBe("lcs");
  });

  it("returns null for unrelated general code (calculator)", () => {
    const code = `
function add(a, b) { return a + b; }
function calculate(op, x, y) {
  if (op === "+") return add(x, y);
  return 0;
}`;
    const res = match(code);
    expect(res).toBeNull();
  });

  it("returns null for a plain string palindrome check", () => {
    const code = `
function isPalindrome(s) {
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++; j--;
  }
  return true;
}`;
    const res = match(code);
    expect(res).toBeNull();
  });
});
