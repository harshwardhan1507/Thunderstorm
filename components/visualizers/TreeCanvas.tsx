import React, { useEffect, useRef, useState } from 'react';
import { useTreeStore } from '../../store/treeStore';
import { pulseNode } from '../../lib/animations/nodeAnimation';
import { layoutTree, layoutHeap } from '../../lib/algorithms/trees/treeAlgorithms';
import { gsap } from 'gsap';

interface LocalTreeNode {
  id: string;
  value: number;
  x: number;
  y: number;
  leftId: string | null;
  rightId: string | null;
  scale: number;
}

export const TreeCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const {
    treeType,
    bstRoot,
    avlRoot,
    heapArray,
    steps,
    currentStepIndex,
    isPlaying,
  } = useTreeStore();

  const [localNodes, setLocalNodes] = useState<Record<string, LocalTreeNode>>({});

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

  // Compute active target tree structure
  let targetStructure: Record<string, any> = {};
  let rootId: string | null = null;

  const currentStep = steps[currentStepIndex] || null;

  if (currentStep) {
    targetStructure = currentStep.treeStructure;
    rootId = currentStep.rootId;
  } else {
    if (treeType === 'bst') {
      targetStructure = layoutTree(bstRoot, dimensions.width);
      rootId = bstRoot ? bstRoot.id : null;
    } else if (treeType === 'avl') {
      targetStructure = layoutTree(avlRoot, dimensions.width);
      rootId = avlRoot ? avlRoot.id : null;
    } else if (treeType === 'heap') {
      targetStructure = layoutHeap(heapArray);
      rootId = heapArray[0]?.id || null;
    }
  }

  // Animate local nodes to target coordinates using GSAP
  useEffect(() => {
    const nodeIds = Object.keys(targetStructure);
    if (nodeIds.length === 0) {
      setLocalNodes({});
      return;
    }

    setLocalNodes((prev) => {
      const next: Record<string, LocalTreeNode> = {};

      // 1. Keep existing nodes or initialize new ones
      nodeIds.forEach((id) => {
        const target = targetStructure[id];
        if (prev[id]) {
          // Keep reference, GSAP will animate values
          next[id] = { ...prev[id] };
        } else {
          // Node is new! Spawn it from its parent's coordinate, or start at center
          // Find parent if possible
          let spawnX = target.x;
          let spawnY = target.y - 40; // start slightly above

          const parent = Object.values(targetStructure).find(
            (p: any) => p.leftId === id || p.rightId === id
          );
          if (parent && prev[parent.id]) {
            spawnX = prev[parent.id].x;
            spawnY = prev[parent.id].y;
          }

          next[id] = {
            id,
            value: target.value,
            x: spawnX,
            y: spawnY,
            leftId: target.leftId,
            rightId: target.rightId,
            scale: 0.1, // animate scale from 0 to 1
          };
        }
      });

      // 2. Animate coordinates and scales to target values
      nodeIds.forEach((id) => {
        const target = targetStructure[id];
        // Animate positions
        gsap.to(next[id], {
          x: target.x,
          y: target.y,
          scale: 1,
          leftId: target.leftId,
          rightId: target.rightId,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: () => {
            // Force React component re-render when GSAP updates properties
            setLocalNodes((curr) => ({ ...curr }));
          },
        });
      });

      return next;
    });
  }, [targetStructure]);

  // Pulse node on step update
  useEffect(() => {
    if (currentStepIndex >= 0 && currentStep && currentStep.activeNodeId) {
      pulseNode(`tree-node-${currentStep.activeNodeId}`);
    }
  }, [currentStepIndex, currentStep]);

  const activeNodeId = currentStep?.activeNodeId || null;
  const comparingNodeIds = new Set(currentStep?.comparingNodeIds || []);
  const rotationFlashIds = new Set(currentStep?.rotationFlashIds || []);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#141414] overflow-hidden">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full block select-none"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="root-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Draw Links/Edges */}
        {Object.values(localNodes).map((node) => {
          const links: React.ReactNode[] = [];
          if (node.leftId && localNodes[node.leftId]) {
            const child = localNodes[node.leftId];
            links.push(
              <line
                key={`link-l-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2={child.x}
                y2={child.y}
                stroke="#2c2c2c"
                strokeWidth={2}
              />
            );
          }
          if (node.rightId && localNodes[node.rightId]) {
            const child = localNodes[node.rightId];
            links.push(
              <line
                key={`link-r-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2={child.x}
                y2={child.y}
                stroke="#2c2c2c"
                strokeWidth={2}
              />
            );
          }
          return links;
        })}

        {/* Draw Tree Nodes */}
        {Object.values(localNodes).map((node) => {
          const isCurrent = node.id === activeNodeId;
          const isComparing = comparingNodeIds.has(node.id);
          const isFlash = rotationFlashIds.has(node.id);
          const isRoot = node.id === rootId;

          let fillColor = '#1e1e24';
          let strokeColor = '#333333';
          let filter = 'none';

          if (isFlash) {
            fillColor = '#22c55e'; // rotation flash gets green
            strokeColor = '#4ade80';
          } else if (isCurrent) {
            fillColor = '#7c3aed'; // current active is violet
            strokeColor = '#a78bfa';
            filter = 'url(#glow)';
          } else if (isComparing) {
            fillColor = '#8b5cf6'; // comparing is lighter violet
            strokeColor = '#a78bfa';
          } else if (isRoot) {
            strokeColor = '#3b82f6'; // root gets blue border glow
            filter = 'url(#root-glow)';
          }

          return (
            <g
              key={node.id}
              id={`tree-node-${node.id}`}
              transform={`translate(0, 0) scale(${node.scale})`}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={18}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isCurrent || isRoot ? 3 : 2}
                filter={filter}
                className="transition-colors duration-150"
              />
              <text
                x={node.x}
                y={node.y}
                dy=".3em"
                textAnchor="middle"
                fill="#ffffff"
                className="font-mono text-xs font-bold pointer-events-none select-none"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
