import { describe, it, expect, beforeEach } from "vitest";
import { useCodeVisualizerStore } from "./codeVisualizerStore";
import { TimelineBuffer } from "../lib/codeVisualizer/timeline";

describe("codeVisualizerStore", () => {
  beforeEach(() => {
    TimelineBuffer.clear();
  });

  it("initializes state properly", () => {
    const state = useCodeVisualizerStore.getState();
    expect(state.code).toBe("");
    expect(state.isPlaying).toBe(false);
    expect(state.currentStepIndex).toBe(-1);
  });

  it("analyzes code and sets up the steps timeline", () => {
    const code = `
      function bubbleSort(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > arr[i+1]) {
             let t = arr[i];
             arr[i] = arr[i+1];
             arr[i+1] = t;
          }
        }
      }
    `;
    const store = useCodeVisualizerStore.getState();
    store.analyzeCode(code);

    const updatedState = useCodeVisualizerStore.getState();
    expect(updatedState.code).toBe(code);
    expect(updatedState.totalSteps).toBeGreaterThan(0);
    expect(TimelineBuffer.getLength()).toBeGreaterThan(0);
  });

  it("updates step indexes on stepForward", () => {
    const state = useCodeVisualizerStore.getState();
    state.setCurrentStepIndex(-1);
    state.stepForward();
    expect(useCodeVisualizerStore.getState().currentStepIndex).toBe(0);
  });
});
