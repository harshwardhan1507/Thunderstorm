import { describe, it, expect, beforeEach } from 'vitest';
import { useVisualizerStore } from './visualizerStore';

describe('Zustand Visualizer Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useVisualizerStore.setState({
      array: [],
      initialArray: [],
      steps: [],
      currentStepIndex: -1,
      isPlaying: false,
      speed: 100,
      arraySize: 25,
      selectedAlgorithm: 'bubble',
      language: 'javascript',
      executionTime: 0,
    });
  });

  it('generates a new array and populates steps', () => {
    const store = useVisualizerStore.getState();
    store.setArraySize(10); // this should trigger generateNewArray and runAlgorithm
    
    const updatedStore = useVisualizerStore.getState();
    expect(updatedStore.array.length).toBe(10);
    expect(updatedStore.initialArray.length).toBe(10);
    expect(updatedStore.steps.length).toBeGreaterThan(0);
    expect(updatedStore.currentStepIndex).toBe(-1);
  });

  it('steps forward and backward correctly', () => {
    const store = useVisualizerStore.getState();
    store.setArraySize(10);

    const afterInitStore = useVisualizerStore.getState();
    const firstStepArray = afterInitStore.steps[0].array;

    afterInitStore.stepForward();
    
    const steppedStore = useVisualizerStore.getState();
    expect(steppedStore.currentStepIndex).toBe(0);
    expect(steppedStore.array).toEqual(firstStepArray);

    steppedStore.stepBackward();
    const backwardStore = useVisualizerStore.getState();
    expect(backwardStore.currentStepIndex).toBe(-1);
    expect(backwardStore.array).toEqual(backwardStore.initialArray);
  });

  it('calculates metrics correctly during stepping', () => {
    const store = useVisualizerStore.getState();
    store.setArraySize(10);
    
    let state = useVisualizerStore.getState();
    expect(state.getMetrics()).toEqual({ comparisons: 0, swaps: 0 });

    // Step forward 5 times or until end
    const stepsToRun = Math.min(5, state.steps.length);
    for (let i = 0; i < stepsToRun; i++) {
      state.stepForward();
      state = useVisualizerStore.getState();
    }

    const metrics = state.getMetrics();
    expect(metrics.comparisons + metrics.swaps).toBeGreaterThan(0);
  });
});
