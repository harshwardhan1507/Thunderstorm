'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTheme } from '../../lib/context/ThemeContext';
import { themeColors } from '../../lib/theme/colors';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Ashish Dubey',
    role: 'SDE Intern',
    company: 'Microsoft',
    image: 'AD',
    text: 'ThunderStorm helped me visualize complex algorithms and ace my interviews. The step-by-step execution is incredibly helpful!',
    rating: 5,
  },
  {
    name: 'Rohan Kumar Sah',
    role: 'Software Engineer',
    company: 'Bosch',
    image: 'RK',
    text: 'The best algorithm visualizer I\'ve used. Clear, intuitive, and actually helps you understand what\'s happening under the hood.',
    rating: 5,
  },
  {
    name: 'Avi Juneja',
    role: 'SDE',
    company: 'Top MNC',
    image: 'AJ',
    text: 'From struggling with DSA to landing a 10+ LPA offer. ThunderStorm was a game-changer for my preparation.',
    rating: 5,
  },
  {
    name: 'Anuj Thakur',
    role: 'Data Analyst',
    company: 'Scaler',
    image: 'AT',
    text: 'The visualizations make it so much easier to understand how algorithms work. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Abhishek Khanna',
    role: 'Engineer',
    company: 'Samsung Research',
    image: 'AK',
    text: 'Outstanding tool for learning. The real-time feedback and multiple algorithm support is fantastic.',
    rating: 5,
  },
];

export const TestimonialsCarousel: React.FC = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Loved by Learners
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.text.secondary }}
          >
            Join thousands of students who've mastered algorithms with ThunderStorm
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative p-8 rounded-2xl border transition-all duration-300"
          style={{
            backgroundColor: colors.bg.primary,
            borderColor: colors.border.primary,
          }}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {/* Testimonial Content */}
          <div className="min-h-64 flex flex-col justify-between">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400"
                  style={{ color: '#fbbf24' }}
                />
              ))}
            </div>

            {/* Quote */}
            <p
              className="text-xl font-medium mb-6 leading-relaxed"
              style={{ color: colors.text.primary }}
            >
              "{testimonials[currentIndex].text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: colors.accent }}
              >
                {testimonials[currentIndex].image}
              </div>
              <div>
                <p className="font-semibold" style={{ color: colors.text.primary }}>
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: colors.border.primary }}>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoPlay(false);
                  }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: index === currentIndex ? colors.accent : colors.border.primary,
                    width: index === currentIndex ? '24px' : '8px',
                  }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-lg border transition-all duration-300 hover:opacity-70"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.secondary,
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-lg border transition-all duration-300 hover:opacity-70"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.secondary,
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
