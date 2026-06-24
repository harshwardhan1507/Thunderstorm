import React, { useEffect, useRef, useState } from 'react';
import { useDPStore } from '../../store/dpStore';

interface ArrowLine {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  id: string;
}

export const DPTable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  
  const {
    selectedAlgorithm,
    strA,
    strB,
    knapsackItems,
    knapsackCapacity,
    fibN,
    steps,
    currentStepIndex,
  } = useDPStore();

  const [arrows, setArrows] = useState<ArrowLine[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Recalculate coordinates for SVG arrows
  const calculateArrows = () => {
    if (!containerRef.current || !tableRef.current) return;
    
    const currentStep = steps[currentStepIndex];
    if (!currentStep || !currentStep.activeCell || currentStep.dependentCells.length === 0) {
      setArrows([]);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const [ar, ac] = currentStep.activeCell;
    const activeCellId = `dp-cell-${ar}-${ac}`;
    const activeElem = document.getElementById(activeCellId);
    if (!activeElem) return;

    const activeRect = activeElem.getBoundingClientRect();
    const toX = activeRect.left + activeRect.width / 2 - containerRect.left;
    const toY = activeRect.top + activeRect.height / 2 - containerRect.top;

    const newArrows: ArrowLine[] = [];
    currentStep.dependentCells.forEach(([dr, dc]) => {
      const depCellId = `dp-cell-${dr}-${dc}`;
      const depElem = document.getElementById(depCellId);
      if (depElem) {
        const depRect = depElem.getBoundingClientRect();
        const fromX = depRect.left + depRect.width / 2 - containerRect.left;
        const fromY = depRect.top + depRect.height / 2 - containerRect.top;
        newArrows.push({
          fromX,
          fromY,
          toX,
          toY,
          id: `arrow-${dr}-${dc}-to-${ar}-${ac}`,
        });
      }
    });

    setArrows(newArrows);
  };

  // Listen to step changes, resize, or algorithm change to update arrows
  useEffect(() => {
    calculateArrows();
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
      calculateArrows();
    };

    window.addEventListener('resize', handleResize);
    // Initial dimensions
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }

    // Delay slightly to allow DOM layout to complete before calculating rects
    const timer = setTimeout(calculateArrows, 50);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [currentStepIndex, selectedAlgorithm, steps]);

  const currentStep = steps[currentStepIndex] || null;
  const activeCell = currentStep?.activeCell || null;
  const dependentSet = new Set(currentStep?.dependentCells.map(([r, c]) => `${r},${c}`) || []);
  const tableData = currentStep ? currentStep.table : [];

  // Helper to determine cell coloring
  const getCellClassName = (r: number, c: number) => {
    const isAct = activeCell && activeCell[0] === r && activeCell[1] === c;
    const isDep = dependentSet.has(`${r},${c}`);
    
    if (isAct) {
      return 'bg-accent-purple/30 border-accent-purple text-white shadow-[0_0_8px_rgba(124,58,237,0.4)] font-extrabold';
    }
    if (isDep) {
      return 'bg-blue-950/40 border-blue-500 text-blue-400 font-semibold';
    }
    if (tableData[r]?.[c] !== null) {
      return 'bg-surface border-border-subtle text-text-primary';
    }
    return 'bg-[#0f0f0f]/40 border-border-subtle/30 text-text-muted';
  };

  // Render LCS grid
  if (selectedAlgorithm === 'lcs') {
    const rowsList = ['', ...strA.split('')];
    const colsList = ['', ...strB.split('')];

    return (
      <div ref={containerRef} className="w-full h-full relative overflow-auto p-6 bg-[#141414] min-w-0">
        {/* SVG Arrow Overlay */}
        <svg
          className="absolute inset-0 pointer-events-none z-10"
          width="100%"
          height="100%"
        >
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
            </marker>
          </defs>
          {arrows.map((arrow) => (
            <g key={arrow.id}>
              {/* Back glow shadow line */}
              <line
                x1={arrow.fromX}
                y1={arrow.fromY}
                x2={arrow.toX}
                y2={arrow.toY}
                stroke="#c084fc"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.3}
              />
              <line
                x1={arrow.fromX}
                y1={arrow.fromY}
                x2={arrow.toX}
                y2={arrow.toY}
                stroke="#a78bfa"
                strokeWidth={2}
                strokeLinecap="round"
                markerEnd="url(#arrow)"
              />
            </g>
          ))}
        </svg>

        {/* DP Table */}
        <table ref={tableRef} className="border-collapse mx-auto select-none font-mono">
          <thead>
            <tr>
              <th className="p-2 border border-[#2a2a2a] text-xs text-text-muted"></th>
              {colsList.map((char, colIdx) => (
                <th key={`col-${colIdx}`} className="p-2.5 border border-[#2a2a2a] text-center text-xs font-bold text-text-secondary min-w-[45px]">
                  {char || '-'}
                  <div className="text-[8px] text-text-muted mt-0.5">{colIdx}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowsList.map((char, rowIdx) => (
              <tr key={`row-${rowIdx}`}>
                <td className="p-2.5 border border-[#2a2a2a] text-right text-xs font-bold text-text-secondary min-w-[35px]">
                  {char || '-'}
                  <span className="text-[8px] text-text-muted block mt-0.5">{rowIdx}</span>
                </td>
                {colsList.map((_, colIdx) => {
                  const val = tableData[rowIdx]?.[colIdx];
                  return (
                    <td
                      key={`cell-${rowIdx}-${colIdx}`}
                      id={`dp-cell-${rowIdx}-${colIdx}`}
                      className={`p-2.5 border text-center text-xs min-w-[45px] transition-all duration-150 ${getCellClassName(
                        rowIdx,
                        colIdx
                      )}`}
                    >
                      {val === null || val === undefined ? '' : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Transition Formula Overlay */}
        {currentStep && (
          <div className="mt-6 text-center text-xs text-text-secondary bg-[#0f0f0f]/80 border border-[#2a2a2a] rounded-lg p-2.5 max-w-lg mx-auto font-mono">
            <span className="text-white font-bold block mb-1">State Transition:</span>
            {currentStep.formula}
          </div>
        )}
      </div>
    );
  }

  // Render Knapsack grid
  if (selectedAlgorithm === 'knapsack') {
    const colsList = Array(knapsackCapacity + 1).fill(0); // weights 0 to capacity

    return (
      <div ref={containerRef} className="w-full h-full relative overflow-auto p-6 bg-[#141414] min-w-0">
        <svg
          className="absolute inset-0 pointer-events-none z-10"
          width="100%"
          height="100%"
        >
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
            </marker>
          </defs>
          {arrows.map((arrow) => (
            <g key={arrow.id}>
              <line
                x1={arrow.fromX}
                y1={arrow.fromY}
                x2={arrow.toX}
                y2={arrow.toY}
                stroke="#c084fc"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.3}
              />
              <line
                x1={arrow.fromX}
                y1={arrow.fromY}
                x2={arrow.toX}
                y2={arrow.toY}
                stroke="#a78bfa"
                strokeWidth={2}
                strokeLinecap="round"
                markerEnd="url(#arrow)"
              />
            </g>
          ))}
        </svg>

        <table ref={tableRef} className="border-collapse mx-auto select-none font-mono">
          <thead>
            <tr>
              <th className="p-2 border border-[#2a2a2a] text-xs text-text-muted">Item</th>
              {colsList.map((_, colIdx) => (
                <th key={`w-${colIdx}`} className="p-2.5 border border-[#2a2a2a] text-center text-xs font-bold text-text-secondary min-w-[45px]">
                  w={colIdx}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row 0: Empty item base case */}
            <tr key="row-0">
              <td className="p-2.5 border border-[#2a2a2a] text-xs font-bold text-text-secondary">
                -
                <span className="text-[8px] text-text-muted block mt-0.5">i=0</span>
              </td>
              {colsList.map((_, colIdx) => {
                const val = tableData[0]?.[colIdx];
                return (
                  <td
                    key={`cell-0-${colIdx}`}
                    id={`dp-cell-0-${colIdx}`}
                    className={`p-2.5 border text-center text-xs min-w-[45px] transition-all duration-150 ${getCellClassName(
                      0,
                      colIdx
                    )}`}
                  >
                    {val === null || val === undefined ? '' : val}
                  </td>
                );
              })}
            </tr>
            {/* Rows for items */}
            {knapsackItems.map((item, rowIdx) => {
              const actualRow = rowIdx + 1;
              return (
                <tr key={`row-${actualRow}`}>
                  <td className="p-2.5 border border-[#2a2a2a] text-xs font-bold text-text-secondary whitespace-nowrap min-w-[90px]">
                    v:{item.value}, w:{item.weight}
                    <span className="text-[8px] text-text-muted block mt-0.5">i={actualRow}</span>
                  </td>
                  {colsList.map((_, colIdx) => {
                    const val = tableData[actualRow]?.[colIdx];
                    return (
                      <td
                        key={`cell-${actualRow}-${colIdx}`}
                        id={`dp-cell-${actualRow}-${colIdx}`}
                        className={`p-2.5 border text-center text-xs min-w-[45px] transition-all duration-150 ${getCellClassName(
                          actualRow,
                          colIdx
                        )}`}
                      >
                        {val === null || val === undefined ? '' : val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {currentStep && (
          <div className="mt-6 text-center text-xs text-text-secondary bg-[#0f0f0f]/80 border border-[#2a2a2a] rounded-lg p-2.5 max-w-lg mx-auto font-mono">
            <span className="text-white font-bold block mb-1">State Transition:</span>
            {currentStep.formula}
          </div>
        )}
      </div>
    );
  }

  // Render Fibonacci grid (1D array)
  if (selectedAlgorithm === 'fibonacci') {
    const colsList = Array(fibN + 1).fill(0);

    return (
      <div ref={containerRef} className="w-full h-full relative overflow-auto p-6 bg-[#141414] min-w-0">
        <svg
          className="absolute inset-0 pointer-events-none z-10"
          width="100%"
          height="100%"
        >
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
            </marker>
          </defs>
          {arrows.map((arrow) => (
            <g key={arrow.id}>
              <path
                d={`M ${arrow.fromX} ${arrow.fromY} Q ${(arrow.fromX + arrow.toX) / 2} ${arrow.fromY - 30} ${arrow.toX} ${arrow.toY}`}
                fill="none"
                stroke="#c084fc"
                strokeWidth={4}
                opacity={0.3}
              />
              <path
                d={`M ${arrow.fromX} ${arrow.fromY} Q ${(arrow.fromX + arrow.toX) / 2} ${arrow.fromY - 30} ${arrow.toX} ${arrow.toY}`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth={1.5}
                markerEnd="url(#arrow)"
              />
            </g>
          ))}
        </svg>

        <table ref={tableRef} className="border-collapse mx-auto select-none font-mono">
          <thead>
            <tr>
              {colsList.map((_, colIdx) => (
                <th key={`fib-${colIdx}`} className="p-2.5 border border-[#2a2a2a] text-center text-xs font-bold text-text-secondary min-w-[50px]">
                  F[{colIdx}]
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {colsList.map((_, colIdx) => {
                const val = tableData[0]?.[colIdx];
                return (
                  <td
                    key={`cell-0-${colIdx}`}
                    id={`dp-cell-0-${colIdx}`}
                    className={`p-3 border text-center text-sm min-w-[50px] transition-all duration-150 ${getCellClassName(
                      0,
                      colIdx
                    )}`}
                  >
                    {val === null || val === undefined ? '' : val}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>

        {currentStep && (
          <div className="mt-6 text-center text-xs text-text-secondary bg-[#0f0f0f]/80 border border-[#2a2a2a] rounded-lg p-2.5 max-w-lg mx-auto font-mono">
            <span className="text-white font-bold block mb-1">State Transition:</span>
            {currentStep.formula}
          </div>
        )}
      </div>
    );
  }

  return null;
};
