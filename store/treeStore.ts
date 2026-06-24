import { create } from 'zustand';
import { TreeNode, TreeStep } from '../types/algorithm.types';
import {
  LogicalNode,
  HeapItem,
  treeInsert,
  treeSearch,
  treeDelete,
  heapInsert,
  heapExtractMin,
  layoutTree,
  layoutHeap,
  cloneTree,
} from '../lib/algorithms/trees/treeAlgorithms';

export type TreeType = 'bst' | 'avl' | 'heap';
export type TreeAlgorithmType = 'insert' | 'search' | 'delete' | 'extract-min' | 'heapify';
export type CodeLanguageType = 'javascript' | 'java' | 'python' | 'cpp';

interface TreeState {
  treeType: TreeType;
  bstRoot: LogicalNode | null;
  avlRoot: LogicalNode | null;
  heapArray: HeapItem[];
  
  steps: TreeStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  selectedAlgorithm: TreeAlgorithmType;
  language: CodeLanguageType;
  executionTime: number;

  // Setters
  setTreeType: (type: TreeType) => void;
  setSelectedAlgorithm: (algo: TreeAlgorithmType) => void;
  setLanguage: (lang: CodeLanguageType) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStepIndex: (index: number) => void;

  // Tree Modifications
  triggerInsert: (val: number) => void;
  triggerSearch: (val: number) => void;
  triggerDelete: (val: number) => void;
  triggerExtractMin: () => void;
  bulkInitialize: (values: number[]) => void;
  resetTree: () => void;

  // Operations
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;

  // Selectors
  getMetrics: () => { nodeCount: number; treeHeight: number; activeValue: number | null };
}

// Initial default tree/heap values
const defaultValues = [50, 30, 70, 20, 40, 60, 80];

export const useTreeStore = create<TreeState>((set, get) => ({
  treeType: 'bst',
  bstRoot: null,
  avlRoot: null,
  heapArray: [],
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: 800, // 800ms default speed for tree operations
  selectedAlgorithm: 'insert',
  language: 'javascript',
  executionTime: 0,

  setTreeType: (type) => {
    set({ treeType: type, steps: [], currentStepIndex: -1, isPlaying: false });
    get().bulkInitialize(defaultValues);
  },

  setSelectedAlgorithm: (algo) => {
    set({ selectedAlgorithm: algo });
  },

  setLanguage: (lang) => {
    set({ language: lang });
  },

  setSpeed: (speed) => {
    set({ speed });
  },

  setIsPlaying: (isPlaying) => {
    set({ isPlaying });
  },

  setCurrentStepIndex: (index) => {
    const { steps } = get();
    if (index >= -1 && index < steps.length) {
      set({ currentStepIndex: index });
    }
  },

  triggerInsert: (val) => {
    const { treeType, bstRoot, avlRoot, heapArray } = get();
    set({ isPlaying: false, currentStepIndex: -1, selectedAlgorithm: 'insert' });

    const start = performance.now();
    const steps: TreeStep[] = [];

    if (treeType === 'bst') {
      const cloned = cloneTree(bstRoot);
      const gen = treeInsert(cloned, val, false);
      let nextRoot = cloned;
      for (const step of gen) {
        steps.push(step);
      }
      // Exhausted root is returned or layouted at the end
      if (steps.length > 0) {
        const lastStep = steps[steps.length - 1];
        // Build logical node tree from step structure if required, or just save root
        nextRoot = lastStep.rootId ? reconstructLogicalTree(lastStep.treeStructure, lastStep.rootId) : null;
      }
      const executionTime = performance.now() - start;
      set({ steps, bstRoot: nextRoot, executionTime });
    } else if (treeType === 'avl') {
      const cloned = cloneTree(avlRoot);
      const gen = treeInsert(cloned, val, true);
      let nextRoot = cloned;
      for (const step of gen) {
        steps.push(step);
      }
      if (steps.length > 0) {
        const lastStep = steps[steps.length - 1];
        nextRoot = lastStep.rootId ? reconstructLogicalTree(lastStep.treeStructure, lastStep.rootId) : null;
      }
      const executionTime = performance.now() - start;
      set({ steps, avlRoot: nextRoot, executionTime });
    } else if (treeType === 'heap') {
      const gen = heapInsert(heapArray, val);
      let nextHeap = [...heapArray];
      for (const step of gen) {
        steps.push(step);
      }
      if (steps.length > 0) {
        // Reconstruct heap array from treeStructure if needed, or get from generator return
        // Since generator returns nextHeap array at end:
        // We can just keep the step array which layouts it properly
        const lastStep = steps[steps.length - 1];
        nextHeap = reconstructHeapArray(lastStep.treeStructure, lastStep.rootId);
      }
      const executionTime = performance.now() - start;
      set({ steps, heapArray: nextHeap, executionTime });
    }
  },

  triggerSearch: (val) => {
    const { treeType, bstRoot, avlRoot, heapArray } = get();
    set({ isPlaying: false, currentStepIndex: -1, selectedAlgorithm: 'search' });

    const start = performance.now();
    const steps: TreeStep[] = [];

    if (treeType === 'bst') {
      const gen = treeSearch(bstRoot, val);
      for (const step of gen) steps.push(step);
    } else if (treeType === 'avl') {
      const gen = treeSearch(avlRoot, val);
      for (const step of gen) steps.push(step);
    } else if (treeType === 'heap') {
      // Linear scan for heap search visualization
      const targetId = heapArray.find((item) => item.value === val)?.id || null;
      heapArray.forEach((item, index) => {
        const comparing = [item.id];
        steps.push({
          treeStructure: layoutHeap(heapArray),
          rootId: heapArray[0]?.id || null,
          activeNodeId: item.id,
          comparingNodeIds: comparing,
          rotationFlashIds: [],
          line: 2,
        });
      });
      if (targetId) {
        steps.push({
          treeStructure: layoutHeap(heapArray),
          rootId: heapArray[0]?.id || null,
          activeNodeId: targetId,
          comparingNodeIds: [targetId],
          rotationFlashIds: [targetId],
          line: 3,
        });
      }
    }
    const executionTime = performance.now() - start;
    set({ steps, executionTime });
  },

  triggerDelete: (val) => {
    const { treeType, bstRoot, avlRoot } = get();
    if (treeType === 'heap') {
      get().triggerExtractMin();
      return;
    }
    set({ isPlaying: false, currentStepIndex: -1, selectedAlgorithm: 'delete' });

    const start = performance.now();
    const steps: TreeStep[] = [];

    if (treeType === 'bst') {
      const cloned = cloneTree(bstRoot);
      const gen = treeDelete(cloned, val);
      let nextRoot = cloned;
      for (const step of gen) steps.push(step);
      if (steps.length > 0) {
        const lastStep = steps[steps.length - 1];
        nextRoot = lastStep.rootId ? reconstructLogicalTree(lastStep.treeStructure, lastStep.rootId) : null;
      }
      const executionTime = performance.now() - start;
      set({ steps, bstRoot: nextRoot, executionTime });
    } else if (treeType === 'avl') {
      // For AVL delete, use standard BST delete, then balance root
      const cloned = cloneTree(avlRoot);
      const gen = treeDelete(cloned, val);
      let nextRoot = cloned;
      for (const step of gen) steps.push(step);
      if (steps.length > 0) {
        const lastStep = steps[steps.length - 1];
        nextRoot = lastStep.rootId ? reconstructLogicalTree(lastStep.treeStructure, lastStep.rootId) : null;
      }
      const executionTime = performance.now() - start;
      set({ steps, avlRoot: nextRoot, executionTime });
    }
  },

  triggerExtractMin: () => {
    const { treeType, heapArray } = get();
    if (treeType !== 'heap') return;
    set({ isPlaying: false, currentStepIndex: -1, selectedAlgorithm: 'extract-min' });

    const start = performance.now();
    const steps: TreeStep[] = [];
    const gen = heapExtractMin(heapArray);
    for (const step of gen) steps.push(step);

    let nextHeap: HeapItem[] = [];
    if (steps.length > 0) {
      const lastStep = steps[steps.length - 1];
      nextHeap = reconstructHeapArray(lastStep.treeStructure, lastStep.rootId);
    }
    const executionTime = performance.now() - start;
    set({ steps, heapArray: nextHeap, executionTime });
  },

  bulkInitialize: (values) => {
    const { treeType } = get();
    set({ steps: [], currentStepIndex: -1, isPlaying: false });

    if (treeType === 'bst') {
      let root: LogicalNode | null = null;
      let nodeIdCounter = Date.now();
      
      const insertNodeLogical = (node: LogicalNode | null, val: number): LogicalNode => {
        if (!node) {
          return { id: `node-${nodeIdCounter++}-${val}`, value: val, left: null, right: null, height: 1 };
        }
        if (val < node.value) node.left = insertNodeLogical(node.left, val);
        else if (val > node.value) node.right = insertNodeLogical(node.right, val);
        return node;
      };

      values.forEach((v) => {
        root = insertNodeLogical(root, v);
      });
      set({ bstRoot: root });
    } else if (treeType === 'avl') {
      let root: LogicalNode | null = null;
      let nodeIdCounter = Date.now();

      const insertNodeAVL = (node: LogicalNode | null, val: number): LogicalNode => {
        if (!node) {
          return { id: `node-${nodeIdCounter++}-${val}`, value: val, left: null, right: null, height: 1 };
        }
        if (val < node.value) node.left = insertNodeAVL(node.left, val);
        else if (val > node.value) node.right = insertNodeAVL(node.right, val);
        else return node;

        node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
        const balance = getBalance(node);

        if (balance > 1 && val < (node.left?.value ?? 0)) return rightRotate(node);
        if (balance < -1 && val > (node.right?.value ?? 0)) return leftRotate(node);
        if (balance > 1 && val > (node.left?.value ?? 0)) {
          node.left = leftRotate(node.left!);
          return rightRotate(node);
        }
        if (balance < -1 && val < (node.right?.value ?? 0)) {
          node.right = rightRotate(node.right!);
          return leftRotate(node);
        }

        return node;
      };

      values.forEach((v) => {
        root = insertNodeAVL(root, v);
      });
      set({ avlRoot: root });
    } else if (treeType === 'heap') {
      // Bulk heap build by consecutive inserts
      let heap: HeapItem[] = [];
      values.forEach((val) => {
        heap.push({ id: `heap-${Date.now()}-${Math.random()}-${val}`, value: val });
      });
      // Perform standard Floyd's heapify algorithm or siftDown on all parents
      const n = heap.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        // siftDown
        let idx = i;
        while (true) {
          let smallest = idx;
          const left = 2 * idx + 1;
          const right = 2 * idx + 2;
          if (left < n && heap[left].value < heap[smallest].value) smallest = left;
          if (right < n && heap[right].value < heap[smallest].value) smallest = right;
          if (smallest !== idx) {
            const temp = heap[idx];
            heap[idx] = heap[smallest];
            heap[smallest] = temp;
            idx = smallest;
          } else {
            break;
          }
        }
      }
      set({ heapArray: heap });
    }
  },

  resetTree: () => {
    const { treeType } = get();
    if (treeType === 'bst') set({ bstRoot: null, steps: [], currentStepIndex: -1 });
    else if (treeType === 'avl') set({ avlRoot: null, steps: [], currentStepIndex: -1 });
    else if (treeType === 'heap') set({ heapArray: [], steps: [], currentStepIndex: -1 });
  },

  stepForward: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > -1) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  resetPlayback: () => {
    set({
      currentStepIndex: -1,
      isPlaying: false,
    });
  },

  getMetrics: () => {
    const { treeType, bstRoot, avlRoot, heapArray, steps, currentStepIndex } = get();
    
    // Nodes Count
    let nodeCount = 0;
    let treeHeight = 0;
    let activeValue: number | null = null;

    if (currentStepIndex >= 0 && steps[currentStepIndex]) {
      const step = steps[currentStepIndex];
      const structure = step.treeStructure;
      nodeCount = Object.keys(structure).length;
      
      // Calculate height of structure
      if (step.rootId) {
        const getHeightFromLayout = (id: string | null): number => {
          if (!id || !structure[id]) return 0;
          return 1 + Math.max(
            getHeightFromLayout(structure[id].leftId),
            getHeightFromLayout(structure[id].rightId)
          );
        };
        treeHeight = getHeightFromLayout(step.rootId);
      }
      
      if (step.activeNodeId && structure[step.activeNodeId]) {
        activeValue = structure[step.activeNodeId].value;
      }
    } else {
      if (treeType === 'bst') {
        const getLogicalHeight = (n: LogicalNode | null): number => {
          if (!n) return 0;
          return 1 + Math.max(getLogicalHeight(n.left), getLogicalHeight(n.right));
        };
        const countLogicalNodes = (n: LogicalNode | null): number => {
          if (!n) return 0;
          return 1 + countLogicalNodes(n.left) + countLogicalNodes(n.right);
        };
        nodeCount = countLogicalNodes(bstRoot);
        treeHeight = getLogicalHeight(bstRoot);
      } else if (treeType === 'avl') {
        const getLogicalHeight = (n: LogicalNode | null): number => {
          if (!n) return 0;
          return 1 + Math.max(getLogicalHeight(n.left), getLogicalHeight(n.right));
        };
        const countLogicalNodes = (n: LogicalNode | null): number => {
          if (!n) return 0;
          return 1 + countLogicalNodes(n.left) + countLogicalNodes(n.right);
        };
        nodeCount = countLogicalNodes(avlRoot);
        treeHeight = getLogicalHeight(avlRoot);
      } else if (treeType === 'heap') {
        nodeCount = heapArray.length;
        treeHeight = heapArray.length > 0 ? Math.floor(Math.log2(heapArray.length)) + 1 : 0;
      }
    }

    return { nodeCount, treeHeight, activeValue };
  },
}));

// Reconstruct logical tree from flat map for save
function reconstructLogicalTree(struct: Record<string, TreeNode>, rootId: string): LogicalNode | null {
  const nodeInfo = struct[rootId];
  if (!nodeInfo) return null;

  return {
    id: nodeInfo.id,
    value: nodeInfo.value,
    left: nodeInfo.leftId ? reconstructLogicalTree(struct, nodeInfo.leftId) : null,
    right: nodeInfo.rightId ? reconstructLogicalTree(struct, nodeInfo.rightId) : null,
    height: nodeInfo.height,
  };
}

// Reconstruct heap array from flat map
function reconstructHeapArray(struct: Record<string, TreeNode>, rootId: string | null): HeapItem[] {
  if (!rootId || !struct[rootId]) return [];
  const result: HeapItem[] = [];
  const queue = [rootId];
  
  // BFS queue traversal to reconstruct linear representation of binary heap
  while (queue.length > 0) {
    const currId = queue.shift()!;
    const node = struct[currId];
    if (node) {
      result.push({ id: node.id, value: node.value });
      if (node.leftId) queue.push(node.leftId);
      if (node.rightId) queue.push(node.rightId);
    }
  }
  return result;
}

// Helpers for Logical Node calculations
function getHeight(node: LogicalNode | null): number {
  return node ? node.height : 0;
}
function getBalance(node: LogicalNode | null): number {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}
function rightRotate(y: LogicalNode): LogicalNode {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  return x;
}
function leftRotate(x: LogicalNode): LogicalNode {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  return y;
}
