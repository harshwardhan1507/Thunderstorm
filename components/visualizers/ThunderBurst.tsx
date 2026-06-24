'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface ThunderBurstProps {
  show: boolean;
  onComplete?: () => void;
  title?: string;
  metricsText?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const ThunderBurst: React.FC<ThunderBurstProps> = ({
  show,
  onComplete,
  title = 'Algorithm Completed',
  metricsText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const requestRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (show) {
      setIsActive(true);
      // Trigger canvas animation
      setTimeout(() => {
        animateBurst();
      }, 50);
    } else {
      setIsActive(false);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [show]);

  const animateBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 600;
    const height = parent?.clientHeight || 400;
    canvas.width = width;
    canvas.height = height;

    // Generate lightning spark particles
    const particles: Particle[] = [];
    const colors = ['#a78bfa', '#c084fc', '#818cf8', '#ffffff']; // Storm violet/blue/white

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 30 + 30,
      });
    }
    particlesRef.current = particles;

    // Draw main lightning bolt and branches
    let boltProgress = 0;
    const lightningPoints: { x: number; y: number }[] = [];
    let curX = width / 2 + (Math.random() * 40 - 20);
    let curY = 0;

    lightningPoints.push({ x: curX, y: curY });
    while (curY < height) {
      curY += Math.random() * 30 + 15;
      curX += Math.random() * 40 - 20;
      lightningPoints.push({ x: Math.max(0, Math.min(width, curX)), y: curY });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw flash glow
      if (boltProgress < 20) {
        ctx.fillStyle = `rgba(139, 92, 246, ${0.18 - boltProgress * 0.008})`;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Lightning Bolt
      if (boltProgress < 30) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, 4 - boltProgress * 0.1);
        ctx.shadowColor = '#a78bfa';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(lightningPoints[0].x, lightningPoints[0].y);

        for (let i = 1; i < lightningPoints.length; i++) {
          ctx.lineTo(lightningPoints[i].x, lightningPoints[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Draw Spark Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity drift
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        return p.life < p.maxLife;
      });

      boltProgress++;

      if (boltProgress < 80 || particlesRef.current.length > 0) {
        requestRef.current = requestAnimationFrame(render);
      } else {
        setIsActive(false);
        if (onComplete) onComplete();
      }
    };

    render();
  };

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-black/10 transition-opacity duration-300"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Completion Stat Badge (fade in overlay) */}
      <div className="z-40 bg-[#0c0c0c]/85 backdrop-blur-md border border-accent-purple/40 px-5 py-3 rounded-2xl flex flex-col items-center text-center shadow-[0_0_25px_rgba(124,58,237,0.3)] animate-in fade-in zoom-in duration-300 pointer-events-auto">
        <div className="flex items-center gap-1.5 text-accent-purple text-xs font-bold uppercase tracking-wider font-mono">
          <span>⚡</span> {title} <span>⚡</span>
        </div>
        {metricsText && (
          <p className="text-text-secondary text-[11px] font-mono mt-1.5 whitespace-pre-line leading-relaxed">
            {metricsText}
          </p>
        )}
      </div>
    </div>
  );
};
