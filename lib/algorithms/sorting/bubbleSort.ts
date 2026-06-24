import { SortStep } from '../../../types/algorithm.types';

export function* bubbleSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Yield comparing step (line 5)
      yield { array: [...array], comparing: [j, j + 1], swapped: false, line: 5 };
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        // Yield swap step (line 6)
        yield { array: [...array], comparing: [j, j + 1], swapped: true, line: 6 };
      }
    }
  }
}
