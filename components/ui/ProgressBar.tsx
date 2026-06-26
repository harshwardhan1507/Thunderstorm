'use client';

import React from 'react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color,
  size = 'md',
  animated = true,
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const progressColor = color || colors.accent;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${sizeClasses}`}
        style={{ backgroundColor: colors.bg.tertiary }}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${animated ? 'ease-out' : ''}`}
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step Circle */}
          <button
            onClick={() => onStepClick?.(index)}
            className="flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300"
            style={{
              backgroundColor:
                index < currentStep
                  ? colors.accent
                  : index === currentStep
                    ? colors.accentLight
                    : colors.bg.tertiary,
              color:
                index <= currentStep
                  ? index === currentStep
                    ? colors.text.primary
                    : '#ffffff'
                  : colors.text.secondary,
              borderColor: index <= currentStep ? colors.accent : colors.border.primary,
              borderWidth: '2px',
              cursor: onStepClick ? 'pointer' : 'default',
            }}
          >
            {index < currentStep ? '✓' : index + 1}
          </button>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className="flex-1 h-1 mx-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index < currentStep ? colors.accent : colors.border.primary,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
