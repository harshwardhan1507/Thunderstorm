import { describe, it, expect, beforeEach } from 'vitest';
import { useGraphStore } from './graphStore';

describe('Zustand Graph Store', () => {
  beforeEach(() => {
    // Load default preset to reset state
    useGraphStore.getState().loadPreset('default');
  });

  it('initializes with default nodes and edges and runs algorithm', () => {
    const state = useGraphStore.getState();
    expect(state.nodes.length).toBe(5);
    expect(state.edges.length).toBe(6);
    expect(state.steps.length).toBeGreaterThan(0);
    expect(state.currentStepIndex).toBe(-1);
  });

  it('supports adding and deleting nodes', () => {
    const store = useGraphStore.getState();
    store.addNode(100, 150);

    let state = useGraphStore.getState();
    expect(state.nodes.some((n) => n.id === 'F')).toBe(true);

    store.deleteNode('F');
    state = useGraphStore.getState();
    expect(state.nodes.some((n) => n.id === 'F')).toBe(false);
  });

  it('supports adding and deleting edges', () => {
    const store = useGraphStore.getState();
    // E-B is not in default edges
    store.addEdge('E', 'B');

    let state = useGraphStore.getState();
    expect(state.edges.some((e) => e.from === 'E' && e.to === 'B')).toBe(true);

    store.deleteEdge('E', 'B');
    state = useGraphStore.getState();
    expect(state.edges.some((e) => e.from === 'E' && e.to === 'B')).toBe(false);
  });

  it('updates node positions correctly', () => {
    const store = useGraphStore.getState();
    store.updateNodePosition('A', 500, 600);

    const state = useGraphStore.getState();
    const nodeA = state.nodes.find((n) => n.id === 'A');
    expect(nodeA).toBeDefined();
    expect(nodeA!.x).toBe(500);
    expect(nodeA!.y).toBe(600);
  });

  it('switches algorithms and regenerates steps', () => {
    const store = useGraphStore.getState();
    store.setSelectedAlgorithm('dfs');

    const state = useGraphStore.getState();
    expect(state.selectedAlgorithm).toBe('dfs');
    expect(state.steps.length).toBeGreaterThan(0);
  });
});
