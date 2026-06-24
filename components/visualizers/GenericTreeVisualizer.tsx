import React from "react";
import { useCodeVisualizerStore } from "../../store/codeVisualizerStore";
import { TimelineBuffer } from "../../lib/codeVisualizer/timeline";

export const GenericTreeVisualizer: React.FC = () => {
  const currentStepIndex = useCodeVisualizerStore((state) => state.currentStepIndex);

  // We define 7 static binary tree nodes
  const nodes = [
    { id: "0", label: "50", x: 200, y: 50 },
    { id: "1", label: "30", x: 100, y: 120 },
    { id: "2", label: "70", x: 300, y: 120 },
    { id: "3", label: "20", x: 50, y: 200 },
    { id: "4", label: "40", x: 150, y: 200 },
    { id: "5", label: "60", x: 250, y: 200 },
    { id: "6", label: "80", x: 350, y: 200 },
  ];

  const edges = [
    { parent: "0", child: "1" },
    { parent: "0", child: "2" },
    { parent: "1", child: "3" },
    { parent: "1", child: "4" },
    { parent: "2", child: "5" },
    { parent: "2", child: "6" },
  ];

  // Simulating tree search/insert traversal
  const visitedNodeIds = new Set<string>();
  const activeNodeId = String(currentStepIndex % nodes.length);
  for (let i = 0; i <= currentStepIndex; i++) {
    visitedNodeIds.add(String(i % nodes.length));
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#111111]/80 rounded-xl relative select-none">
      <div className="text-white text-xs uppercase tracking-wider font-bold mb-4 opacity-75 font-mono">
        Generic Tree Explorer
      </div>

      <div className="flex-1 w-full max-w-sm aspect-square relative bg-[#0d0d0d] border border-[#222] rounded-lg">
        <svg viewBox="0 0 400 260" className="w-full h-full">
          {/* Draw edges */}
          {edges.map((e, idx) => {
            const parent = nodes.find((n) => n.id === e.parent)!;
            const child = nodes.find((n) => n.id === e.child)!;
            
            const isTraversed = visitedNodeIds.has(e.parent) && visitedNodeIds.has(e.child);

            return (
              <line
                key={idx}
                x1={parent.x}
                y1={parent.y}
                x2={child.x}
                y2={child.y}
                stroke={isTraversed ? "#A78BFA" : "#333333"}
                strokeWidth={isTraversed ? 3 : 1.5}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((n) => {
            const isVisited = visitedNodeIds.has(n.id);
            const isActive = activeNodeId === n.id;

            return (
              <g key={n.id} className="cursor-pointer transition-transform duration-200">
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={18}
                  fill={isActive ? "#7C3AED" : isVisited ? "#A78BFA" : "#181818"}
                  stroke={isActive ? "#FFFFFF" : isVisited ? "#7C3AED" : "#333333"}
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  fill={isActive || isVisited ? "#FFFFFF" : "#888888"}
                  className="font-mono text-[10px] font-bold"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
