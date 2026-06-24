import { TreeNode, TreeStep } from '../../../types/algorithm.types';

export interface LogicalNode {
  id: string;
  value: number;
  left: LogicalNode | null;
  right: LogicalNode | null;
  height: number;
}

// Convert a tree structure into positions
export function layoutTree(root: LogicalNode | null, width = 600): Record<string, TreeNode> {
  const result: Record<string, TreeNode> = {};
  if (!root) return result;

  function traverse(node: LogicalNode | null, leftBound: number, rightBound: number, depth: number) {
    if (!node) return;
    const x = (leftBound + rightBound) / 2;
    const y = 60 + depth * 65;
    result[node.id] = {
      id: node.id,
      value: node.value,
      x,
      y,
      leftId: node.left ? node.left.id : null,
      rightId: node.right ? node.right.id : null,
      height: node.height,
    };
    traverse(node.left, leftBound, x, depth + 1);
    traverse(node.right, x, rightBound, depth + 1);
  }

  traverse(root, 20, width - 20, 0);
  return result;
}

// Deep clone logical tree
export function cloneTree(node: LogicalNode | null): LogicalNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    height: node.height,
  };
}

// Helper: Get height of logical node
function getHeight(node: LogicalNode | null): number {
  return node ? node.height : 0;
}

// Helper: Get balance factor
function getBalance(node: LogicalNode | null): number {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

// BST / AVL insert generator
export function* treeInsert(
  root: LogicalNode | null,
  value: number,
  isAVL = false
): Generator<TreeStep, LogicalNode | null> {
  let nodeIdCounter = Date.now();
  
  function* insertHelper(node: LogicalNode | null, val: number): Generator<TreeStep, LogicalNode> {
    if (!node) {
      const newNode: LogicalNode = {
        id: `node-${nodeIdCounter++}-${val}`,
        value: val,
        left: null,
        right: null,
        height: 1,
      };
      return newNode;
    }

    yield {
      treeStructure: layoutTree(root),
      rootId: root ? root.id : null,
      activeNodeId: node.id,
      comparingNodeIds: [node.id],
      rotationFlashIds: [],
      line: 5, // line highlighting comparing node
    };

    if (val < node.value) {
      node.left = yield* insertHelper(node.left, val);
    } else if (val > node.value) {
      node.right = yield* insertHelper(node.right, val);
    } else {
      return node; // Duplicate keys not allowed/ignored
    }

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));

    if (isAVL) {
      const balance = getBalance(node);

      // Left Left Case
      if (balance > 1 && val < (node.left?.value ?? 0)) {
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.id,
          comparingNodeIds: [],
          rotationFlashIds: [node.id, node.left?.id ?? ''],
          line: 12, // Balance triggers single right rotation
        };
        return rightRotate(node);
      }

      // Right Right Case
      if (balance < -1 && val > (node.right?.value ?? 0)) {
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.id,
          comparingNodeIds: [],
          rotationFlashIds: [node.id, node.right?.id ?? ''],
          line: 15, // Balance triggers single left rotation
        };
        return leftRotate(node);
      }

      // Left Right Case
      if (balance > 1 && val > (node.left?.value ?? 0)) {
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.left?.id ?? null,
          comparingNodeIds: [],
          rotationFlashIds: [node.left?.id ?? ''],
          line: 18, // Double rotation: left rotate child
        };
        node.left = leftRotate(node.left!);
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.id,
          comparingNodeIds: [],
          rotationFlashIds: [node.id],
          line: 19, // Double rotation: right rotate parent
        };
        return rightRotate(node);
      }

      // Right Left Case
      if (balance < -1 && val < (node.right?.value ?? 0)) {
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.right?.id ?? null,
          comparingNodeIds: [],
          rotationFlashIds: [node.right?.id ?? ''],
          line: 22, // Double rotation: right rotate child
        };
        node.right = rightRotate(node.right!);
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.id,
          comparingNodeIds: [],
          rotationFlashIds: [node.id],
          line: 23, // Double rotation: left rotate parent
        };
        return leftRotate(node);
      }
    }

    return node;
  }

  const newRoot = yield* insertHelper(root, value);
  yield {
    treeStructure: layoutTree(newRoot),
    rootId: newRoot ? newRoot.id : null,
    activeNodeId: null,
    comparingNodeIds: [],
    rotationFlashIds: [],
    line: 10, // complete
  };
  return newRoot;
}

// Right Rotation
function rightRotate(y: LogicalNode): LogicalNode {
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

  return x;
}

// Left Rotation
function leftRotate(x: LogicalNode): LogicalNode {
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

  return y;
}

// BST search generator
export function* treeSearch(
  root: LogicalNode | null,
  value: number
): Generator<TreeStep, boolean> {
  let curr = root;
  while (curr) {
    yield {
      treeStructure: layoutTree(root),
      rootId: root ? root.id : null,
      activeNodeId: curr.id,
      comparingNodeIds: [curr.id],
      rotationFlashIds: [],
      line: 3, // Search step check
    };

    if (curr.value === value) {
      yield {
        treeStructure: layoutTree(root),
        rootId: root ? root.id : null,
        activeNodeId: curr.id,
        comparingNodeIds: [curr.id],
        rotationFlashIds: [],
        line: 4, // Found!
      };
      return true;
    }

    if (value < curr.value) {
      curr = curr.left;
    } else {
      curr = curr.right;
    }
  }

  yield {
    treeStructure: layoutTree(root),
    rootId: root ? root.id : null,
    activeNodeId: null,
    comparingNodeIds: [],
    rotationFlashIds: [],
    line: 8, // Not found
  };
  return false;
}

// BST delete generator
export function* treeDelete(
  root: LogicalNode | null,
  value: number
): Generator<TreeStep, LogicalNode | null> {
  function* deleteHelper(node: LogicalNode | null, val: number): Generator<TreeStep, LogicalNode | null> {
    if (!node) return null;

    yield {
      treeStructure: layoutTree(root),
      rootId: root ? root.id : null,
      activeNodeId: node.id,
      comparingNodeIds: [node.id],
      rotationFlashIds: [],
      line: 3, // Compare delete value
    };

    if (val < node.value) {
      node.left = yield* deleteHelper(node.left, val);
    } else if (val > node.value) {
      node.right = yield* deleteHelper(node.right, val);
    } else {
      // Node is found, handle deletion
      if (!node.left) {
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.id,
          comparingNodeIds: [],
          rotationFlashIds: [node.id],
          line: 6, // No left child, return right child
        };
        return node.right;
      } else if (!node.right) {
        yield {
          treeStructure: layoutTree(root),
          rootId: root ? root.id : null,
          activeNodeId: node.id,
          comparingNodeIds: [],
          rotationFlashIds: [node.id],
          line: 8, // No right child, return left child
        };
        return node.left;
      }

      // Two children: Get inorder successor (smallest in right subtree)
      let successor = node.right;
      while (successor.left) {
        successor = successor.left;
      }

      yield {
        treeStructure: layoutTree(root),
        rootId: root ? root.id : null,
        activeNodeId: successor.id,
        comparingNodeIds: [node.id, successor.id],
        rotationFlashIds: [],
        line: 11, // Find inorder successor
      };

      node.value = successor.value;
      
      yield {
        treeStructure: layoutTree(root),
        rootId: root ? root.id : null,
        activeNodeId: node.id,
        comparingNodeIds: [],
        rotationFlashIds: [node.id],
        line: 12, // Replace value with successor
      };

      node.right = yield* deleteHelper(node.right, successor.value);
    }
    return node;
  }

  const newRoot = yield* deleteHelper(root, value);
  yield {
    treeStructure: layoutTree(newRoot),
    rootId: newRoot ? newRoot.id : null,
    activeNodeId: null,
    comparingNodeIds: [],
    rotationFlashIds: [],
    line: 15,
  };
  return newRoot;
}

// --- Heap Algorithms ---

export interface HeapItem {
  id: string;
  value: number;
}

// Convert heap array into layout tree
export function layoutHeap(heap: HeapItem[]): Record<string, TreeNode> {
  const result: Record<string, TreeNode> = {};
  if (heap.length === 0) return result;

  function traverse(index: number, x: number, y: number, span: number) {
    if (index >= heap.length) return;
    const item = heap[index];
    const leftIndex = 2 * index + 1;
    const rightIndex = 2 * index + 2;

    result[item.id] = {
      id: item.id,
      value: item.value,
      x,
      y,
      leftId: leftIndex < heap.length ? heap[leftIndex].id : null,
      rightId: rightIndex < heap.length ? heap[rightIndex].id : null,
      height: 1,
    };

    traverse(leftIndex, x - span / 2, y + 65, span / 2);
    traverse(rightIndex, x + span / 2, y + 65, span / 2);
  }

  traverse(0, 300, 60, 260);
  return result;
}

export function* heapInsert(heap: HeapItem[], value: number): Generator<TreeStep, HeapItem[]> {
  const newHeap = [...heap];
  const newItem: HeapItem = {
    id: `heap-${Date.now()}-${value}`,
    value,
  };
  newHeap.push(newItem);

  yield {
    treeStructure: layoutHeap(newHeap),
    rootId: newHeap[0]?.id || null,
    activeNodeId: newItem.id,
    comparingNodeIds: [newItem.id],
    rotationFlashIds: [],
    line: 1, // Inserted at end
  };

  let idx = newHeap.length - 1;
  while (idx > 0) {
    const parentIdx = Math.floor((idx - 1) / 2);
    yield {
      treeStructure: layoutHeap(newHeap),
      rootId: newHeap[0].id,
      activeNodeId: newHeap[idx].id,
      comparingNodeIds: [newHeap[idx].id, newHeap[parentIdx].id],
      rotationFlashIds: [],
      line: 3, // Compare with parent
    };

    if (newHeap[idx].value < newHeap[parentIdx].value) {
      // Swap positions
      const temp = newHeap[idx];
      newHeap[idx] = newHeap[parentIdx];
      newHeap[parentIdx] = temp;

      yield {
        treeStructure: layoutHeap(newHeap),
        rootId: newHeap[0].id,
        activeNodeId: newHeap[parentIdx].id,
        comparingNodeIds: [newHeap[idx].id, newHeap[parentIdx].id],
        rotationFlashIds: [newHeap[idx].id, newHeap[parentIdx].id],
        line: 4, // Swapped!
      };
      idx = parentIdx;
    } else {
      break;
    }
  }

  yield {
    treeStructure: layoutHeap(newHeap),
    rootId: newHeap[0].id,
    activeNodeId: null,
    comparingNodeIds: [],
    rotationFlashIds: [],
    line: 7, // Complete
  };
  return newHeap;
}

export function* heapExtractMin(heap: HeapItem[]): Generator<TreeStep, HeapItem[]> {
  if (heap.length === 0) return [];
  const newHeap = [...heap];
  
  if (newHeap.length === 1) {
    newHeap.pop();
    yield {
      treeStructure: {},
      rootId: null,
      activeNodeId: null,
      comparingNodeIds: [],
      rotationFlashIds: [],
      line: 1,
    };
    return [];
  }

  // Swap root with last element
  const minVal = newHeap[0];
  newHeap[0] = newHeap[newHeap.length - 1];
  newHeap.pop();

  yield {
    treeStructure: layoutHeap(newHeap),
    rootId: newHeap[0].id,
    activeNodeId: newHeap[0].id,
    comparingNodeIds: [newHeap[0].id],
    rotationFlashIds: [newHeap[0].id],
    line: 2, // Replaced root with last element
  };

  let idx = 0;
  const n = newHeap.length;
  while (true) {
    let smallest = idx;
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;

    const comparing = [newHeap[idx].id];
    if (left < n) comparing.push(newHeap[left].id);
    if (right < n) comparing.push(newHeap[right].id);

    yield {
      treeStructure: layoutHeap(newHeap),
      rootId: newHeap[0].id,
      activeNodeId: newHeap[idx].id,
      comparingNodeIds: comparing,
      rotationFlashIds: [],
      line: 4, // Checking children
    };

    if (left < n && newHeap[left].value < newHeap[smallest].value) {
      smallest = left;
    }
    if (right < n && newHeap[right].value < newHeap[smallest].value) {
      smallest = right;
    }

    if (smallest !== idx) {
      const temp = newHeap[idx];
      newHeap[idx] = newHeap[smallest];
      newHeap[smallest] = temp;

      yield {
        treeStructure: layoutHeap(newHeap),
        rootId: newHeap[0].id,
        activeNodeId: newHeap[smallest].id,
        comparingNodeIds: [newHeap[idx].id, newHeap[smallest].id],
        rotationFlashIds: [newHeap[idx].id, newHeap[smallest].id],
        line: 5, // Sifted down
      };
      idx = smallest;
    } else {
      break;
    }
  }

  yield {
    treeStructure: layoutHeap(newHeap),
    rootId: newHeap[0].id,
    activeNodeId: null,
    comparingNodeIds: [],
    rotationFlashIds: [],
    line: 8,
  };
  return newHeap;
}
