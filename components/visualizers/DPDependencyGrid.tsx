import React, { useState } from "react";
import { useCodeVisualizerStore } from "../../store/codeVisualizerStore";
import { TimelineBuffer } from "../../lib/codeVisualizer/timeline";

export const DPDependencyGrid: React.FC = () => {
  const currentStepIndex = useCodeVisualizerStore((state) => state.currentStepIndex);
  
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // Define a 5x5 dynamic programming grid
  const rows = 5;
  const cols = 5;
  
  // Create simple lookup grid calculation
  const grid: number[][] = Array.from({ length: rows }).map((_, r) =>
    Array.from({ length: cols }).map((_, c) => {
      if (r === 0 || c === 0) return 1;
      return 0; // uncomputed default
    })
  );

  // Fill in calculated cells up to current step progress
  // We simulate LCS / Knapsack grid updates
  let computedCount = 0;
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (computedCount <= currentStepIndex) {
        grid[r][c] = grid[r-1][c] + grid[r][c-1];
        computedCount++;
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#111111]/80 rounded-xl relative select-none">
      <div className="text-white text-xs uppercase tracking-wider font-bold mb-4 opacity-75 font-mono">
        DP Dependency Grid
      </div>

      <div className="relative border border-[#2a2a2a] p-2 rounded-lg bg-[#0d0d0d] flex items-center justify-center">
        {/* Draw dependency SVG lines when cell is hovered */}
        {hoveredCell && hoveredCell.r > 0 && hoveredCell.c > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Draw arrow pointing from top cell (r-1, c) to (r, c) */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#A78BFA" />
              </marker>
            </defs>
          </svg>
        )}

        <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
          {grid.flatMap((row, r) =>
            row.map((val, c) => {
              const isComputed = val > 0;
              const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
              const isDependency = hoveredCell && 
                ((hoveredCell.r - 1 === r && hoveredCell.c === c) || 
                 (hoveredCell.r === r && hoveredCell.c - 1 === c));

              return (
                <div
                  key={`${r}-${c}`}
                  onMouseEnter={() => setHoveredCell({ r, c })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-11 h-11 flex flex-col items-center justify-center rounded border transition-all duration-300 ${
                    isHovered
                      ? "bg-accent-purple border-white text-white scale-105 shadow-md"
                      : isDependency
                      ? "bg-accent-purple/20 border-accent-purple text-white"
                      : isComputed
                      ? "bg-[#181818] border-[#333] text-white"
                      : "bg-[#0a0a0a] border-[#1a1a1a] text-text-muted opacity-40"
                  }`}
                >
                  <span className="text-[10px] text-text-muted mb-0.5">
                    ({r},{c})
                  </span>
                  <span className="font-bold text-[10px]">
                    {val}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 text-[10px] text-text-muted font-mono text-center">
        * Hover computed cells to inspect DP recursive dependencies
      </div>
    </div>
  );
};
