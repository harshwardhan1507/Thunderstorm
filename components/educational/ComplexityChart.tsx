import React from 'react';

interface ComplexityChartProps {
  activeComplexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n^2)';
}

export const ComplexityChart: React.FC<ComplexityChartProps> = ({ activeComplexity }) => {
  const width = 300;
  const height = 180;
  const padding = 20;

  // Generate data points for n from 1 to 10
  const nPoints = Array.from({ length: 10 }, (_, i) => i + 1);

  // Scaling helpers
  // Max value of n^2 is 100
  const getX = (n: number) => padding + ((n - 1) / 9) * (width - padding * 2);
  const getY = (val: number) => height - padding - (val / 100) * (height - padding * 2);

  // Complexities formulas
  const o1 = nPoints.map((n) => ({ x: getX(n), y: getY(5) })); // flat line at 5
  const oLogN = nPoints.map((n) => ({ x: getX(n), y: getY(Math.log2(n) * 10) }));
  const oN = nPoints.map((n) => ({ x: getX(n), y: getY(n * 8) }));
  const oNLogN = nPoints.map((n) => ({ x: getX(n), y: getY(n * Math.log2(n) * 3) }));
  const oN2 = nPoints.map((n) => ({ x: getX(n), y: getY(n * n) }));

  const curves = [
    { label: 'O(1)', points: o1, color: '#3B82F6', key: 'O(1)' }, // Electric Blue
    { label: 'O(log n)', points: oLogN, color: '#22C55E', key: 'O(log n)' }, // Emerald
    { label: 'O(n)', points: oN, color: '#F59E0B', key: 'O(n)' }, // Amber
    { label: 'O(n log n)', points: oNLogN, color: '#7c3aed', key: 'O(n log n)' }, // Storm Violet
    { label: 'O(n^2)', points: oN2, color: '#EF4444', key: 'O(n^2)' }, // Red
  ];

  // Helper to build SVG path from points
  const getPathD = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  };

  return (
    <div className="p-4 rounded-xl bg-surface-card border border-border-subtle shadow-md select-none font-mono flex flex-col items-center">
      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2 self-start">
        Complexity Growth Chart
      </span>

      <div className="w-full relative h-[180px]">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <text x={width - padding} y={height - 4} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="end">Operations (n)</text>
          <text x={padding - 4} y={padding + 4} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="start" transform="rotate(-90 10 20)">Cost</text>

          {/* Curves */}
          {curves.map((curve) => {
            const isActive = curve.key === activeComplexity;
            return (
              <g key={curve.label}>
                {/* Glow behind active curve */}
                {isActive && (
                  <path
                    d={getPathD(curve.points)}
                    fill="none"
                    stroke={curve.color}
                    strokeWidth={4}
                    opacity={0.4}
                    className="transition-all duration-300"
                  />
                )}
                <path
                  d={getPathD(curve.points)}
                  fill="none"
                  stroke={curve.color}
                  strokeWidth={isActive ? 2.5 : 1}
                  opacity={isActive ? 1 : 0.3}
                  className="transition-all duration-300"
                />
                {/* Curve Label on the last point */}
                {curve.points.length > 0 && (
                  <text
                    x={curve.points[curve.points.length - 1].x + 4}
                    y={curve.points[curve.points.length - 1].y + 3}
                    fill={curve.color}
                    fontSize={7}
                    fontWeight={isActive ? 'bold' : 'normal'}
                    opacity={isActive ? 1 : 0.4}
                  >
                    {curve.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 text-[9px] text-text-secondary text-center leading-relaxed">
        Active Complexity: <span className="text-white font-bold">{activeComplexity}</span>
      </div>
    </div>
  );
};
