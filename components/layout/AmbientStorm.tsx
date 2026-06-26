'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../lib/context/ThemeContext';

export const AmbientStorm: React.FC = () => {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const isLanding = pathname === '/';
  const [disableEffects, setDisableEffects] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) setDisableEffects(true);
    const handleChange = (e: MediaQueryListEvent) => setDisableEffects(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (disableEffects || !isLanding) return;
    let animId: number;
    lastFrameTimeRef.current = performance.now();
    const checkFps = (timestamp: number) => {
      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      if (delta < 200) {
        const fps = 1000 / delta;
        const times = frameTimesRef.current;
        times.push(fps);
        if (times.length > 120) times.shift();
        if (times.length >= 60) {
          const avgFps = times.reduce((a, b) => a + b, 0) / times.length;
          if (avgFps < 55) { setDisableEffects(true); return; }
        }
      }
      animId = requestAnimationFrame(checkFps);
    };
    animId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animId);
  }, [disableEffects, isLanding]);

  useEffect(() => {
    if (disableEffects || !isLanding) return;
    const triggerFlash = () => {
      setFlashOpacity(0.06);
      setTimeout(() => {
        setFlashOpacity(0);
        setTimeout(() => {
          setFlashOpacity(0.03);
          setTimeout(() => {
            setFlashOpacity(0);
            const nextDelay = Math.random() * 7000 + 8000;
            flashTimerRef.current = setTimeout(triggerFlash, nextDelay);
          }, 70);
        }, 60);
      }, 100);
    };
    const initialDelay = Math.random() * 5000 + 4000;
    flashTimerRef.current = setTimeout(triggerFlash, initialDelay);
    return () => { if (flashTimerRef.current) clearTimeout(flashTimerRef.current); };
  }, [disableEffects, isLanding]);

  // On inner pages: plain bg (theme-aware), no animations
  if (!isLanding || disableEffects) {
    return (
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a0a] pointer-events-none select-none">
      <div
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-purple-900/8 to-transparent blur-[120px] animate-[pulse_10s_ease-in-out_infinite]"
        style={{ willChange: 'transform, opacity' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-indigo-900/8 to-transparent blur-[100px] animate-[pulse_12s_ease-in-out_infinite]"
        style={{ willChange: 'transform, opacity' }}
      />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2a2a35_1px,transparent_1px)] [background-size:32px_32px] animate-[pan_60s_linear_infinite]" />
      <div
        className="absolute inset-0 bg-white transition-opacity duration-75 pointer-events-none"
        style={{ opacity: flashOpacity, willChange: 'opacity' }}
      />
      <style jsx global>{`
        @keyframes pan {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
      `}</style>
    </div>
  );
};
