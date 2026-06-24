import { SortStep } from '../../../types/algorithm.types';

export function* quickSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  yield* quickSortHelper(array, 0, array.length - 1);
}

function* quickSortHelper(array: number[], low: number, high: number): Generator<SortStep> {
  if (low < high) {
    const pivotIndex: number = yield* partition(array, low, high);
    yield* quickSortHelper(array, low, pivotIndex - 1);
    yield* quickSortHelper(array, pivotIndex + 1, high);
  }
}

function* partition(array: number[], low: number, high: number): Generator<SortStep, number> {
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    // Yield comparing step (line 13)
    yield { array: [...array], comparing: [j, high], swapped: false, line: 13 };
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      // Yield swap step (line 15)
      yield { array: [...array], comparing: [i, j], swapped: true, line: 15 };
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  // Yield final partition swap step (line 18)
  yield { array: [...array], comparing: [i + 1, high], swapped: true, line: 18 };
  return i + 1;
}
