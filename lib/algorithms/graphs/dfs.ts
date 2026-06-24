import { GraphNode, GraphEdge, GraphStep } from '../../../types/algorithm.types';

export function* dfs(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: string
): Generator<GraphStep> {
  const visitedNodes: string[] = [];
  const edgeTrail: [string, string][] = [];
  const visitedSet = new Set<string>();

  // Build adjacency list
  const adjList: Record<string, string[]> = {};
  nodes.forEach((n) => {
    adjList[n.id] = [];
  });
  edges.forEach((e) => {
    if (adjList[e.from]) adjList[e.from].push(e.to);
    if (adjList[e.to]) adjList[e.to].push(e.from);
  });

  yield { visitedNodes: [], currentNodeId: null, edgeTrail: [], line: 1 };

  function* traverse(curr: string, parent: string | null): Generator<GraphStep> {
    yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 3 };
    visitedSet.add(curr);
    visitedNodes.push(curr);
    
    if (parent) {
      edgeTrail.push([parent, curr]);
    }
    yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 4 };

    const neighbors = adjList[curr] || [];
    for (const neighbor of neighbors) {
      yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 5 };
      yield { visitedNodes: [...visitedNodes], currentNodeId: curr, edgeTrail: [...edgeTrail], line: 6 };
      if (!visitedSet.has(neighbor)) {
        yield* traverse(neighbor, curr);
      }
    }
  }

  yield* traverse(startNodeId, null);
}
