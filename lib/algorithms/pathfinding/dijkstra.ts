import { PathfindingStep } from '../../../types/algorithm.types';

export function* dijkstra(
  rows: number,
  cols: number,
  startNode: string, // "r,c"
  endNode: string, // "r,c"
  walls: Set<string>
): Generator<PathfindingStep> {
  const visited: string[] = [];
  const dist: Record<string, number> = {};
  const prev: Record<string, string> = {};
  const pq: string[] = [];

  // Initialize distances
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const node = `${r},${c}`;
      dist[node] = Infinity;
    }
  }

  dist[startNode] = 0;
  pq.push(startNode);

  yield { visited: [], path: [], current: null, line: 1 };
  yield { visited: [], path: [], current: null, line: 2 };
  yield { visited: [], path: [], current: null, line: 3 };

  const visitedSet = new Set<string>();

  while (pq.length > 0) {
    yield { visited: [...visited], path: [], current: null, line: 4 };

    // Find node in pq with minimum distance
    let minIndex = 0;
    for (let i = 1; i < pq.length; i++) {
      if (dist[pq[i]] < dist[pq[minIndex]]) {
        minIndex = i;
      }
    }
    const curr = pq.splice(minIndex, 1)[0];
    yield { visited: [...visited], path: [], current: curr, line: 5 };

    if (curr === endNode) {
      yield { visited: [...visited], path: [], current: curr, line: 6 };
      break;
    }

    if (dist[curr] === Infinity) {
      break;
    }

    if (curr !== startNode && curr !== endNode) {
      visited.push(curr);
      visitedSet.add(curr);
    }

    const [r, c] = curr.split(',').map(Number);
    const directions = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const neighbor = `${nr},${nc}`;

      // Check grid boundaries and walls
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !walls.has(neighbor)) {
        yield { visited: [...visited], path: [], current: curr, line: 7 };

        const newDist = dist[curr] + 1;
        yield { visited: [...visited], path: [], current: curr, line: 8 };

        yield { visited: [...visited], path: [], current: curr, line: 9 };
        if (newDist < dist[neighbor]) {
          dist[neighbor] = newDist;
          yield { visited: [...visited], path: [], current: curr, line: 10 };

          prev[neighbor] = curr;
          yield { visited: [...visited], path: [], current: curr, line: 11 };

          if (!pq.includes(neighbor) && !visitedSet.has(neighbor)) {
            pq.push(neighbor);
            yield { visited: [...visited], path: [], current: curr, line: 12 };
          }
        }
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let temp = endNode;
  if (prev[temp] || temp === startNode) {
    while (temp) {
      path.unshift(temp);
      temp = prev[temp];
    }
  }

  // Final step showing the trail
  yield { visited: [...visited], path, current: null, line: 6 };
}
