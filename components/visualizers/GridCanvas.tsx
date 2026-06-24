import React, { useEffect, useRef, useState } from 'react';
import { usePathfindingStore } from '../../store/pathfindingStore';
import { animateWavePropagation, animatePathReconstruction, animateGoalReached } from '../../lib/animations/nodeAnimation';

export const GridCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const {
    rows,
    cols,
    startNode,
    endNode,
    walls,
    steps,
    currentStepIndex,
    isPlaying,
    setStartNode,
    setEndNode,
    addWall,
    removeWall,
  } = usePathfindingStore();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragAction, setDragAction] = useState<'dragStart' | 'dragEnd' | 'drawWall' | 'eraseWall' | null>(null);

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 200),
          height: Math.max(height, 200),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Map mouse coordinates to cell row/col
  const getCellFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellWidth = dimensions.width / cols;
    const cellHeight = dimensions.height / rows;

    const r = Math.floor(y / cellHeight);
    const c = Math.floor(x / cellWidth);

    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      return { r, c, key: `${r},${c}` };
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlaying) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;

    setIsMouseDown(true);
    if (cell.key === startNode) {
      setDragAction('dragStart');
    } else if (cell.key === endNode) {
      setDragAction('dragEnd');
    } else if (walls.has(cell.key)) {
      setDragAction('eraseWall');
      removeWall(cell.key);
    } else {
      setDragAction('drawWall');
      addWall(cell.key);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown || isPlaying) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;

    if (dragAction === 'dragStart') {
      if (cell.key !== endNode) {
        setStartNode(cell.key);
      }
    } else if (dragAction === 'dragEnd') {
      if (cell.key !== startNode) {
        setEndNode(cell.key);
      }
    } else if (dragAction === 'drawWall') {
      if (cell.key !== startNode && cell.key !== endNode) {
        addWall(cell.key);
      }
    } else if (dragAction === 'eraseWall') {
      removeWall(cell.key);
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    setDragAction(null);
  };

  // Draw Grid Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const cellWidth = dimensions.width / cols;
    const cellHeight = dimensions.height / rows;

    // Clear Canvas
    ctx.fillStyle = '#0A0A0A'; // Dark base
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Setup visualization step info
    const currentStep = steps[currentStepIndex];
    const visitedList = currentStep ? currentStep.visited : [];
    const visitedSet = new Set(visitedList);
    const pathList = currentStep ? currentStep.path : [];
    const pathSet = new Set(pathList);
    const currentChecking = currentStep ? currentStep.current : null;

    // Draw Grid Cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        const x = c * cellWidth;
        const y = r * cellHeight;

        let fillStyle = '#111111'; // default cell bg
        let isPathCell = pathSet.has(key);

        if (walls.has(key)) {
          fillStyle = '#1B1B1B'; // Wall elevated dark block
        } else if (key === startNode || key === endNode) {
          fillStyle = '#111111'; // Draw nodes later
        } else if (key === currentChecking) {
          fillStyle = '#3B82F6'; // Electric Blue frontier
        } else if (visitedSet.has(key)) {
          // Violet gradient based on when it was visited
          const visitIndex = visitedList.indexOf(key);
          const ratio = visitedList.length > 1 ? visitIndex / visitedList.length : 0.5;
          // Gradient between violet and storm pink
          fillStyle = `hsla(${260 + ratio * 40}, 70%, 40%, 0.9)`;
        }

        ctx.fillStyle = fillStyle;
        ctx.fillRect(x + 0.5, y + 0.5, cellWidth - 1, cellHeight - 1);

        // Subtly draw grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }

    // Draw Path Trail (Emerald energy trail)
    if (pathList.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#22C55E'; // Emerald trail
      ctx.lineWidth = Math.min(cellWidth, cellHeight) * 0.35;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Glow effect
      ctx.shadowColor = '#4ADE80';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      pathList.forEach((key, index) => {
        const [r, c] = key.split(',').map(Number);
        const centerX = c * cellWidth + cellWidth / 2;
        const centerY = r * cellHeight + cellHeight / 2;
        if (index === 0) {
          ctx.moveTo(centerX, centerY);
        } else {
          ctx.lineTo(centerX, centerY);
        }
      });
      ctx.stroke();
      ctx.restore();
    }

    // Draw Start and End nodes (draw on top)
    const drawSpecialNode = (key: string, isStart: boolean) => {
      const [r, c] = key.split(',').map(Number);
      const x = c * cellWidth + cellWidth / 2;
      const y = r * cellHeight + cellHeight / 2;
      const radius = Math.min(cellWidth, cellHeight) * 0.35;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      if (isStart) {
        ctx.fillStyle = '#3B82F6'; // Blue Core Glow
        ctx.shadowColor = '#3B82F6';
        ctx.shadowBlur = 15;
        ctx.fill();

        // Draw an inner arrow or symbol
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x - radius/2, y - radius/2);
        ctx.lineTo(x + radius/2, y);
        ctx.lineTo(x - radius/2, y + radius/2);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#EF4444'; // Pulsing Red Beacon
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 15;
        ctx.fill();

        // Draw inner concentric target circle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.5, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    };

    drawSpecialNode(startNode, true);
    drawSpecialNode(endNode, false);

  }, [rows, cols, startNode, endNode, walls, steps, currentStepIndex, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-transparent overflow-hidden">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: isPlaying ? 'not-allowed' : 'crosshair',
        }}
      />
    </div>
  );
};
