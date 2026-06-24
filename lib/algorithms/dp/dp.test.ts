import { describe, it, expect } from 'vitest';
import { lcs, knapsack, fibonacci } from './dpAlgorithms';

describe('DP Algorithm Generators', () => {
  it('lcs correctly yields LCS values', () => {
    const gen = lcs('ABC', 'AC');
    let finalTable: (number | null)[][] = [];
    for (const step of gen) {
      finalTable = step.table;
    }
    // LCS of ABC and AC is AC, length = 2
    expect(finalTable[3][2]).toBe(2);
  });

  it('knapsack correctly yields max knapsack value', () => {
    const items = [
      { weight: 1, value: 6 },
      { weight: 2, value: 10 },
      { weight: 3, value: 12 },
    ];
    const gen = knapsack(items, 5);
    let finalTable: (number | null)[][] = [];
    for (const step of gen) {
      finalTable = step.table;
    }
    // Max value is 22 (item 2 and item 3: weight 5, value 22)
    expect(finalTable[3][5]).toBe(22);
  });

  it('fibonacci correctly yields fib values', () => {
    const gen = fibonacci(5);
    let finalTable: (number | null)[][] = [];
    for (const step of gen) {
      finalTable = step.table;
    }
    // F(5) = 5
    expect(finalTable[0][5]).toBe(5);
  });
});
