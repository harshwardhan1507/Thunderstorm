import { describe, it, expect, beforeEach } from "vitest";
import { useCodeVisualizerStore } from "./codeVisualizerStore";
import { TimelineBuffer } from "../lib/codeVisualizer/timeline";

describe("codeVisualizerStore", () => {
  beforeEach(() => {
    TimelineBuffer.clear();
    // reset core fields between tests
    useCodeVisualizerStore.setState({
      code: "",
      dataSource: "extracted",
      manualDataset: [],
      currentStepIndex: -1,
      isPlaying: false,
      totalSteps: 0,
    });
  });

  it("initializes state properly", () => {
    const state = useCodeVisualizerStore.getState();
    expect(state.code).toBe("");
    expect(state.isPlaying).toBe(false);
    expect(state.currentStepIndex).toBe(-1);
    expect(state.tier).toBe(null);
  });

  it("routes a recognized sort to Tier 1 and populates the timeline", () => {
    const code = `
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let t = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = t;
      }
    }
  }
}
let data = [5, 3, 1];`;
    useCodeVisualizerStore.getState().analyzeCode(code);
    const s = useCodeVisualizerStore.getState();
    expect(s.tier).toBe(1);
    expect(s.matchedAlgorithm).toBe("bubbleSort");
    expect(s.datasetSource).toBe("extracted");
    expect(s.totalSteps).toBeGreaterThan(0);
    expect(TimelineBuffer.getLength()).toBeGreaterThan(0);
  });

  it("routes generic JS to Tier 2", () => {
    const code = `let x = 0;\nfor (let i = 0; i < 3; i++) { x = x + i; }`;
    useCodeVisualizerStore.getState().analyzeCode(code);
    expect(useCodeVisualizerStore.getState().tier).toBe(2);
  });

  it("routes Java to Tier 3 static analysis", () => {
    const code = `public class A { public static void main(String[] a){ int x=1; } }`;
    useCodeVisualizerStore.getState().analyzeCode(code);
    const s = useCodeVisualizerStore.getState();
    expect(s.tier).toBe(3);
    expect(s.staticReport).not.toBe(null);
    expect(s.totalSteps).toBe(0);
  });

  it("re-runs analysis when switching data source to manual", () => {
    const code = `
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length - 1; j++)
      if (arr[j] > arr[j+1]) { let t=arr[j]; arr[j]=arr[j+1]; arr[j+1]=t; }
}
let data = [1, 2, 3];`;
    const store = useCodeVisualizerStore.getState();
    store.setManualDataset([9, 8, 7]);
    store.analyzeCode(code);
    store.setDataSource("manual");
    const s = useCodeVisualizerStore.getState();
    expect(s.datasetSource).toBe("manual");
    expect(s.datasetUsed).toEqual([9, 8, 7]);
  });

  it("updates step index on stepForward", () => {
    useCodeVisualizerStore.setState({ totalSteps: 5, currentStepIndex: -1 });
    useCodeVisualizerStore.getState().stepForward();
    expect(useCodeVisualizerStore.getState().currentStepIndex).toBe(0);
  });
});
