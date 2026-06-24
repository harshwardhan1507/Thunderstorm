import { describe, it, expect } from 'vitest';
import {
  LogicalNode,
  treeInsert,
  treeSearch,
  treeDelete,
  HeapItem,
  heapInsert,
  heapExtractMin,
} from './treeAlgorithms';

describe('Tree Algorithm Generators', () => {
  it('treeInsert correctly inserts nodes into BST', () => {
    let root: LogicalNode | null = null;

    // Insert 10
    let gen = treeInsert(root, 10);
    for (const step of gen) {
      root = step.rootId ? { id: step.rootId, value: 10, left: null, right: null, height: 1 } : null;
    }
    expect(root).toBeDefined();

    // Insert 5 (left child)
    let clonedRoot = root;
    let gen2 = treeInsert(clonedRoot, 5);
    let finalStructure: any = null;
    for (const step of gen2) {
      finalStructure = step.treeStructure;
    }
    const node5 = Object.values(finalStructure).find((n: any) => n.value === 5);
    expect(node5).toBeDefined();
  });

  it('treeSearch correctly searches in BST', () => {
    const root: LogicalNode = {
      id: 'root',
      value: 10,
      left: { id: 'left', value: 5, left: null, right: null, height: 1 },
      right: { id: 'right', value: 15, left: null, right: null, height: 1 },
      height: 2,
    };

    const gen = treeSearch(root, 15);
    let result = false;
    for (const step of gen) {
      // exhausts generator
    }
    // The return value from generator is retrieved or tested by running the loop
    // Let's verify searching finds the item
    const searchStepResult = [...treeSearch(root, 15)];
    const lastStep = searchStepResult[searchStepResult.length - 1];
    expect(lastStep.comparingNodeIds).toContain('right');
  });

  it('heapInsert bubbles up min values', () => {
    let heap: HeapItem[] = [
      { id: '1', value: 10 },
      { id: '2', value: 20 },
    ];
    const gen = heapInsert(heap, 5);
    let lastStep: any = null;
    for (const step of gen) {
      lastStep = step;
    }
    const rootId = lastStep.rootId;
    const finalStructure = lastStep.treeStructure;
    expect(finalStructure[rootId].value).toBe(5);
  });
});
