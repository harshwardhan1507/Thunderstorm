import { PathfindingStep } from '../../../types/algorithm.types';

const getManhattanDistance = (nodeA: string, nodeB: string): number => {
  const [r1, c1] = nodeA.split(',').map(Number);
  const [r2, c2] = nodeB.split(',').map(Number);
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
};

export function* astar(
  rows: number,
  cols: number,
  startNode: string,
  endNode: string,
  walls: Set<string>
): Generator<PathfindingStep> {
  const visited: string[] = [];
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const prev: Record<string, string> = {};
  const pq: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const node = `${r},${c}`;
      gScore[node] = Infinity;
      fScore[node] = Infinity;
    }
  }

  gScore[startNode] = 0;
  fScore[startNode] = getManhattanDistance(startNode, endNode);
  pq.push(startNode);

  yield { visited: [], path: [], current: null, line: 1 };
  yield { visited: [], path: [], current: null, line: 2 };
  yield { visited: [], path: [], current: null, line: 3 };
  yield { visited: [], path: [], current: null, line: 4 };

  const visitedSet = new Set<string>();

  while (pq.length > 0) {
    yield { visited: [...visited], path: [], current: null, line: 5 };

    // Find node in pq with minimum fScore
    let minIndex = 0;
    for (let i = 1; i < pq.length; i++) {
      if (fScore[pq[i]] < fScore[pq[minIndex]]) {
        minIndex = i;
      }
    }
    const curr = pq.splice(minIndex, 1)[0];
    yield { visited: [...visited], path: [], current: curr, line: 6 };

    if (curr === endNode) {
      yield { visited: [...visited], path: [], current: curr, line: 7 };
      break;
    }

    if (gScore[curr] === Infinity) {
      break;
    }

    if (curr !== startNode && curr !== endNode) {
      visited.push(curr);
      visitedSet.add(curr);
    }

    const [r, c] = curr.split(',').map(Number);
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const neighbor = `${nr},${nc}`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !walls.has(neighbor)) {
        yield { visited: [...visited], path: [], current: curr, line: 8 };

        const tentativeGScore = gScore[curr] + 1;
        yield { visited: [...visited], path: [], current: curr, line: 9 };

        yield { visited: [...visited], path: [], current: curr, line: 10 };
        if (tentativeGScore < gScore[neighbor]) {
          gScore[neighbor] = tentativeGScore;
          yield { visited: [...visited], path: [], current: curr, line: 11 };

          fScore[neighbor] = tentativeGScore + getManhattanDistance(neighbor, endNode);
          yield { visited: [...visited], path: [], current: curr, line: 12 };

          prev[neighbor] = curr;
          yield { visited: [...visited], path: [], current: curr, line: 13 };

          if (!pq.includes(neighbor) && !visitedSet.has(neighbor)) {
            pq.push(neighbor);
            yield { visited: [...visited], path: [], current: curr, line: 14 };
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

  yield { visited: [...visited], path, current: null, line: 7 };
}
