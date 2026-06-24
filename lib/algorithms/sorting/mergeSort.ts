import { SortStep } from '../../../types/algorithm.types';

export function* mergeSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  yield* mergeSortHelper(array, 0, array.length - 1);
}

function* mergeSortHelper(array: number[], l: number, r: number): Generator<SortStep> {
  if (l < r) {
    const m = Math.floor((l + r) / 2);
    yield* mergeSortHelper(array, l, m);
    yield* mergeSortHelper(array, m + 1, r);
    yield* merge(array, l, m, r);
  }
}

function* merge(array: number[], l: number, m: number, r: number): Generator<SortStep> {
  const temp: number[] = [];
  let i = l;
  let j = m + 1;

  while (i <= m && j <= r) {
    // Yield comparing step (line 14)
    yield { array: [...array], comparing: [i, j], swapped: false, line: 14 };
    if (array[i] <= array[j]) {
      temp.push(array[i++]);
    } else {
      temp.push(array[j++]);
    }
  }

  while (i <= m) {
    temp.push(array[i++]);
  }
  while (j <= r) {
    temp.push(array[j++]);
  }

  for (let k = 0; k < temp.length; k++) {
    array[l + k] = temp[k];
    // Yield writing step (line 23) - we treat writing back as a swap/mutation step
    yield { array: [...array], comparing: [l + k], swapped: true, line: 23 };
  }
}
