import { DPStep } from '../../../types/algorithm.types';

// LCS (Longest Common Subsequence) generator
export function* lcs(strA: string, strB: string): Generator<DPStep> {
  const m = strA.length;
  const n = strB.length;

  // Initialize table
  const table: (number | null)[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(null));

  // Base cases
  for (let i = 0; i <= m; i++) table[i][0] = 0;
  for (let j = 0; j <= n; j++) table[0][j] = 0;

  yield {
    table: table.map((row) => [...row]),
    activeCell: null,
    dependentCells: [],
    formula: 'Initialize base cases: dp[i][0] = 0, dp[0][j] = 0',
    line: 1,
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const active: [number, number] = [i, j];
      
      if (strA[i - 1] === strB[j - 1]) {
        const formula = `strA[${i - 1}] === strB[${j - 1}] ('${strA[i - 1]}') -> dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}]`;
        const dependents: [number, number][] = [[i - 1, j - 1]];

        yield {
          table: table.map((row) => [...row]),
          activeCell: active,
          dependentCells: dependents,
          formula,
          line: 5,
        };

        table[i][j] = (table[i - 1][j - 1] ?? 0) + 1;
      } else {
        const valA = table[i - 1][j] ?? 0;
        const valB = table[i][j - 1] ?? 0;
        const formula = `strA[${i - 1}] !== strB[${j - 1}] -> dp[${i}][${j}] = max(dp[${i - 1}][${j}] (${valA}), dp[${i}][${j - 1}] (${valB}))`;
        const dependents: [number, number][] = [
          [i - 1, j],
          [i, j - 1],
        ];

        yield {
          table: table.map((row) => [...row]),
          activeCell: active,
          dependentCells: dependents,
          formula,
          line: 7,
        };

        table[i][j] = Math.max(valA, valB);
      }

      yield {
        table: table.map((row) => [...row]),
        activeCell: active,
        dependentCells: [],
        formula: `Cell filled: dp[${i}][${j}] = ${table[i][j]}`,
        line: 9,
      };
    }
  }

  // Final step
  yield {
    table: table.map((row) => [...row]),
    activeCell: [m, n],
    dependentCells: [],
    formula: `LCS Length completed. Result is ${table[m][n]}`,
    line: 11,
  };
}

// Knapsack (0-1 Knapsack) generator
export interface KnapsackItem {
  weight: number;
  value: number;
}

export function* knapsack(items: KnapsackItem[], capacity: number): Generator<DPStep> {
  const n = items.length;
  const w = capacity;

  const table: (number | null)[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(w + 1).fill(null));

  // Base cases
  for (let i = 0; i <= n; i++) table[i][0] = 0;
  for (let j = 0; j <= w; j++) table[0][j] = 0;

  yield {
    table: table.map((row) => [...row]),
    activeCell: null,
    dependentCells: [],
    formula: 'Initialize base cases: dp[i][0] = 0, dp[0][w] = 0',
    line: 1,
  };

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let j = 1; j <= w; j++) {
      const active: [number, number] = [i, j];

      if (item.weight > j) {
        const formula = `weight (${item.weight}) > capacity (${j}) -> dp[${i}][${j}] = dp[${i - 1}][${j}]`;
        const dependents: [number, number][] = [[i - 1, j]];

        yield {
          table: table.map((row) => [...row]),
          activeCell: active,
          dependentCells: dependents,
          formula,
          line: 5,
        };

        table[i][j] = table[i - 1][j] ?? 0;
      } else {
        const skipVal = table[i - 1][j] ?? 0;
        const takeVal = item.value + (table[i - 1][j - item.weight] ?? 0);
        const formula = `dp[${i}][${j}] = max(skip (${skipVal}), take value (${item.value}) + dp[${i - 1}][${j - item.weight}] (${table[i - 1][j - item.weight] ?? 0}))`;
        const dependents: [number, number][] = [
          [i - 1, j],
          [i - 1, j - item.weight],
        ];

        yield {
          table: table.map((row) => [...row]),
          activeCell: active,
          dependentCells: dependents,
          formula,
          line: 7,
        };

        table[i][j] = Math.max(skipVal, takeVal);
      }

      yield {
        table: table.map((row) => [...row]),
        activeCell: active,
        dependentCells: [],
        formula: `Cell filled: dp[${i}][${j}] = ${table[i][j]}`,
        line: 9,
      };
    }
  }

  yield {
    table: table.map((row) => [...row]),
    activeCell: [n, w],
    dependentCells: [],
    formula: `Knapsack completed. Max value is ${table[n][w]}`,
    line: 11,
  };
}

// Fibonacci (Tabulation) generator
export function* fibonacci(n: number): Generator<DPStep> {
  const table: (number | null)[][] = [Array(n + 1).fill(null)];
  table[0][0] = 0;
  if (n > 0) table[0][1] = 1;

  yield {
    table: table.map((row) => [...row]),
    activeCell: null,
    dependentCells: [],
    formula: 'Initialize base cases: F[0] = 0, F[1] = 1',
    line: 1,
  };

  for (let i = 2; i <= n; i++) {
    const active: [number, number] = [0, i];
    const dependents: [number, number][] = [
      [0, i - 1],
      [0, i - 2],
    ];
    const formula = `F[${i}] = F[${i - 1}] (${table[0][i - 1]}) + F[${i - 2}] (${table[0][i - 2]})`;

    yield {
      table: table.map((row) => [...row]),
      activeCell: active,
      dependentCells: dependents,
      formula,
      line: 4,
    };

    table[0][i] = (table[0][i - 1] ?? 0) + (table[0][i - 2] ?? 0);

    yield {
      table: table.map((row) => [...row]),
      activeCell: active,
      dependentCells: [],
      formula: `F[${i}] filled with ${table[0][i]}`,
      line: 5,
    };
  }

  yield {
    table: table.map((row) => [...row]),
    activeCell: [0, n],
    dependentCells: [],
    formula: `Fibonacci completed. F[${n}] = ${table[0][n]}`,
    line: 7,
  };
}
