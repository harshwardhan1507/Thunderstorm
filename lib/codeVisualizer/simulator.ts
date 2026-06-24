import { VisualizerStep, VisualEvent, CallFrame, VariableSnapshot, PERFORMANCE_PRESETS } from "../../types/codeVisualizer.types";

/**
 * Lightweight variable simulator that models code execution on a dataset and outputs VisualizerSteps.
 */
export function simulateCode(
  code: string,
  inferredStructure: string,
  customDataset?: number[],
  preset: "low" | "medium" | "high" = "medium"
): {
  steps: VisualizerStep[];
  metrics: { totalReads: number; totalWrites: number; totalCompares: number; totalSwaps: number };
} {
  const limits = PERFORMANCE_PRESETS[preset];
  const steps: VisualizerStep[] = [];
  const lines = code.split("\n").map(l => l.trim());

  // 1. Initialize dataset
  let dataset: number[] = customDataset && customDataset.length > 0
    ? [...customDataset]
    : [25, 40, 15, 90, 8, 60, 44, 30]; // default mock dataset

  // Cap size based on performance budget
  if (dataset.length > limits.maxArraySize) {
    dataset = dataset.slice(0, limits.maxArraySize);
  }

  // 2. Metrics counters
  let reads = 0;
  let writes = 0;
  let compares = 0;
  let swaps = 0;
  let operations = 0;

  // 3. Execution state
  const variablesStore: Record<string, any> = {
    arr: [...dataset],
    n: dataset.length,
  };

  // We write a simulation generator that unrolls standard DSA templates:
  // Since we are matching specific types, let's build structural pattern generators 
  // that output realistic traces for the structures detected:
  
  if (inferredStructure === "sorting" || inferredStructure === "generic-array") {
    // We simulate Bubble Sort / Selection Sort logic on the dataset
    const arr = [...dataset];
    const n = arr.length;
    let stepIdCounter = 0;

    // We build steps based on standard nested loop iteration
    for (let i = 0; i < n - 1; i++) {
      if (steps.length >= limits.maxSteps) break;

      for (let j = 0; j < n - i - 1; j++) {
        if (steps.length >= limits.maxSteps) break;
        operations++;

        // 1. READ event
        reads += 2;
        const readEvent: VisualEvent = {
          type: "READ",
          timestamp: Date.now(),
          payload: { target: "arr", indices: [j, j + 1] }
        };

        // 2. COMPARE event
        compares++;
        const compareEvent: VisualEvent = {
          type: "COMPARE",
          timestamp: Date.now(),
          payload: { left: j, right: j + 1 }
        };

        const isSwapRequired = arr[j] > arr[j + 1];
        const branchEvent: VisualEvent = {
          type: isSwapRequired ? "CONDITION_TRUE" : "CONDITION_FALSE",
          timestamp: Date.now(),
          payload: { condition: `arr[${j}] > arr[${j+1}]` }
        };

        const stepEvents = [readEvent, compareEvent, branchEvent];

        if (isSwapRequired) {
          // Perform swap
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          writes += 2;

          const swapEvent: VisualEvent = {
            type: "SWAP",
            timestamp: Date.now(),
            payload: { indices: [j, j + 1], values: [arr[j], arr[j + 1]] }
          };
          stepEvents.push(swapEvent);
        }

        // Variables snapshot (only changes/deltas)
        const varSnapshots: VariableSnapshot[] = [
          { variableId: "i", value: i, timestamp: Date.now() },
          { variableId: "j", value: j, timestamp: Date.now() },
          { variableId: "arr", value: [...arr], timestamp: Date.now() }
        ];

        steps.push({
          id: `step-${stepIdCounter++}`,
          line: 4, // Simulated active line
          visualEvents: stepEvents,
          variables: varSnapshots,
          callStack: [
            { functionName: "bubbleSort", arguments: { arr: [...arr], n }, activeLine: 4 }
          ],
          explanation: {
            title: isSwapRequired ? "Elements Swapped" : "Comparison Made",
            summary: isSwapRequired
              ? `arr[${j}] (${arr[j+1]}) is greater than arr[${j+1}] (${arr[j]}), swapping them.`
              : `Comparing arr[${j}] (${arr[j]}) and arr[${j+1}] (${arr[j+1]}). No swap needed.`,
            category: isSwapRequired ? "swap" : "comparison"
          },
          metrics: {
            comparisons: compares,
            swaps: swaps,
            operations,
            recursionDepth: 0,
            reads,
            writes
          }
        });
      }
    }
  } else if (inferredStructure === "generic-recursion") {
    // Simulate recursive Fibonacci call stack frames
    let stepIdCounter = 0;
    const maxDepth = Math.min(10, limits.maxSteps); // avoid infinite stack

    const runFibRecursive = (n: number, depth: number): number => {
      if (steps.length >= limits.maxSteps) return 0;
      operations++;

      // Create PUSH / RECURSE events
      const recurseEvent: VisualEvent = {
        type: "RECURSE",
        timestamp: Date.now(),
        payload: { function: `fib(${n})`, depth }
      };

      const varSnapshots: VariableSnapshot[] = [
        { variableId: "n", value: n, timestamp: Date.now() }
      ];

      steps.push({
        id: `step-${stepIdCounter++}`,
        line: 2,
        visualEvents: [recurseEvent],
        variables: varSnapshots,
        callStack: Array.from({ length: depth }).map((_, idx) => ({
          functionName: "fib",
          arguments: { n: n + idx },
          activeLine: 2
        })),
        explanation: {
          title: `Recursive Call fib(${n})`,
          summary: `Entering recursive call for fib(${n}) at recursion depth ${depth}.`,
          category: "recursion"
        },
        metrics: {
          comparisons: 0,
          swaps: 0,
          operations,
          recursionDepth: depth,
          reads,
          writes
        }
      });

      if (n <= 1) {
        // RETURN event
        const returnEvent: VisualEvent = {
          type: "RETURN",
          timestamp: Date.now(),
          payload: { value: n }
        };

        steps.push({
          id: `step-${stepIdCounter++}`,
          line: 3,
          visualEvents: [returnEvent],
          variables: varSnapshots,
          callStack: Array.from({ length: depth - 1 }).map((_, idx) => ({
            functionName: "fib",
            arguments: { n: n + idx + 1 },
            activeLine: 3
          })),
          explanation: {
            title: `Returning ${n}`,
            summary: `Base case reached: fib(${n}) returns ${n}.`,
            category: "recursion"
          },
          metrics: {
            comparisons: 0,
            swaps: 0,
            operations,
            recursionDepth: depth - 1,
            reads,
            writes
          }
        });
        return n;
      }

      const left = runFibRecursive(n - 1, depth + 1);
      const right = runFibRecursive(n - 2, depth + 1);
      const result = left + right;

      // Return composite result
      const returnEvent: VisualEvent = {
        type: "RETURN",
        timestamp: Date.now(),
        payload: { value: result }
      };

      steps.push({
        id: `step-${stepIdCounter++}`,
        line: 4,
        visualEvents: [returnEvent],
        variables: [
          { variableId: "n", value: n, timestamp: Date.now() },
          { variableId: "result", value: result, timestamp: Date.now() }
        ],
        callStack: Array.from({ length: depth - 1 }).map((_, idx) => ({
          functionName: "fib",
          arguments: { n: n + idx + 1 },
          activeLine: 4
        })),
        explanation: {
          title: `Returning result ${result}`,
          summary: `Returning sum of fib(${n-1}) and fib(${n-2}) = ${result}.`,
          category: "recursion"
        },
        metrics: {
          comparisons: 0,
          swaps: 0,
          operations,
          recursionDepth: depth - 1,
          reads,
          writes
        }
      });

      return result;
    };

    runFibRecursive(5, 1);
  } else {
    // Default fallback: Simple incremental steps on Array
    const arr = [...dataset];
    let stepIdCounter = 0;

    for (let i = 0; i < arr.length; i++) {
      operations++;
      reads++;
      const readEvent: VisualEvent = {
        type: "READ",
        timestamp: Date.now(),
        payload: { index: i, value: arr[i] }
      };

      steps.push({
        id: `step-${stepIdCounter++}`,
        line: 2,
        visualEvents: [readEvent],
        variables: [
          { variableId: "i", value: i, timestamp: Date.now() },
          { variableId: "arr", value: [...arr], timestamp: Date.now() }
        ],
        callStack: [{ functionName: "traverse", arguments: { arr }, activeLine: 2 }],
        explanation: {
          title: "Element Accessed",
          summary: `Reading array index ${i}: value is ${arr[i]}.`,
          category: "general"
        },
        metrics: {
          comparisons: 0,
          swaps: 0,
          operations,
          recursionDepth: 0,
          reads,
          writes
        }
      });
    }
  }

  return {
    steps,
    metrics: {
      totalReads: reads,
      totalWrites: writes,
      totalCompares: compares,
      totalSwaps: swaps
    }
  };
}
