import { GreedyStep, Activity, HuffmanNode } from '../../../types/algorithm.types';

// Activity Selection Generator
export function* activitySelection(activities: Activity[]): Generator<GreedyStep> {
  // Sort activities by end time
  const sorted = [...activities].sort((a, b) => a.end - b.end);
  const selected: string[] = [];
  const discarded: string[] = [];

  yield {
    activities: { selected: [], discarded: [], active: null },
    line: 1, // Sort activities by end time
  };

  if (sorted.length === 0) return;

  // Select first activity
  const first = sorted[0];
  selected.push(first.id);

  yield {
    activities: { selected: [...selected], discarded: [], active: first.id },
    line: 3, // Select first activity
  };

  let lastEnd = first.end;

  for (let i = 1; i < sorted.length; i++) {
    const act = sorted[i];

    yield {
      activities: {
        selected: [...selected],
        discarded: [...discarded],
        active: act.id,
      },
      line: 5, // Evaluate next activity
    };

    if (act.start >= lastEnd) {
      selected.push(act.id);
      lastEnd = act.end;

      yield {
        activities: {
          selected: [...selected],
          discarded: [...discarded],
          active: act.id,
        },
        line: 6, // Select non-overlapping activity
      };
    } else {
      discarded.push(act.id);

      yield {
        activities: {
          selected: [...selected],
          discarded: [...discarded],
          active: act.id,
        },
        line: 8, // Discard overlapping activity
      };
    }
  }

  yield {
    activities: { selected: [...selected], discarded: [...discarded], active: null },
    line: 10, // Complete
  };
}

// Huffman Coding Tree Builder
export function* huffmanCoding(charFreqs: { char: string; freq: number }[]): Generator<GreedyStep> {
  const nodes: Record<string, HuffmanNode> = {};
  let nodeIdCounter = 0;

  // Initialize leaf nodes
  let queue = charFreqs.map((cf) => {
    const id = `leaf-${nodeIdCounter++}-${cf.char}`;
    nodes[id] = {
      id,
      label: cf.char,
      freq: cf.freq,
      leftId: null,
      rightId: null,
      x: 0,
      y: 0,
    };
    return { id, label: cf.char, freq: cf.freq };
  });

  // Sort queue by frequency
  queue.sort((a, b) => a.freq - b.freq);

  yield {
    huffmanTree: {
      nodes: { ...nodes },
      rootId: null,
      queue: [...queue],
      activeIds: [],
    },
    line: 1, // Initialize leaf nodes sorted by freq
  };

  while (queue.length > 1) {
    // Pop two smallest
    const leftItem = queue.shift()!;
    const rightItem = queue.shift()!;

    yield {
      huffmanTree: {
        nodes: { ...nodes },
        rootId: null,
        queue: [leftItem, rightItem, ...queue],
        activeIds: [leftItem.id, rightItem.id],
      },
      line: 3, // Extract two nodes with minimum frequency
    };

    // Combine
    const parentId = `parent-${nodeIdCounter++}`;
    const parentFreq = leftItem.freq + rightItem.freq;
    const parentLabel = `${leftItem.label}${rightItem.label}`;

    nodes[parentId] = {
      id: parentId,
      label: parentLabel,
      freq: parentFreq,
      leftId: leftItem.id,
      rightId: rightItem.id,
      x: 0,
      y: 0,
    };

    const parentQueueItem = { id: parentId, label: parentLabel, freq: parentFreq };
    queue.push(parentQueueItem);
    queue.sort((a, b) => a.freq - b.freq);

    // Calculate layout for rendering nodes in space
    layoutHuffmanNodes(nodes, parentId);

    yield {
      huffmanTree: {
        nodes: { ...nodes },
        rootId: parentId,
        queue: [...queue],
        activeIds: [parentId],
      },
      line: 5, // Create parent node with combined freq and re-insert
    };
  }

  const rootId = queue[0]?.id || null;
  layoutHuffmanNodes(nodes, rootId);

  yield {
    huffmanTree: {
      nodes: { ...nodes },
      rootId,
      queue: [...queue],
      activeIds: [],
    },
    line: 8, // Complete Huffman Tree construction
  };
}

// Coordinate Layout Helper for Huffman Tree
function layoutHuffmanNodes(nodes: Record<string, HuffmanNode>, rootId: string | null, canvasWidth = 600) {
  if (!rootId) return;

  function traverse(id: string | null, leftBound: number, rightBound: number, depth: number) {
    if (!id || !nodes[id]) return;
    const node = nodes[id];
    const x = (leftBound + rightBound) / 2;
    const y = 60 + depth * 60;
    
    node.x = x;
    node.y = y;

    traverse(node.leftId, leftBound, x, depth + 1);
    traverse(node.rightId, x, rightBound, depth + 1);
  }

  traverse(rootId, 20, canvasWidth - 20, 0);
}
