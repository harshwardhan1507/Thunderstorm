export const dijkstraSnippets = {
  javascript: `function dijkstra(grid, start, end) {
  let pq = [start];
  let dist = { [start]: 0 };
  let prev = {};
  while (pq.length > 0) {
    let curr = getMin(pq, dist);
    if (curr === end) break;
    for (let neighbor of neighbors(curr)) {
      let newDist = dist[curr] + 1;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        prev[neighbor] = curr;
        pq.push(neighbor);
      }
    }
  }
}`,
  java: `void dijkstra(Grid grid, Node start, Node end) {
  PriorityQueue<Node> pq = new PriorityQueue<>((a, b) -> a.dist - b.dist);
  start.dist = 0;
  pq.add(start);
  while (!pq.isEmpty()) {
    Node curr = pq.poll();
    if (curr == end) break;
    for (Node neighbor : grid.getNeighbors(curr)) {
      int newDist = curr.dist + 1;
      if (newDist < neighbor.dist) {
        neighbor.dist = newDist;
        neighbor.prev = curr;
        pq.add(neighbor);
      }
    }
  }
}`,
  python: `def dijkstra(grid, start, end):
  pq = [(0, start)]
  dist = {start: 0}
  prev = {}
  while pq:
    d, curr = heapq.heappop(pq)
    if curr == end:
      break
    for neighbor in get_neighbors(grid, curr):
      new_dist = dist[curr] + 1
      if new_dist < dist.get(neighbor, float('inf')):
        dist[neighbor] = new_dist
        prev[neighbor] = curr
        heapq.heappush(pq, (new_dist, neighbor))`,
  cpp: `void dijkstra(Grid& grid, Node* start, Node* end) {
  priority_queue<Node*, vector<Node*>, CompareDist> pq;
  start->dist = 0;
  pq.push(start);
  while (!pq.empty()) {
    Node* curr = pq.top(); pq.pop();
    if (curr == end) break;
    for (Node* neighbor : grid.getNeighbors(curr)) {
      int newDist = curr->dist + 1;
      if (newDist < neighbor->dist) {
        neighbor->dist = newDist;
        neighbor->prev = curr;
        pq.push(neighbor);
      }
    }
  }
}`
};
