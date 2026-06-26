'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '20+ Algorithms',
      'Basic Visualizations',
      'Community Support',
      'Limited Exports',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'For serious learners',
    features: [
      'All Free Features',
      '50+ Algorithms',
      'Advanced Visualizations',
      'Priority Support',
      'Unlimited Exports',
      'Custom Themes',
      'Performance Analytics',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For teams and organizations',
    features: [
      'All Pro Features',
      'Unlimited Algorithms',
      'Custom Integrations',
      'Dedicated Support',
      'Team Collaboration',
      'Advanced Analytics',
      'SLA Guarantee',
    ],
    cta: 'Contact Sales',
  },
];

export const PricingPlans: React.FC = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Simple, Transparent Pricing
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.text.secondary }}
          >
            Choose the plan that fits your learning journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                plan.highlighted ? 'md:scale-105' : ''
              }`}
              style={{
                backgroundColor: colors.bg.primary,
                borderColor: plan.highlighted ? colors.accent : colors.border.primary,
                borderWidth: plan.highlighted ? '2px' : '1px',
              }}
            >
              {/* Highlight Badge */}
              {plan.highlighted && (
                <div
                  className="absolute top-0 left-0 right-0 py-2 text-center text-sm font-semibold text-white"
                  style={{ backgroundColor: colors.accent }}
                >
                  Most Popular
                </div>
              )}

              {/* Content */}
              <div className={`p-8 ${plan.highlighted ? 'pt-16' : ''}`}>
                {/* Plan Name */}
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {plan.name}
                </h3>

                {/* Description */}
                <p
                  className="text-sm mb-6"
                  style={{ color: colors.text.secondary }}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm ml-2"
                    style={{ color: colors.text.secondary }}
                  >
                    {plan.period}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all duration-300 ${
                    plan.highlighted
                      ? 'text-white hover:shadow-lg hover:scale-105'
                      : 'border hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: plan.highlighted ? colors.accent : 'transparent',
                    color: plan.highlighted ? 'white' : colors.accent,
                    borderColor: plan.highlighted ? 'transparent' : colors.border.primary,
                    borderWidth: plan.highlighted ? '0' : '1px',
                  }}
                >
                  {plan.cta}
                </button>

                {/* Features List */}
                <div className="space-y-3 border-t pt-8" style={{ borderColor: colors.border.primary }}>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: colors.accent }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <p
            className="text-lg mb-4"
            style={{ color: colors.text.secondary }}
          >
            Have questions? <span style={{ color: colors.accent }} className="font-semibold cursor-pointer hover:opacity-80">Contact our sales team</span>
          </p>
        </div>
      </div>
    </section>
  );
};
