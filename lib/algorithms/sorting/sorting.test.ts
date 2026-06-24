import { describe, it, expect } from 'vitest';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { heapSort } from './heapSort';

const isSorted = (arr: number[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
};

describe('Sorting Algorithm Generators', () => {
  const unsorted = [5, 3, 8, 4, 2, 7, 1, 10, 6, 9];

  it('bubbleSort correctly sorts the array', () => {
    const gen = bubbleSort(unsorted);
    let finalArray = unsorted;
    for (const step of gen) {
      finalArray = step.array;
    }
    expect(isSorted(finalArray)).toBe(true);
    expect(finalArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('quickSort correctly sorts the array', () => {
    const gen = quickSort(unsorted);
    let finalArray = unsorted;
    for (const step of gen) {
      finalArray = step.array;
    }
    expect(isSorted(finalArray)).toBe(true);
    expect(finalArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('mergeSort correctly sorts the array', () => {
    const gen = mergeSort(unsorted);
    let finalArray = unsorted;
    for (const step of gen) {
      finalArray = step.array;
    }
    expect(isSorted(finalArray)).toBe(true);
    expect(finalArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('heapSort correctly sorts the array', () => {
    const gen = heapSort(unsorted);
    let finalArray = unsorted;
    for (const step of gen) {
      finalArray = step.array;
    }
    expect(isSorted(finalArray)).toBe(true);
    expect(finalArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
