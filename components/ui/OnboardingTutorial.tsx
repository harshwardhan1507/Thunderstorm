'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

export interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingTutorialProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
}) => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Tutorial Card */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl border animate-fade-in-up"
        style={{
          backgroundColor: colors.bg.primary,
          borderColor: colors.border.primary,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:opacity-70 transition-opacity"
          style={{ color: colors.text.secondary }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Image */}
          {step.image && (
            <div className="mb-6 h-40 rounded-lg overflow-hidden" style={{ backgroundColor: colors.bg.tertiary }}>
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: colors.text.primary }}
          >
            {step.title}
          </h2>

          {/* Description */}
          <p
            className="mb-6 leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            {step.description}
          </p>

          {/* Action Button */}
          {step.action && (
            <button
              onClick={step.action.onClick}
              className="w-full py-2 rounded-lg font-semibold mb-6 text-white transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              {step.action.label}
            </button>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      index <= currentStep ? colors.accent : colors.border.primary,
                  }}
                />
              ))}
            </div>
            <p
              className="text-xs mt-2 text-center"
              style={{ color: colors.text.tertiary }}
            >
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1 py-2 rounded-lg border font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.secondary,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.accent }}
            >
              {isLastStep ? 'Complete' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
