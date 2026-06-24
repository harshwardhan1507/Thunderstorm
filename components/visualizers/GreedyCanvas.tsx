import React, { useEffect, useRef, useState } from 'react';
import { useGreedyStore } from '../../store/greedyStore';
import { pulseNode } from '../../lib/animations/nodeAnimation';
import { gsap } from 'gsap';

export const GreedyCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const {
    selectedAlgorithm,
    activities,
    charFreqs,
    steps,
    currentStepIndex,
  } = useGreedyStore();

  const [localNodes, setLocalNodes] = useState<Record<string, any>>({});

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 300),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentStep = steps[currentStepIndex] || null;

  // Animate Huffman tree nodes if algorithm is Huffman
  useEffect(() => {
    if (selectedAlgorithm !== 'huffman') return;
    const targetNodes = currentStep?.huffmanTree?.nodes || {};
    const nodeIds = Object.keys(targetNodes);
    if (nodeIds.length === 0) {
      setLocalNodes({});
      return;
    }

    setLocalNodes((prev) => {
      const next: Record<string, any> = {};

      nodeIds.forEach((id) => {
        const target = targetNodes[id];
        if (prev[id]) {
          next[id] = { ...prev[id] };
        } else {
          // Find parent to spawn from
          let spawnX = target.x;
          let spawnY = target.y - 30;

          const parent = Object.values(targetNodes).find(
            (p: any) => p.leftId === id || p.rightId === id
          );
          if (parent && prev[parent.id]) {
            spawnX = prev[parent.id].x;
            spawnY = prev[parent.id].y;
          }

          next[id] = {
            id,
            label: target.label,
            freq: target.freq,
            x: spawnX,
            y: spawnY,
            leftId: target.leftId,
            rightId: target.rightId,
            scale: 0.1,
          };
        }
      });

      nodeIds.forEach((id) => {
        const target = targetNodes[id];
        gsap.to(next[id], {
          x: target.x,
          y: target.y,
          scale: 1,
          leftId: target.leftId,
          rightId: target.rightId,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: () => {
            setLocalNodes((curr) => ({ ...curr }));
          },
        });
      });

      return next;
    });
  }, [currentStep, selectedAlgorithm]);

  // Pulse nodes in Huffman tree on merge
  useEffect(() => {
    if (selectedAlgorithm === 'huffman' && currentStep?.huffmanTree?.activeIds) {
      currentStep.huffmanTree.activeIds.forEach((id) => {
        pulseNode(`huffman-node-${id}`);
      });
    }
  }, [currentStepIndex, selectedAlgorithm, currentStep]);

  // Render Activity Selection Canvas
  if (selectedAlgorithm === 'activity') {
    const actState = currentStep?.activities || { selected: [], discarded: [], active: null };
    
    // Sort activities by end time for standard sorted visualization layout
    const sortedActivities = [...activities].sort((a, b) => a.end - b.end);

    const maxEnd = Math.max(...activities.map((a) => a.end), 12);
    const canvasPadding = 30;
    const drawingWidth = dimensions.width - canvasPadding * 2;
    
    const getX = (time: number) => {
      return canvasPadding + (time / maxEnd) * drawingWidth;
    };

    return (
      <div ref={containerRef} className="w-full h-full relative p-6 bg-[#141414] overflow-auto min-w-0">
        <div className="flex flex-col gap-3.5 mx-auto max-w-lg select-none font-mono">
          <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase mb-1">Activity Timeline (Sorted by End Time)</span>
          
          {sortedActivities.map((act, index) => {
            const isSelected = actState.selected.includes(act.id);
            const isDiscarded = actState.discarded.includes(act.id);
            const isActive = actState.active === act.id;

            let barBg = 'bg-[#1e1e24] border-[#333333] text-text-secondary';
            if (isActive) {
              barBg = 'bg-accent-purple/20 border-accent-purple text-white shadow-[0_0_8px_rgba(124,58,237,0.4)]';
            } else if (isSelected) {
              barBg = 'bg-success/20 border-success text-success';
            } else if (isDiscarded) {
              barBg = 'bg-error/15 border-error/40 text-error/60';
            }

            const xStart = getX(act.start);
            const xEnd = getX(act.end);
            const width = xEnd - xStart;

            return (
              <div key={act.id} className="flex items-center gap-3 w-full">
                <span className="text-[10px] text-text-secondary font-bold w-12 truncate">{act.id}</span>
                <div className="flex-1 h-8 bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg relative overflow-hidden">
                  {/* Timeline segment */}
                  <div
                    className={`absolute h-6 top-1 rounded-md border text-[9px] font-bold flex items-center justify-center transition-all duration-200 ${barBg}`}
                    style={{ left: `${xStart - canvasPadding}px`, width: `${width}px` }}
                  >
                    {act.start}-{act.end}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Huffman Coding Canvas (SVG Tree + Priority Queue HUD)
  if (selectedAlgorithm === 'huffman') {
    const queue = currentStep?.huffmanTree?.queue || charFreqs.map((cf) => ({ id: cf.char, label: cf.char, freq: cf.freq })).sort((a, b) => a.freq - b.freq);
    const activeIdsSet = new Set(currentStep?.huffmanTree?.activeIds || []);

    return (
      <div ref={containerRef} className="w-full h-full flex flex-col relative bg-[#141414]">
        {/* Tree Canvas */}
        <div className="flex-1 w-full relative overflow-hidden">
          <svg
            width={dimensions.width}
            height={dimensions.height - 60}
            className="w-full h-full block"
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Links */}
            {Object.values(localNodes).map((node) => {
              const links: React.ReactNode[] = [];
              if (node.leftId && localNodes[node.leftId]) {
                const child = localNodes[node.leftId];
                links.push(
                  <line
                    key={`hlink-l-${node.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={child.x}
                    y2={child.y}
                    stroke="#2c2c2c"
                    strokeWidth={1.5}
                  />
                );
              }
              if (node.rightId && localNodes[node.rightId]) {
                const child = localNodes[node.rightId];
                links.push(
                  <line
                    key={`hlink-r-${node.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={child.x}
                    y2={child.y}
                    stroke="#2c2c2c"
                    strokeWidth={1.5}
                  />
                );
              }
              return links;
            })}

            {/* Nodes */}
            {Object.values(localNodes).map((node) => {
              const isActive = activeIdsSet.has(node.id);
              let fillColor = '#1e1e24';
              let strokeColor = '#333333';
              let filter = 'none';

              if (isActive) {
                fillColor = '#7c3aed';
                strokeColor = '#a78bfa';
                filter = 'url(#glow)';
              }

              return (
                <g
                  key={node.id}
                  id={`huffman-node-${node.id}`}
                  transform={`translate(0, 0) scale(${node.scale})`}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={2}
                    filter={filter}
                  />
                  <text
                    x={node.x}
                    y={node.y - 2}
                    dy=".1em"
                    textAnchor="middle"
                    fill="#ffffff"
                    className="font-mono text-[9px] font-bold pointer-events-none"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 7}
                    dy=".1em"
                    textAnchor="middle"
                    fill="#c084fc"
                    className="font-mono text-[8px] pointer-events-none"
                  >
                    {node.freq}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Priority Queue Sorted HUD */}
        <div className="h-[60px] w-full border-t border-[#2a2a2a] bg-[#0f0f0f]/60 backdrop-blur-md p-2 flex items-center gap-2 overflow-x-auto">
          <span className="text-[9px] uppercase font-black text-text-muted font-mono whitespace-nowrap">Priority Queue:</span>
          {queue.map((item, index) => {
            const isActive = activeIdsSet.has(item.id);
            return (
              <div
                key={`${item.id}-${index}`}
                className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center gap-1.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-purple/20 border-accent-purple text-white shadow-[0_0_8px_rgba(124,58,237,0.3)]'
                    : 'bg-[#18181b] border-[#333333] text-text-secondary'
                }`}
              >
                <span className="font-bold text-white">{item.label}</span>
                <span className="text-[10px] text-accent-violet">({item.freq})</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
