import { SortStep } from '../../../types/algorithm.types';

export function* heapSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(array, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    // Yield main swap step (line 7)
    yield { array: [...array], comparing: [0, i], swapped: true, line: 7 };
    yield* heapify(array, i, 0);
  }
}

function* heapify(array: number[], n: number, i: number): Generator<SortStep> {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n) {
    // Yield comparing step (line 16)
    yield { array: [...array], comparing: [l, largest], swapped: false, line: 16 };
    if (array[l] > array[largest]) {
      largest = l;
    }
  }

  if (r < n) {
    // Yield comparing step (line 17)
    yield { array: [...array], comparing: [r, largest], swapped: false, line: 17 };
    if (array[r] > array[largest]) {
      largest = r;
    }
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    // Yield swap step (line 19)
    yield { array: [...array], comparing: [i, largest], swapped: true, line: 19 };
    yield* heapify(array, n, largest);
  }
}
