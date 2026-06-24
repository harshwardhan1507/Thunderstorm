import { describe, it, expect } from 'vitest';
import { dijkstra } from './dijkstra';
import { astar } from './astar';

describe('Pathfinding Algorithm Generators', () => {
  const rows = 5;
  const cols = 5;
  const startNode = '0,0';
  const endNode = '4,4';
  const walls = new Set<string>(['1,1', '2,1', '3,1']); // obstacle wall

  it('dijkstra finds the shortest path avoiding walls', () => {
    const gen = dijkstra(rows, cols, startNode, endNode, walls);
    let finalPath: string[] = [];
    for (const step of gen) {
      finalPath = step.path;
    }
    expect(finalPath.length).toBeGreaterThan(0);
    expect(finalPath[0]).toBe('0,0');
    expect(finalPath[finalPath.length - 1]).toBe('4,4');
    // Ensure no coordinates in path touch walls
    finalPath.forEach((coord) => {
      expect(walls.has(coord)).toBe(false);
    });
  });

  it('astar finds the shortest path avoiding walls', () => {
    const gen = astar(rows, cols, startNode, endNode, walls);
    let finalPath: string[] = [];
    for (const step of gen) {
      finalPath = step.path;
    }
    expect(finalPath.length).toBeGreaterThan(0);
    expect(finalPath[0]).toBe('0,0');
    expect(finalPath[finalPath.length - 1]).toBe('4,4');
    finalPath.forEach((coord) => {
      expect(walls.has(coord)).toBe(false);
    });
  });
});
