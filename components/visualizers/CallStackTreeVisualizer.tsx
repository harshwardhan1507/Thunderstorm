import React, { useState } from "react";
import { useCodeVisualizerStore } from "../../store/codeVisualizerStore";
import { TimelineBuffer } from "../../lib/codeVisualizer/timeline";

export const CallStackTreeVisualizer: React.FC = () => {
  const currentStepIndex = useCodeVisualizerStore((state) => state.currentStepIndex);
  const setCurrentStepIndex = useCodeVisualizerStore((state) => state.setCurrentStepIndex);

  const [viewMode, setViewMode] = useState<"stack" | "tree">("stack");
  const step = TimelineBuffer.getStep(currentStepIndex);
  const callStack = step?.callStack || [];

  // Parse all steps to build a flat list of recursive calls for the Call Tree View
  const allSteps = TimelineBuffer.getSteps();
  const recursiveCalls: Array<{ id: string; name: string; parentId: string | null; stepIdx: number }> = [];
  const callIdMap = new Map<string, string>(); // maps call signatures to call ids
  
  let activeStack: string[] = [];

  allSteps.forEach((s, idx) => {
    s.visualEvents.forEach((ev) => {
      if (ev.type === "RECURSE") {
        const callSig = ev.payload?.function || `fib(${idx})`;
        const parentSig = activeStack[activeStack.length - 1] || null;
        
        const callId = `call-${idx}`;
        callIdMap.set(callSig, callId);
        
        recursiveCalls.push({
          id: callId,
          name: callSig,
          parentId: parentSig ? callIdMap.get(parentSig) || null : null,
          stepIdx: idx,
        });

        activeStack.push(callSig);
      } else if (ev.type === "RETURN") {
        activeStack.pop();
      }
    });
  });

  return (
    <div className="w-full h-full flex flex-col p-4 bg-[#111111]/80 rounded-xl relative select-none">
      {/* Header controls */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-white text-xs uppercase tracking-wider font-bold font-mono opacity-75">
          Recursion Frame Tracker
        </span>
        <div className="flex gap-1 bg-[#181818] p-0.5 rounded border border-[#2a2a2a]">
          <button
            onClick={() => setViewMode("stack")}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition duration-200 ${
              viewMode === "stack" ? "bg-[#7c3aed] text-white" : "text-[#888888] hover:text-white"
            }`}
          >
            Stack View
          </button>
          <button
            onClick={() => setViewMode("tree")}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition duration-200 ${
              viewMode === "tree" ? "bg-[#7c3aed] text-white" : "text-[#888888] hover:text-white"
            }`}
          >
            Call Tree
          </button>
        </div>
      </div>

      {/* Stack View */}
      {viewMode === "stack" && (
        <div className="flex-1 flex flex-col justify-end gap-2 overflow-y-auto px-4 py-2 border border-[#222] rounded bg-[#0d0d0d]">
          {callStack.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[#555555] font-mono text-xs">
              Call Stack is empty
            </div>
          ) : (
            [...callStack].reverse().map((frame, idx) => {
              const argsText = Object.entries(frame.arguments)
                .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                .join(", ");
              const isTop = idx === 0;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border font-mono text-xs flex justify-between items-center transition-all duration-300 ${
                    isTop
                      ? "bg-[#7c3aed]/20 border-accent-purple text-white shadow-[0_0_10px_rgba(124,58,237,0.2)]"
                      : "bg-[#161616] border-[#2a2a2a] text-[#888888]"
                  }`}
                >
                  <div>
                    <span className="font-bold text-white">{frame.functionName}</span>
                    <span className="text-[10px] opacity-75 ml-1">({argsText})</span>
                  </div>
                  <div className="text-[10px] text-[#555555]">Line {frame.activeLine}</div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Call Tree View */}
      {viewMode === "tree" && (
        <div className="flex-1 overflow-auto border border-[#222] rounded bg-[#0d0d0d] p-4 flex items-center justify-center min-h-0 relative">
          {recursiveCalls.length === 0 ? (
            <div className="text-[#555555] font-mono text-xs">No recursive tree logged</div>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              {/* Hierarchical tree structure */}
              <div className="flex flex-wrap gap-4 justify-center">
                {recursiveCalls.map((call) => {
                  const isActive = allSteps[currentStepIndex]?.visualEvents.some(
                    (e) => e.type === "RECURSE" && e.payload?.function === call.name
                  );

                  return (
                    <button
                      key={call.id}
                      onClick={() => setCurrentStepIndex(call.stepIdx)}
                      className={`px-3 py-1.5 rounded border font-mono text-[10px] transition duration-200 cursor-pointer shadow-md hover:scale-105 ${
                        isActive
                          ? "bg-[#7c3aed] border-white text-white font-black animate-pulse"
                          : call.stepIdx <= currentStepIndex
                          ? "bg-[#7c3aed]/10 border-accent-purple/40 text-[#7c3aed]"
                          : "bg-[#161616] border-[#2a2a2a] text-[#555555]"
                      }`}
                    >
                      {call.name}
                    </button>
                  );
                })}
              </div>
              <div className="text-[10px] text-[#555555] font-mono absolute bottom-2 right-2">
                * Click nodes to jump to call step
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
