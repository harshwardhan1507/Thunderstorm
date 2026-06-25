import React from "react";
import { useCodeVisualizerStore } from "../../store/codeVisualizerStore";
import { TimelineBuffer } from "../../lib/codeVisualizer/timeline";

export const GenericArrayVisualizer: React.FC = () => {
  const currentStepIndex = useCodeVisualizerStore((state) => state.currentStepIndex);
  const totalSteps = useCodeVisualizerStore((state) => state.totalSteps);

  const step = TimelineBuffer.getStep(currentStepIndex);
  
  // Find current array state
  const arrVariable = step?.variables.find((v) => v.variableId === "arr");
  const array: number[] = Array.isArray(arrVariable?.value)
    ? arrVariable.value
    : [25, 40, 15, 90, 8, 60, 44, 30]; // fallback dataset

  // Find pointer indices
  const pointers: Record<string, number> = {};
  step?.variables.forEach((v) => {
    if (v.variableId !== "arr" && typeof v.value === "number") {
      pointers[v.variableId] = v.value;
    }
  });

  // Check active comparison or swaps
  const activeCompareIndices = step?.visualEvents
    .filter((e) => e.type === "COMPARE" || e.type === "READ")
    .flatMap((e) => e.payload?.indices || [e.payload?.left, e.payload?.right])
    .filter((idx) => typeof idx === "number") || [];

  const activeSwapIndices = step?.visualEvents
    .filter((e) => e.type === "SWAP" || e.type === "WRITE")
    .flatMap((e) => e.payload?.indices)
    .filter((idx) => typeof idx === "number") || [];

  // Compute cell read/write access counts up to current index for heatmap
  const accessCounts = new Array(array.length).fill(0);
  const stepsList = TimelineBuffer.getSteps().slice(0, currentStepIndex + 1);
  stepsList.forEach((s) => {
    s.visualEvents.forEach((ev) => {
      if (ev.type === "READ" || ev.type === "WRITE" || ev.type === "COMPARE" || ev.type === "SWAP") {
        const indices = ev.payload?.indices || [ev.payload?.left, ev.payload?.right, ev.payload?.index];
        indices.forEach((idx: any) => {
          if (typeof idx === "number" && idx >= 0 && idx < accessCounts.length) {
            accessCounts[idx]++;
          }
        });
      }
    });
  });

  const maxAccess = Math.max(1, ...accessCounts);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#111111]/80 rounded-xl relative select-none">
      <div className="text-white text-xs uppercase tracking-wider font-bold mb-4 opacity-75 font-mono">
        Generic Array Explorer
      </div>

      {/* Main Array Display */}
      <div className="flex gap-2 items-center flex-wrap justify-center relative py-12 w-full max-w-lg">
        {array.map((val, idx) => {
          const isComparing = activeCompareIndices.includes(idx);
          const isSwapping = activeSwapIndices.includes(idx);
          
          // Heatmap weight (shade of violet/red depending on access frequency)
          const heatRatio = accessCounts[idx] / maxAccess;
          const heatmapBg = `rgba(167, 139, 250, ${Math.min(0.8, heatRatio * 0.5)})`;

          return (
            <div
              key={idx}
              className="relative flex flex-col items-center justify-center"
            >
              {/* Pointer Badges floating above */}
              <div className="absolute -top-10 flex flex-col gap-1 items-center z-10">
                {Object.entries(pointers).map(([name, pos]) => {
                  if (pos === idx) {
                    return (
                      <span
                        key={name}
                        className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-[#7c3aed] text-white shadow-md animate-pulse border border-[#555]"
                      >
                        {name}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Array element cell */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center border font-mono font-bold text-sm transition-all duration-300 ${
                  isSwapping
                    ? "bg-[#FACC15] border-[#D97706] text-black scale-110 shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                    : isComparing
                    ? "bg-[#7c3aed] border-[#7C3AED] text-white scale-105 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                    : "bg-[#181818] border-[#333] text-white"
                }`}
                style={{
                  backgroundColor: !isSwapping && !isComparing && accessCounts[idx] > 0 ? heatmapBg : undefined,
                }}
              >
                {val}
              </div>

              {/* Index Number */}
              <span className="text-[10px] text-[#555555] mt-2 font-mono">{idx}</span>
            </div>
          );
        })}
      </div>

      {/* Heatmap/Metadata footer */}
      <div className="mt-4 flex gap-4 text-xs font-mono text-[#888888] bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] w-full max-w-md justify-between">
        <div>
          <span className="text-[#555555]">Total Steps:</span> {totalSteps}
        </div>
        <div>
          <span className="text-[#555555]">Active Step:</span> {currentStepIndex + 1}
        </div>
        <div>
          <span className="text-[#555555]">Active Variable Count:</span> {Object.keys(pointers).length}
        </div>
      </div>
    </div>
  );
};
