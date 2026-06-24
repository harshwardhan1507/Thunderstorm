import { gsap } from 'gsap';

export type NodeState = 'default' | 'active' | 'visited' | 'processing' | 'completed';
export type AnimationType = 'pulse' | 'ripple' | 'glow' | 'drop' | 'fade';

interface AnimationConfig {
  duration?: number;
  scale?: number;
  glowColor?: string;
  rippleColor?: string;
}

const DEFAULT_CONFIG: Required<AnimationConfig> = {
  duration: 0.3,
  scale: 1.15,
  glowColor: '#3B82F6',
  rippleColor: '#7c3aed',
};

/**
 * Premium GSAP Node Pulse Engine
 * Shared animation system for graphs, trees, and pathfinding
 * 
 * Animation Sequence:
 * 1. Scale 1 → 1.15
 * 2. Glow Increase
 * 3. Ripple Expansion
 * 4. Return To Rest State
 * 
 * Duration: 250-400ms (configurable)
 * Maintains 60fps
 */
export const pulseNode = (
  elementId: string,
  state: NodeState = 'active',
  config: AnimationConfig = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const cfg = { ...DEFAULT_CONFIG, ...config };
  gsap.killTweensOf(element);

  // State-based color mapping
  const stateColors = {
    default: { glow: 'transparent', stroke: '#333333' },
    active: { glow: 'rgba(59, 130, 246, 0.6)', stroke: '#3B82F6' }, // Electric Blue
    visited: { glow: 'rgba(124, 58, 237, 0.4)', stroke: '#7c3aed' }, // Storm Violet
    processing: { glow: 'rgba(6, 182, 212, 0.5)', stroke: '#06B6D4' }, // Pulsing Cyan
    completed: { glow: 'rgba(34, 197, 94, 0.4)', stroke: '#22C55E' }, // Soft Green
  };

  const colors = stateColors[state];
  const duration = cfg.duration || DEFAULT_CONFIG.duration;

  // Timeline for complex animation sequence
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // Phase 1: Scale up with glow
  tl.to(element, {
    scale: cfg.scale,
    duration: duration * 0.4,
    filter: `drop-shadow(0 0 8px ${colors.glow})`,
  });

  // Phase 2: Ripple expansion (if element has stroke)
  tl.to(element, {
    strokeWidth: 4,
    stroke: colors.stroke,
    duration: duration * 0.3,
  }, '-=0.1');

  // Phase 3: Return to rest state
  tl.to(element, {
    scale: 1,
    strokeWidth: 2,
    filter: 'none',
    duration: duration * 0.3,
  });

  return tl;
};

/**
 * Ripple effect for edge traversal
 * Creates a wave propagation animation along the edge
 */
export const animateEdgeRipple = (
  elementId: string,
  config: AnimationConfig = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const duration = cfg.duration || DEFAULT_CONFIG.duration;
  gsap.killTweensOf(element);

  const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } });

  // Initial flash
  tl.fromTo(
    element,
    { stroke: '#c084fc', strokeWidth: 5, opacity: 1 },
    { stroke: '#a78bfa', strokeWidth: 3, duration }
  );

  // Ripple propagation effect
  tl.to(element, {
    strokeDasharray: '10, 5',
    strokeDashoffset: -15,
    duration: duration * 0.8,
  }, '-=0.5');

  // Reset
  tl.to(element, {
    strokeDasharray: 'none',
    strokeDashoffset: 0,
    duration: 0.2,
  });

  return tl;
};

/**
 * Drop animation for tree node insertion
 * Node drops from parent position
 */
export const animateNodeDrop = (
  elementId: string,
  fromY: number,
  toY: number,
  config: AnimationConfig = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const duration = cfg.duration || DEFAULT_CONFIG.duration;
  gsap.killTweensOf(element);

  return gsap.fromTo(
    element,
    { y: fromY, scale: 0.5, opacity: 0 },
    { y: toY, scale: 1, opacity: 1, duration: duration * 1.2, ease: 'back.out(1.2)' }
  );
};

/**
 * Fade and collapse animation for node deletion
 */
export const animateNodeDelete = (
  elementId: string,
  config: AnimationConfig = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const cfg = { ...DEFAULT_CONFIG, ...config };
  gsap.killTweensOf(element);

  return gsap.to(element, {
    scale: 0,
    opacity: 0,
    duration: cfg.duration,
    ease: 'power2.in',
  });
};

/**
 * Amber flash animation for tree rotations
 */
export const animateRotationFlash = (
  elementId: string,
  config: AnimationConfig = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const cfg = { ...DEFAULT_CONFIG, ...config };
  gsap.killTweensOf(element);

  const tl = gsap.timeline();

  // Flash amber
  tl.to(element, {
    stroke: '#F59E0B',
    filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))',
    duration: 0.15,
  });

  // Return to normal
  tl.to(element, {
    stroke: '#333333',
    filter: 'none',
    duration: 0.2,
  });

  return tl;
};

/**
 * Wave propagation for pathfinding
 * Creates a sequential activation effect
 */
export const animateWavePropagation = (
  elementIds: string[],
  config: AnimationConfig = {}
) => {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const duration = cfg.duration || DEFAULT_CONFIG.duration;
  const staggerDelay = duration * 0.3;

  elementIds.forEach((id, index) => {
    setTimeout(() => {
      pulseNode(id, 'processing', config);
    }, index * staggerDelay * 1000);
  });
};

/**
 * Path reconstruction animation
 * Traces the found path with green energy trail
 */
export const animatePathReconstruction = (
  elementIds: string[],
  config: AnimationConfig = {}
) => {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const duration = cfg.duration || DEFAULT_CONFIG.duration;
  const staggerDelay = duration * 0.2;

  elementIds.forEach((id, index) => {
    setTimeout(() => {
      pulseNode(id, 'completed', config);
    }, index * staggerDelay * 1000);
  });
};

/**
 * Electric storm burst for goal reached
 * Premium celebration effect
 */
export const animateGoalReached = (
  elementId: string,
  config: AnimationConfig = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const cfg = { ...DEFAULT_CONFIG, ...config };
  gsap.killTweensOf(element);

  const tl = gsap.timeline();

  // Initial burst
  tl.to(element, {
    scale: 1.3,
    filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))',
    duration: 0.2,
    ease: 'power2.out',
  });

  // Ripple rings
  tl.to(element, {
    scale: 1.1,
    filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))',
    duration: 0.3,
  });

  // Final state
  tl.to(element, {
    scale: 1,
    filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))',
    duration: 0.2,
  });

  return tl;
};
