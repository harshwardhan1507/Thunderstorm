export const huffmanSnippets = {
  javascript: `function buildHuffmanTree(charFreqs) {
  let pq = [...charFreqs].sort((a, b) => a.freq - b.freq);
  while (pq.length > 1) {
    let left = pq.shift();
    let right = pq.shift();
    let parent = {
      freq: left.freq + right.freq,
      left: left,
      right: right
    };
    pq.push(parent);
    pq.sort((a, b) => a.freq - b.freq);
  }
  return pq[0];
}`,
  java: `Node buildHuffmanTree(PriorityQueue<Node> pq) {
  while (pq.size() > 1) {
    Node left = pq.poll();
    Node right = pq.poll();
    Node parent = new Node(left.freq + right.freq);
    parent.left = left;
    parent.right = right;
    pq.add(parent);
  }
  return pq.peek();
}`,
  python: `def buildHuffmanTree(charFreqs):
  pq = [(cf.freq, Node(cf.char, cf.freq)) for cf in charFreqs]
  heapq.heapify(pq)
  while len(pq) > 1:
    f1, left = heapq.heappop(pq)
    f2, right = heapq.heappop(pq)
    parent = Node(freq=f1+f2, left=left, right=right)
    heapq.heappush(pq, (parent.freq, parent))
  return pq[0][1]`,
  cpp: `Node* buildHuffmanTree(priority_queue<Node*, vector<Node*>, Compare>& pq) {
  while (pq.size() > 1) {
    Node* left = pq.top(); pq.pop();
    Node* right = pq.top(); pq.pop();
    Node* parent = new Node(left->freq + right->freq);
    parent->left = left;
    parent->right = right;
    pq.push(parent);
  }
  return pq.top();
}`
};
