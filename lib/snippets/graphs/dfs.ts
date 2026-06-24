export const dfsSnippets = {
  javascript: `function dfs(graph, start) {
  let visited = new Set();
  function traverse(curr) {
    visited.add(curr);
    visit(curr);
    for (let neighbor of graph[curr]) {
      if (!visited.has(neighbor)) {
        traverse(neighbor);
      }
    }
  }
  traverse(start);
}`,
  java: `void dfs(Map<String, List<String>> graph, String start) {
  Set<String> visited = new HashSet<>();
  dfsHelper(graph, start, visited);
}

void dfsHelper(Map<String, List<String>> graph, String curr, Set<String> visited) {
  visited.add(curr);
  visit(curr);
  for (String neighbor : graph.getOrDefault(curr, new ArrayList<>())) {
    if (!visited.contains(neighbor)) {
      dfsHelper(graph, neighbor, visited);
    }
  }
}`,
  python: `def dfs(graph, start):
  visited = set()
  def traverse(curr):
    visited.add(curr)
    visit(curr)
    for neighbor in graph.get(curr, []):
      if neighbor not in visited:
        traverse(neighbor)
  traverse(start)`,
  cpp: `void dfsHelper(unordered_map<string, vector<string>>& graph, string curr, unordered_set<string>& visited) {
  visited.insert(curr);
  visit(curr);
  for (string neighbor : graph[curr]) {
    if (visited.find(neighbor) == visited.end()) {
      dfsHelper(graph, neighbor, visited);
    }
  }
}

void dfs(unordered_map<string, vector<string>>& graph, string start) {
  unordered_set<string> visited;
  dfsHelper(graph, start, visited);
}`
};
