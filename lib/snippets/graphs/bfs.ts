export const bfsSnippets = {
  javascript: `function bfs(graph, start) {
  let queue = [start];
  let visited = new Set();
  visited.add(start);
  while (queue.length > 0) {
    let curr = queue.shift();
    visit(curr);
    for (let neighbor of graph[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
  java: `void bfs(Map<String, List<String>> graph, String start) {
  Queue<String> queue = new LinkedList<>();
  Set<String> visited = new HashSet<>();
  queue.add(start);
  visited.add(start);
  while (!queue.isEmpty()) {
    String curr = queue.poll();
    visit(curr);
    for (String neighbor : graph.getOrDefault(curr, new ArrayList<>())) {
      if (!visited.contains(neighbor)) {
        visited.add(neighbor);
        queue.add(neighbor);
      }
    }
  }
}`,
  python: `def bfs(graph, start):
  queue = [start]
  visited = {start}
  while queue:
    curr = queue.pop(0)
    visit(curr)
    for neighbor in graph.get(curr, []):
      if neighbor not in visited:
        visited.add(neighbor)
        queue.append(neighbor)`,
  cpp: `void bfs(unordered_map<string, vector<string>>& graph, string start) {
  queue<string> q;
  unordered_set<string> visited;
  q.push(start);
  visited.insert(start);
  while (!q.empty()) {
    string curr = q.front(); q.pop();
    visit(curr);
    for (string neighbor : graph[curr]) {
      if (visited.find(neighbor) == visited.end()) {
        visited.insert(neighbor);
        q.push(neighbor);
      }
    }
  }
}`
};
