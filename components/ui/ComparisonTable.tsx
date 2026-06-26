'use client';

import React from 'react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

export interface ComparisonItem {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestCase: string;
  worstCase: string;
  stable: boolean;
}

interface ComparisonTableProps {
  items: ComparisonItem[];
  title?: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  items,
  title = 'Algorithm Comparison',
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div className="w-full overflow-x-auto rounded-lg border" style={{ borderColor: colors.border.primary }}>
      {title && (
        <div
          className="px-6 py-4 border-b font-semibold"
          style={{
            backgroundColor: colors.bg.tertiary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          {title}
        </div>
      )}

      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border.primary }}>
            {['Algorithm', 'Time Complexity', 'Space Complexity', 'Best Case', 'Worst Case', 'Stable'].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-sm font-semibold border-b"
                  style={{
                    color: colors.text.primary,
                    borderColor: colors.border.primary,
                  }}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-b transition-colors duration-200 hover:opacity-80"
              style={{
                backgroundColor: index % 2 === 0 ? colors.bg.primary : colors.bg.tertiary,
                borderColor: colors.border.primary,
              }}
            >
              <td className="px-6 py-4 font-medium" style={{ color: colors.text.primary }}>
                {item.name}
              </td>
              <td className="px-6 py-4" style={{ color: colors.text.secondary }}>
                <code
                  className="px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    color: colors.accent,
                  }}
                >
                  {item.timeComplexity}
                </code>
              </td>
              <td className="px-6 py-4" style={{ color: colors.text.secondary }}>
                <code
                  className="px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    color: colors.accent,
                  }}
                >
                  {item.spaceComplexity}
                </code>
              </td>
              <td className="px-6 py-4" style={{ color: colors.text.secondary }}>
                {item.bestCase}
              </td>
              <td className="px-6 py-4" style={{ color: colors.text.secondary }}>
                {item.worstCase}
              </td>
              <td className="px-6 py-4">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: item.stable ? '#22c55e20' : '#ef444420',
                    color: item.stable ? '#22c55e' : '#ef4444',
                  }}
                >
                  {item.stable ? 'Yes' : 'No'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
