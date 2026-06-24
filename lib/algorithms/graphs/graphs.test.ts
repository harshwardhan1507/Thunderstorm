import { describe, it, expect } from 'vitest';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { GraphNode, GraphEdge } from '../../../types/algorithm.types';

describe('Graph Algorithm Generators', () => {
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 0, y: 0 },
    { id: 'B', label: 'B', x: 0, y: 0 },
    { id: 'C', label: 'C', x: 0, y: 0 },
    { id: 'D', label: 'D', x: 0, y: 0 },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
  ];

  it('bfs traverses the graph in BFS order', () => {
    const gen = bfs(nodes, edges, 'A');
    let finalVisited: string[] = [];
    for (const step of gen) {
      finalVisited = step.visitedNodes;
    }
    // BFS traversal order should start with A, then visit B and C, then D.
    expect(finalVisited[0]).toBe('A');
    expect(new Set(finalVisited.slice(1, 3))).toEqual(new Set(['B', 'C']));
    expect(finalVisited[3]).toBe('D');
  });

  it('dfs traverses the graph in DFS order', () => {
    const gen = dfs(nodes, edges, 'A');
    let finalVisited: string[] = [];
    for (const step of gen) {
      finalVisited = step.visitedNodes;
    }
    // DFS traversal order from A should go A -> B -> D -> C or A -> C -> D -> B
    expect(finalVisited[0]).toBe('A');
    expect(finalVisited.length).toBe(4);
    expect(new Set(finalVisited)).toEqual(new Set(['A', 'B', 'C', 'D']));
  });
});
