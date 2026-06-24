import { GraphNode, GraphEdge, GraphStep } from '../../../types/algorithm.types';

export function* bfs(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string
): Generator<GraphStep> {
  const visitedNodes: string[] = [];
  const edgeTrail: [string, string][] = [];
  const visitedSet = new Set<string>();
  const parentMap = new Map<string, string>(); // to reconstruct edge trail

  // Build adjacency list
  const adjList: Record<string, string[]> = {};
  nodes.forEach((n) => {
    adjList[n.id] = [];
  });
  edges.forEach((e) => {
    if (adjList[e.from]) adjList[e.from].push(e.to);
    if (adjList[e.to]) adjList[e.to].push(e.from);
  });

  const queue: string[] = [startNodeId];
  yield { visitedNodes: [], currentNodeId: null, edgeTrail: [], line: 1 };

  visitedSet.add(startNodeId);
  yield { visitedNodes: [], currentNodeId: null, edgeTrail: [], line: 3 };

  while (queue.length > 0) {
    yield { visitedNodes: [...visitedNodes], currentNodeId: null, edgeTrail: [...edgeTrail], line: 4 };

    const curr = queue.shift()!;
    yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 5 };

    visitedNodes.push(curr);
    if (parentMap.has(curr)) {
      edgeTrail.push([parentMap.get(curr)!, curr]);
    }
    yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 6 };

    const neighbors = adjList[curr] || [];
    for (const neighbor of neighbors) {
      yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 7 };

      yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 8 };
      if (!visitedSet.has(neighbor)) {
        visitedSet.add(neighbor);
        parentMap.set(neighbor, curr);
        yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 9 };

        queue.push(neighbor);
        yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 10 };
      }
    }
  }
}
