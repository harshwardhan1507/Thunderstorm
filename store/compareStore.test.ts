import { describe, it, expect, beforeEach } from 'vitest';
import { useCompareStore } from './compareStore';

describe('Zustand Compare Store', () => {
  beforeEach(() => {
    useCompareStore.setState({
      left: {
        array: [],
        initialArray: [],
        steps: [],
        currentStepIndex: -1,
        selectedAlgorithm: 'bubble',
        executionTime: 0,
        isFinished: false,
        finishStepCount: 0,
        finishRealTime: 0,
      },
      right: {
        array: [],
        initialArray: [],
        steps: [],
        currentStepIndex: -1,
        selectedAlgorithm: 'quick',
        executionTime: 0,
        isFinished: false,
        finishStepCount: 0,
        finishRealTime: 0,
      },
      isPlaying: false,
      speed: 100,
      arraySize: 15,
      mode: 'compare',
      winner: null,
    });
  });

  it('generates identical arrays and runs both algorithms', () => {
    const store = useCompareStore.getState();
    store.generateNewArrays();
    
    const updated = useCompareStore.getState();
    expect(updated.left.array.length).toBe(15);
    expect(updated.right.array.length).toBe(15);
    expect(updated.left.initialArray).toEqual(updated.right.initialArray);
    expect(updated.left.steps.length).toBeGreaterThan(0);
    expect(updated.right.steps.length).toBeGreaterThan(0);
  });

  it('correctly handles Battle Mode execution and winner selection', () => {
    const store = useCompareStore.getState();
    store.setMode('battle');
    store.setArraySize(10); // generates and computes steps
    
    let state = useCompareStore.getState();
    expect(state.winner).toBeNull();
    expect(state.left.isFinished).toBe(false);
    expect(state.right.isFinished).toBe(false);

    // Step until finished
    let loops = 0;
    while (loops < 500 && (state.left.currentStepIndex < state.left.steps.length - 1 || state.right.currentStepIndex < state.right.steps.length - 1)) {
      store.stepForwardBoth();
      state = useCompareStore.getState();
      loops++;
    }

    expect(state.left.isFinished).toBe(true);
    expect(state.right.isFinished).toBe(true);
    expect(state.winner).not.toBeNull();
  });
});
