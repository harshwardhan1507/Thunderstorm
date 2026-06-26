'use client';

import React, { useState } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { FeatureCards } from '../components/sections/FeatureCards';
import { TestimonialsCarousel } from '../components/sections/TestimonialsCarousel';
import { PricingPlans } from '../components/sections/PricingPlans';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { OnboardingTutorial, OnboardingStep } from '../components/ui/OnboardingTutorial';
import { KeyboardShortcutsGuide } from '../components/ui/KeyboardShortcutsGuide';
import { MessageCircle, BookOpen, Share2, Settings } from 'lucide-react';

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to ThunderStorm',
    description: 'Master algorithms with interactive visualizations. Let\'s get you started on your learning journey!',
    action: { label: 'Next', onClick: () => {} },
  },
  {
    title: 'Choose Your Algorithm',
    description: 'Pick from 50+ algorithms across sorting, graphs, pathfinding, trees, dynamic programming, and greedy strategies.',
    action: { label: 'Explore', onClick: () => {} },
  },
  {
    title: 'Watch & Learn',
    description: 'See every step of the algorithm with real-time animations, code highlighting, and complexity analysis.',
    action: { label: 'Visualize', onClick: () => {} },
  },
  {
    title: 'Practice & Master',
    description: 'Test your understanding with interactive challenges and track your progress.',
    action: { label: 'Start Learning', onClick: () => {} },
  },
];

export default function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const fabActions = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Feedback',
      onClick: () => alert('Feedback modal would open'),
      color: '#3b82f6',
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Tutorials',
      onClick: () => setShowOnboarding(true),
      color: '#8b5cf6',
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: 'Share',
      onClick: () => alert('Share modal would open'),
      color: '#ec4899',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      onClick: () => alert('Settings modal would open'),
      color: '#f59e0b',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Cards */}
      <FeatureCards />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Pricing */}
      <PricingPlans />

      {/* Floating Action Button */}
      <FloatingActionButton
        actions={fabActions}
        position="bottom-right"
      />

      {/* Onboarding Tutorial */}
      <OnboardingTutorial
        steps={onboardingSteps}
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => alert('Onboarding complete!')}
      />

      {/* Keyboard Shortcuts Guide */}
      <KeyboardShortcutsGuide
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Keyboard shortcut handler */}
      <div
        onKeyDown={(e) => {
          if (e.key === '?') {
            setShowShortcuts(!showShortcuts);
          }
        }}
        tabIndex={0}
      />
    </div>
  );
}
