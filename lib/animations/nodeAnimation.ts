import { gsap } from 'gsap';

/**
 * Triggers a premium pulse animation on a node (SVG group or circle element)
 * by its HTML id. Reused across Graphs and Trees.
 */
export const pulseNode = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Kill any active tweens on the element to avoid overlaps
  gsap.killTweensOf(element);

  // Pulse scale and add a transient violet glow effect
  gsap.fromTo(
    element,
    { transformOrigin: 'center center', scale: 1 },
    {
      scale: 1.3,
      duration: 0.25,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    }
  );
};

/**
 * Animates a ripple effect along a line path representing a visited edge.
 */
export const animateEdgeRipple = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  gsap.killTweensOf(element);

  // Ripple flash effect
  gsap.fromTo(
    element,
    { stroke: '#c084fc', strokeWidth: 5 },
    {
      stroke: '#a78bfa',
      strokeWidth: 3,
      duration: 0.6,
      ease: 'power1.inOut',
    }
  );
};
