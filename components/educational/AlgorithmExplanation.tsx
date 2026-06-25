import React, { useState } from 'react';

interface Explanation {
  intuition: string;
  pros: string[];
  cons: string[];
  applications: string[];
}

const explanationData: Record<string, Explanation> = {
  // Sorting
  bubble: {
    intuition: 'Compare adjacent elements repeatedly and swap them if they are in the wrong order. The largest elements "bubble" to the end of the array.',
    pros: ['Extremely simple to implement', 'In-place sorting with O(1) space', 'Stable sorting algorithm'],
    cons: ['Very slow O(n²) performance', 'Highly inefficient for large datasets'],
    applications: ['Simple sorting demonstrations', 'Polishing nearly-sorted arrays'],
  },
  quick: {
    intuition: 'Select a "pivot" element, partition the array so that elements smaller than pivot go left and larger go right, then recursively sort the partitions.',
    pros: ['Very fast in practice with low overhead', 'In-place sorting (with stack frame cost)', 'Cache-friendly access patterns'],
    cons: ['Unstable sort', 'Worst case performance is O(n²) if pivots are poorly chosen'],
    applications: ['Standard library implementations', 'Large data arrays where speed is priority'],
  },
  merge: {
    intuition: 'Divide the array in half recursively, sort the sub-arrays, and merge them back together in sorted order.',
    pros: ['Guaranteed O(n log n) performance', 'Stable sorting algorithm', 'Excellent for external sorting (large files)'],
    cons: ['Requires O(n) extra space to perform merge operations', 'Slower in-memory overhead than Quick Sort'],
    applications: ['Sorting linked lists', 'E-commerce catalogs requiring stable sorted list results'],
  },
  heap: {
    intuition: 'Build a Max Heap from the array, repeatedly extract the maximum element and restore the heap property, resulting in a sorted array.',
    pros: ['Guaranteed O(n log n) performance', 'In-place sorting with O(1) space', 'Excellent for real-time systems'],
    cons: ['Unstable sort', 'Poor cache locality compared to Quick Sort'],
    applications: ['Embedded systems with strict memory budgets', 'Sorting priority-bound elements'],
  },
  // Graphs
  bfs: {
    intuition: 'Explore all neighbors of the current vertex first before moving on to the next level of neighbors. Level-by-level breadth exploration.',
    pros: ['Guaranteed to find the shortest path in unweighted graphs', 'Simple queue-based implementation'],
    cons: ['Consumes a lot of memory O(V) to store queue states', 'Slower than DFS for very deep trees'],
    applications: ['Social networking connections (degrees of separation)', 'Peer-to-peer network routing', 'GPS navigation steps'],
  },
  dfs: {
    intuition: 'Explore as deep as possible along each branch before backtracking. Reaches leaf nodes before checking adjacent branches.',
    pros: ['Memory efficient O(d) where d is depth', 'Easily implemented using recursion/stack', 'Ideal for finding cycles'],
    cons: ['Not guaranteed to find the shortest path', 'Can get trapped in infinite paths if cycles are not managed'],
    applications: ['Solving mazes and puzzles', 'Topological sorting in compiler dependencies', 'Detecting cycles in diagrams'],
  },
  // Pathfinding
  dijkstra: {
    intuition: 'Explore nodes in order of their cumulative distance from start. Guarantees finding the shortest path by relaxing edge weights.',
    pros: ['Guaranteed to find the shortest path', 'Works on weighted graphs'],
    cons: ['Slow on large grids as it explores radially in all directions', 'Cannot handle negative edge weights'],
    applications: ['Google Maps routing coordinates', 'Network routing protocols (OSPF)', 'Logistics delivery scheduling'],
  },
  astar: {
    intuition: 'Heuristically directs the search towards the target. Combines actual distance from start with estimated distance to target to skip unproductive paths.',
    pros: ['Much faster than Dijkstra on grids', 'Finds shortest path if heuristic is admissible'],
    cons: ['Quality of path depends heavily on the heuristic formula', 'Higher memory cost to track open/closed sets'],
    applications: ['NPC pathfinding in video games', 'Robotics traversal path generation', 'AI planning solvers'],
  },
  // Trees
  bst: {
    intuition: 'Hierarchical node layout where left subtree keys are smaller and right subtree keys are larger than the parent node.',
    pros: ['Simple dynamic insertion and deletion', 'Efficient in-order sorted traversal'],
    cons: ['Can become highly unbalanced (skewed list) resulting in O(N) operations'],
    applications: ['Symbol tables in compilers', 'Dynamic datasets needing fast search/insert'],
  },
  avl: {
    intuition: 'Self-balancing BST where the heights of the two child subtrees of any node differ by at most one. Rotations are triggered on imbalance.',
    pros: ['Guaranteed O(log N) operations', 'Faster lookups than Red-Black trees due to stricter balance'],
    cons: ['Frequent insert/delete operations trigger rotation overhead', 'Complexity in implementation'],
    applications: ['Database index lookups where read operations outnumber writes', 'Memory managers'],
  },
  // DP
  lcs: {
    intuition: 'Build a table comparing character subproblems. Re-use results of shorter matching substrings to calculate longest common sequences.',
    pros: ['Solves complex sequence matching in O(M*N) instead of exponential time'],
    cons: ['Consumes O(M*N) memory space for tabulation'],
    applications: ['Diff utilities (git diff comparisons)', 'Bioinformatics (DNA sequence comparisons)'],
  },
  knapsack: {
    intuition: 'Compute optimal value combinations for each sub-capacity. Decides whether to skip or include an item at every capacity block.',
    pros: ['Finds the absolute optimal combination of resource value'],
    cons: ['Pseudo-polynomial time complexity', 'Table size grows with capacity'],
    applications: ['Investment portfolio optimization', 'Budget constraints selection', 'Loading cargo limits'],
  },
  fibonacci: {
    intuition: 'Avoid redundant recursion by storing previously calculated terms in an array (tabulation).',
    pros: ['Reduces time complexity from O(2^N) to O(N)', 'Extremely fast'],
    cons: ['Requires O(N) extra space (which can be optimized to O(1))'],
    applications: ['Dynamic programming foundation teaching', 'Growth models calculations'],
  },
  // Greedy
  activity: {
    intuition: 'Sort activities by finish time, always greedily pick the next compatible activity that ends earliest, leaving maximum space for others.',
    pros: ['Provably optimal for activity selection', 'Extremely fast O(N log N) execution'],
    cons: ['Only works if greedy choice holds (e.g. interval scheduling with equal values)'],
    applications: ['Classroom room bookings scheduling', 'CPU instruction scheduling', 'Project management'],
  },
  huffman: {
    intuition: 'Greedily merge the two lowest-frequency nodes to build a prefix-free variable-length binary encoding tree.',
    pros: ['Provably optimal prefix coding compression', 'Reduces files size based on char distribution'],
    cons: ['Must transmit tree structure with compressed data to decode'],
    applications: ['ZIP compression formats', 'JPEG images coding', 'Network data transmission compression'],
  },
};

interface AlgorithmExplanationProps {
  algorithmId: string;
}

export const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ algorithmId }) => {
  const [activeTab, setActiveTab] = useState<'intuition' | 'proscons' | 'applications'>('intuition');

  const data = explanationData[algorithmId] || {
    intuition: 'No explanation metadata configured for this algorithm.',
    pros: [],
    cons: [],
    applications: [],
  };

  return (
    <div className="w-full bg-[#141414]-card border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg select-none font-sans mt-6">
      {/* Tabs */}
      <div className="flex bg-[#141414]-elevated/50 border-b border-[#2a2a2a] p-0.5">
        <button
          onClick={() => setActiveTab('intuition')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'intuition'
              ? 'text-white border-b-2 border-accent-primary'
              : 'text-[#888888] hover:text-white'
          }`}
        >
          Intuition
        </button>
        <button
          onClick={() => setActiveTab('proscons')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'proscons'
              ? 'text-white border-b-2 border-accent-primary'
              : 'text-[#888888] hover:text-white'
          }`}
        >
          Pros & Cons
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'applications'
              ? 'text-white border-b-2 border-accent-primary'
              : 'text-[#888888] hover:text-white'
          }`}
        >
          Applications
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 text-sm text-[#888888] leading-relaxed">
        {activeTab === 'intuition' && (
          <div>
            <h4 className="text-white font-bold mb-2">How it works:</h4>
            <p className="font-sans text-xs text-[#f0f0f0]">{data.intuition}</p>
          </div>
        )}

        {activeTab === 'proscons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-accent-success font-bold text-xs uppercase tracking-wide mb-2">Advantages:</h4>
              <ul className="list-disc pl-4 space-y-1 text-xs text-[#f0f0f0]">
                {data.pros.map((p, idx) => (
                  <li key={`pro-${idx}`}>{p}</li>
                ))}
                {data.pros.length === 0 && <li>None listed</li>}
              </ul>
            </div>
            <div>
              <h4 className="text-accent-error font-bold text-xs uppercase tracking-wide mb-2">Disadvantages:</h4>
              <ul className="list-disc pl-4 space-y-1 text-xs text-[#f0f0f0]">
                {data.cons.map((c, idx) => (
                  <li key={`con-${idx}`}>{c}</li>
                ))}
                {data.cons.length === 0 && <li>None listed</li>}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <h4 className="text-white font-bold mb-2 font-mono text-xs uppercase tracking-wider">Real-world Uses:</h4>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#f0f0f0]">
              {data.applications.map((app, idx) => (
                <li key={`app-${idx}`}>{app}</li>
              ))}
              {data.applications.length === 0 && <li>None listed</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
