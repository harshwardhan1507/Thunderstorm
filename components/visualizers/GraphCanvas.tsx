import React, { useEffect, useRef, useState } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { pulseNode, animateEdgeRipple, NodeState } from '../../lib/animations/nodeAnimation';
import { Trash2, Plus, RefreshCw, Star, Share2 } from 'lucide-react';

export const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const {
    nodes,
    edges,
    steps,
    currentStepIndex,
    isPlaying,
    startNodeId,
    setStartNodeId,
    addNode,
    updateNodePosition,
    addEdge,
    deleteNode,
    deleteEdge,
    loadPreset,
  } = useGraphStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 250),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Pulse nodes on step updates
  useEffect(() => {
    if (currentStepIndex >= 0 && steps[currentStepIndex]) {
      const step = steps[currentStepIndex];
      // Pulse current node with state-based animation
      if (step.currentNodeId) {
        pulseNode(`graph-node-${step.currentNodeId}`, 'active');
      }
      // Ripple active edges
      if (step.edgeTrail.length > 0) {
        const latestEdge = step.edgeTrail[step.edgeTrail.length - 1];
        const [u, v] = latestEdge;
        animateEdgeRipple(`graph-edge-${u}-${v}`);
        animateEdgeRipple(`graph-edge-${v}-${u}`);
      }
    }
  }, [currentStepIndex, steps]);

  const getSvgCoordinates = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isPlaying) return;
    // If clicked directly on the canvas background, add a node or deselect
    if (e.target === svgRef.current) {
      if (selectedNodeId) {
        setSelectedNodeId(null);
      } else {
        const { x, y } = getSvgCoordinates(e);
        addNode(x, y);
      }
    }
  };

  const handleNodeMouseDown = (id: string, e: React.MouseEvent) => {
    if (isPlaying) return;
    e.stopPropagation();
    setDraggedNodeId(id);
  };

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    if (isPlaying) return;
    e.stopPropagation();

    if (!selectedNodeId) {
      setSelectedNodeId(id);
    } else if (selectedNodeId === id) {
      setSelectedNodeId(null);
    } else {
      // Draw edge from selectedNodeId to clicked node
      addEdge(selectedNodeId, id);
      setSelectedNodeId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getSvgCoordinates(e);
    setMousePos(coords);

    if (draggedNodeId && !isPlaying) {
      updateNodePosition(draggedNodeId, coords.x, coords.y);
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleDeleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const currentStep = steps[currentStepIndex] || null;
  const visitedSet = new Set(currentStep?.visitedNodes || []);
  const currentNodeId = currentStep?.currentNodeId || null;
  
  // Convert edgeTrail to lookup set
  const activeEdgesSet = new Set<string>();
  if (currentStep) {
    currentStep.edgeTrail.forEach(([u, v]) => {
      activeEdgesSet.add(`${u}-${v}`);
      activeEdgesSet.add(`${v}-${u}`);
    });
  }

  const selectedNodeObj = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="w-full h-full flex flex-col relative bg-[#141414]">
      {/* HUD Bar */}
      <div className="flex items-center justify-between p-3 border-b border-[#2a2a2a] bg-[#141414]-card/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-[#555555]">Preset Graphs:</span>
          <button
            onClick={() => loadPreset('default')}
            disabled={isPlaying}
            className="px-2 py-1 rounded bg-[#141414]-elevated hover:bg-[#1c1c1c] border border-[#2a2a2a] text-[10px] text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Default
          </button>
          <button
            onClick={() => loadPreset('tree')}
            disabled={isPlaying}
            className="px-2 py-1 rounded bg-[#141414]-elevated hover:bg-[#1c1c1c] border border-[#2a2a2a] text-[10px] text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Tree
          </button>
          <button
            onClick={() => loadPreset('cycle')}
            disabled={isPlaying}
            className="px-2 py-1 rounded bg-[#141414]-elevated hover:bg-[#1c1c1c] border border-[#2a2a2a] text-[10px] text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cycle
          </button>
          <button
            onClick={() => loadPreset('star')}
            disabled={isPlaying}
            className="px-2 py-1 rounded bg-[#141414]-elevated hover:bg-[#1c1c1c] border border-[#2a2a2a] text-[10px] text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Star
          </button>
          <button
            onClick={() => loadPreset('grid')}
            disabled={isPlaying}
            className="px-2 py-1 rounded bg-[#141414]-elevated hover:bg-[#1c1c1c] border border-[#2a2a2a] text-[10px] text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Grid
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-[#555555]">Start Node:</span>
          <select
            value={startNodeId}
            onChange={(e) => setStartNodeId(e.target.value)}
            disabled={isPlaying}
            className="bg-[#141414]-elevated border border-[#2a2a2a] text-[10px] rounded text-white p-0.5 focus:border-[rgba(255,255,255,0.18)] outline-none transition-colors"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 w-full relative overflow-hidden outline-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleCanvasClick}
          className="w-full h-full block cursor-crosshair select-none touch-none"
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="root-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render regular edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isVisited = activeEdgesSet.has(`${edge.from}-${edge.to}`);

            return (
              <line
                key={`edge-${edge.from}-${edge.to}`}
                id={`graph-edge-${edge.from}-${edge.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isVisited ? '#7c3aed' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isVisited ? 3 : 1.5}
                strokeDasharray={isVisited ? 'none' : 'none'}
                className="transition-all duration-200"
              />
            );
          })}

          {/* Dashed line to cursor if creating edge */}
          {selectedNodeObj && (
            <line
              x1={selectedNodeObj.x}
              y1={selectedNodeObj.y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#a78bfa"
              strokeWidth={1.5}
              strokeDasharray="4,4"
              pointerEvents="none"
            />
          )}

          {/* Render vertices/nodes */}
          {nodes.map((node) => {
            const isCurrent = node.id === currentNodeId;
            const isVisited = visitedSet.has(node.id);
            const isSelected = node.id === selectedNodeId;
            const isStart = node.id === startNodeId;

            let fillColor = '#171717'; // Neutral Storm Surface
            let strokeColor = 'rgba(255,255,255,0.08)'; // Subtle border
            let filter = 'none';

            if (isCurrent) {
              fillColor = '#3B82F6'; // Electric Blue Glow
              strokeColor = '#60A5FA';
              filter = 'url(#glow)';
            } else if (isVisited) {
              fillColor = '#7c3aed'; // Storm Violet Ripple
              strokeColor = '#a78bfa';
            }

            if (isSelected) {
              strokeColor = '#F59E0B'; // Amber for selection
            } else if (isStart) {
              strokeColor = '#3B82F6'; // Blue for start node
            }

            return (
              <g
                key={node.id}
                id={`graph-node-${node.id}`}
                transform={`translate(0, 0)`}
                className="cursor-pointer"
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                onClick={(e) => handleNodeClick(node.id, e)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3 : 2}
                  filter={filter}
                  className="transition-colors duration-200"
                />
                <text
                  x={node.x}
                  y={node.y}
                  dy=".3em"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="font-mono text-xs font-bold pointer-events-none select-none"
                >
                  {node.label}
                </text>
                {/* Delete node overlay button when hovered/selected */}
                {!isPlaying && (
                  <circle
                    cx={node.x + 15}
                    cy={node.y - 15}
                    r={8}
                    fill="#ef4444"
                    className="opacity-0 hover:opacity-100 transition-opacity duration-150"
                    onClick={(e) => handleDeleteNode(node.id, e)}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Editing Instructions Overlay */}
      {!isPlaying && (
        <div className="absolute bottom-3 left-3 bg-[#141414]-card/90 backdrop-blur-md border border-[#2a2a2a] rounded-lg p-2.5 text-[10px] text-[#888888] select-none pointer-events-none font-mono max-w-[280px] shadow-lg">
          <p className="text-white font-bold mb-1">Interactive Controls:</p>
          <ul className="list-disc pl-3.5 space-y-0.5">
            <li>Click empty space to add a new Node.</li>
            <li>Drag nodes to position them on canvas.</li>
            <li>Click node A, then node B to link with an edge.</li>
            <li>Hover node and click red badge to delete.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
