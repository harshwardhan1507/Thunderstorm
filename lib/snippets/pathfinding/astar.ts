export const astarSnippets = {
  javascript: `function astar(grid, start, end) {
  let pq = [start];
  let gScore = { [start]: 0 };
  let fScore = { [start]: h(start, end) };
  let prev = {};
  while (pq.length > 0) {
    let curr = getMinF(pq, fScore);
    if (curr === end) break;
    for (let neighbor of neighbors(curr)) {
      let newG = gScore[curr] + 1;
      if (newG < gScore[neighbor]) {
        gScore[neighbor] = newG;
        fScore[neighbor] = newG + h(neighbor, end);
        prev[neighbor] = curr;
        pq.push(neighbor);
      }
    }
  }
}`,
  java: `void astar(Grid grid, Node start, Node end) {
  PriorityQueue<Node> pq = new PriorityQueue<>((a, b) -> a.f - b.f);
  start.g = 0;
  start.f = h(start, end);
  pq.add(start);
  while (!pq.isEmpty()) {
    Node curr = pq.poll();
    if (curr == end) break;
    for (Node neighbor : grid.getNeighbors(curr)) {
      int newG = curr.g + 1;
      if (newG < neighbor.g) {
        neighbor.g = newG;
        neighbor.f = newG + h(neighbor, end);
        neighbor.prev = curr;
        pq.add(neighbor);
      }
    }
  }
}`,
  python: `def astar(grid, start, end):
  pq = [(h(start, end), start)]
  g_score = {start: 0}
  prev = {}
  while pq:
    f, curr = heapq.heappop(pq)
    if curr == end:
      break
    for neighbor in get_neighbors(grid, curr):
      new_g = g_score[curr] + 1
      if new_g < g_score.get(neighbor, float('inf')):
        g_score[neighbor] = new_g
        prev[neighbor] = curr
        f_score = new_g + h(neighbor, end)
        heapq.heappush(pq, (f_score, neighbor))`,
  cpp: `void astar(Grid& grid, Node* start, Node* end) {
  priority_queue<Node*, vector<Node*>, CompareF> pq;
  start->g = 0;
  start->f = h(start, end);
  pq.push(start);
  while (!pq.empty()) {
    Node* curr = pq.top(); pq.pop();
    if (curr == end) break;
    for (Node* neighbor : grid.getNeighbors(curr)) {
      int newG = curr->g + 1;
      if (newG < neighbor->g) {
        neighbor->g = newG;
        neighbor->f = newG + h(neighbor, end);
        neighbor->prev = curr;
        pq.push(neighbor);
      }
    }
  }
}`
};
