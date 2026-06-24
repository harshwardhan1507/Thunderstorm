import React from "react";
import { useCodeVisualizerStore } from "../../store/codeVisualizerStore";
import { TimelineBuffer } from "../../lib/codeVisualizer/timeline";

export const GenericGraphVisualizer: React.FC = () => {
  const currentStepIndex = useCodeVisualizerStore((state) => state.currentStepIndex);
  const step = TimelineBuffer.getStep(currentStepIndex);

  // We define 5 static nodes for a demo graph
  const nodes = [
    { id: "0", label: "A", x: 100, y: 100 },
    { id: "1", label: "B", x: 200, y: 60 },
    { id: "2", label: "C", x: 300, y: 100 },
    { id: "3", label: "D", x: 250, y: 200 },
    { id: "4", label: "E", x: 150, y: 200 },
  ];

  const edges = [
    { source: "0", target: "1" },
    { source: "1", target: "2" },
    { source: "2", target: "3" },
    { source: "3", target: "4" },
    { source: "4", target: "0" },
    { source: "1", target: "3" },
  ];

  // Graph traversal visited tracker
  // Simple heuristic: as index increases, we visit more nodes
  const visitedNodeIds = new Set<string>();
  const activeNodeId = String(currentStepIndex % nodes.length);
  
  for (let i = 0; i <= currentStepIndex; i++) {
    visitedNodeIds.add(String(i % nodes.length));
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#111111]/80 rounded-xl relative select-none">
      <div className="text-white text-xs uppercase tracking-wider font-bold mb-4 opacity-75 font-mono">
        Generic Graph Explorer
      </div>

      <div className="flex-1 w-full max-w-sm aspect-square relative bg-[#0d0d0d] border border-[#222] rounded-lg">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Draw edges */}
          {edges.map((e, idx) => {
            const src = nodes.find((n) => n.id === e.source)!;
            const tgt = nodes.find((n) => n.id === e.target)!;
            
            const isTraversed = visitedNodeIds.has(e.source) && visitedNodeIds.has(e.target);

            return (
              <line
                key={idx}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
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
                  r={20}
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
                  className="font-mono text-xs font-bold"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex gap-4 text-xs font-mono text-text-secondary bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] w-full max-w-sm justify-between">
        <div>
          <span className="text-text-muted">Visited:</span> {visitedNodeIds.size} / {nodes.length}
        </div>
        <div>
          <span className="text-text-muted">Edges:</span> {edges.length}
        </div>
      </div>
    </div>
  );
};
