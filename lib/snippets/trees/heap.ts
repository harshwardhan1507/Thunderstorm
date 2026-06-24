export const heapSnippets = {
  javascript: `function insert(heap, val) {
  heap.push(val);
  let idx = heap.length - 1;
  while (idx > 0) {
    let pIdx = Math.floor((idx - 1) / 2);
    if (heap[idx] < heap[pIdx]) {
      swap(heap, idx, pIdx);
      idx = pIdx;
    } else break;
  }
}

function extractMin(heap) {
  if (heap.length <= 1) return heap.pop();
  let min = heap[0];
  heap[0] = heap.pop();
  siftDown(heap, 0);
  return min;
}`,
  java: `void insert(List<Integer> heap, int val) {
  heap.add(val);
  int idx = heap.size() - 1;
  while (idx > 0) {
    int pIdx = (idx - 1) / 2;
    if (heap.get(idx) < heap.get(pIdx)) {
      swap(heap, idx, pIdx);
      idx = pIdx;
    } else break;
  }
}

int extractMin(List<Integer> heap) {
  if (heap.size() == 1) return heap.remove(0);
  int min = heap.get(0);
  heap.set(0, heap.remove(heap.size() - 1));
  siftDown(heap, 0);
  return min;
}`,
  python: `def insert(heap, val):
  heap.append(val)
  idx = len(heap) - 1
  while idx > 0:
    p_idx = (idx - 1) // 2
    if heap[idx] < heap[p_idx]:
      swap(heap, idx, p_idx)
      idx = p_idx
    else:
      break

def extractMin(heap):
  if len(heap) <= 1:
    return heap.pop()
  min_val = heap[0]
  heap[0] = heap.pop()
  sift_down(heap, 0)
  return min_val`,
  cpp: `void insert(vector<int>& heap, int val) {
  heap.push_back(val);
  int idx = heap.size() - 1;
  while (idx > 0) {
    int pIdx = (idx - 1) / 2;
    if (heap[idx] < heap[pIdx]) {
      swap(heap[idx], heap[pIdx]);
      idx = pIdx;
    } else break;
  }
}

int extractMin(vector<int>& heap) {
  if (heap.size() == 1) {
    int min = heap.back(); heap.pop_back();
    return min;
  }
  int min = heap[0];
  heap[0] = heap.back(); heap.pop_back();
  siftDown(heap, 0);
  return min;
}`
};
