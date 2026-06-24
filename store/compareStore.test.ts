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
});
