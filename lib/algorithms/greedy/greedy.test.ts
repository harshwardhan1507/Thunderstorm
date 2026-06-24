import { describe, it, expect } from 'vitest';
import { activitySelection, huffmanCoding } from './greedyAlgorithms';

describe('Greedy Algorithm Generators', () => {
  it('activitySelection selects maximum non-overlapping intervals', () => {
    const activities = [
      { id: 'A', start: 1, end: 4 },
      { id: 'B', start: 3, end: 5 },
      { id: 'C', start: 0, end: 6 },
      { id: 'D', start: 5, end: 7 },
      { id: 'E', start: 8, end: 9 },
    ];
    const gen = activitySelection(activities);
    let lastStep: any = null;
    for (const step of gen) {
      lastStep = step;
    }
    // Expected selection: A (1-4), D (5-7), E (8-9). Total 3.
    expect(lastStep.activities.selected.length).toBe(3);
    expect(lastStep.activities.selected).toContain('A');
    expect(lastStep.activities.selected).toContain('D');
    expect(lastStep.activities.selected).toContain('E');
  });

  it('huffmanCoding builds a Huffman Tree', () => {
    const freqs = [
      { char: 'A', freq: 5 },
      { char: 'B', freq: 9 },
      { char: 'C', freq: 12 },
    ];
    const gen = huffmanCoding(freqs);
    let lastStep: any = null;
    for (const step of gen) {
      lastStep = step;
    }
    expect(lastStep.huffmanTree.rootId).toBeDefined();
    expect(Object.keys(lastStep.huffmanTree.nodes).length).toBe(5); // 3 leaves + 2 parents
  });
});
