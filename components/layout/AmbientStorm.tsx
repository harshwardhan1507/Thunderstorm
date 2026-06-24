'use client';

import React, { useEffect, useRef, useState } from 'react';

export const AmbientStorm: React.FC = () => {
  const [disableEffects, setDisableEffects] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState(0);
  
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Accessibility & Performance Check (prefers-reduced-motion)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setDisableEffects(true);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setDisableEffects(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 2. FPS Budget Protection Loop
  useEffect(() => {
    if (disableEffects) return;

    let animId: number;
    lastFrameTimeRef.current = performance.now();

    const checkFps = (timestamp: number) => {
      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      // Avoid huge spikes from background tab freezing
      if (delta < 200) {
        const fps = 1000 / delta;
        const times = frameTimesRef.current;
        times.push(fps);
        if (times.length > 120) {
          times.shift();
        }

        // Check average FPS after accumulating enough frames
        if (times.length >= 60) {
          const avgFps = times.reduce((a, b) => a + b, 0) / times.length;
          if (avgFps < 55) {
            console.warn(`AmbientStorm: FPS dropped to ${avgFps.toFixed(1)}. Disabling background effects for performance.`);
            setDisableEffects(true);
            return; // Exit loop
          }
        }
      }

      animId = requestAnimationFrame(checkFps);
    };

    animId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animId);
  }, [disableEffects]);

  // 3. Lightning Flash Loop
  useEffect(() => {
    if (disableEffects) return;

    const triggerFlash = () => {
      // Natural lightning: flash twice quickly
      setFlashOpacity(0.08);
      
      setTimeout(() => {
        setFlashOpacity(0);
        
        setTimeout(() => {
          setFlashOpacity(0.04);
          
          setTimeout(() => {
            setFlashOpacity(0);
            
            // Queue next lightning strike in 8-15 seconds
            const nextDelay = Math.random() * 7000 + 8000;
            flashTimerRef.current = setTimeout(triggerFlash, nextDelay);
          }, 70);
        }, 60);
      }, 100);
    };

    const initialDelay = Math.random() * 5000 + 4000;
    flashTimerRef.current = setTimeout(triggerFlash, initialDelay);

    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, [disableEffects]);

  if (disableEffects) {
    // Pure fallback background with zero rendering overhead
    return (
      <div 
        className="fixed inset-0 z-[-1] bg-[#09090b] pointer-events-none" 
        style={{ contentVisibility: 'auto' }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09090b] pointer-events-none select-none">
      {/* Moving Ambient Clouds */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-purple-900/10 to-transparent blur-[120px] animate-[pulse_10s_ease-in-out_infinite]"
        style={{ willChange: 'transform, opacity' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-indigo-900/10 to-transparent blur-[100px] animate-[pulse_12s_ease-in-out_infinite]"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Subtle Dust/Storm Particles */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2a2a35_1px,transparent_1px)] [background-size:32px_32px] animate-[pan_60s_linear_infinite]" />

      {/* Lightning Flash Overlay */}
      <div 
        className="absolute inset-0 bg-white transition-opacity duration-75 pointer-events-none"
        style={{ opacity: flashOpacity, willChange: 'opacity' }}
      />

      {/* Keyframe styles embedded to avoid external dependencies */}
      <style jsx global>{`
        @keyframes pan {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
      `}</style>
    </div>
  );
};
