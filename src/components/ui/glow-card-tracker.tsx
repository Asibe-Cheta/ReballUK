"use client";

import { useEffect } from "react";

export default function GlowCardTracker() {
  useEffect(() => {
    // Helper functions from the reference
    const centerOfElement = (el: Element) => {
      const { width, height } = el.getBoundingClientRect();
      return [width / 2, height / 2];
    };

    const pointerPositionRelativeToElement = (el: Element, e: PointerEvent) => {
      const pos = [e.clientX, e.clientY];
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = pos[0] - left;
      const y = pos[1] - top;
      const px = clamp((100 / width) * x);
      const py = clamp((100 / height) * y);
      return { pixels: [x, y], percent: [px, py] };
    };

    const angleFromPointerEvent = (el: Element, dx: number, dy: number) => {
      let angleRadians = 0;
      let angleDegrees = 0;
      if (dx !== 0 || dy !== 0) {
        angleRadians = Math.atan2(dy, dx);
        angleDegrees = angleRadians * (180 / Math.PI) + 90;
        if (angleDegrees < 0) {
          angleDegrees += 360;
        }
      }
      return angleDegrees;
    };

    const distanceFromCenter = (el: Element, x: number, y: number) => {
      const [cx, cy] = centerOfElement(el);
      return [x - cx, y - cy];
    };

    const closenessToEdge = (el: Element, x: number, y: number) => {
      const [cx, cy] = centerOfElement(el);
      const [dx, dy] = distanceFromCenter(el, x, y);
      let k_x = Infinity;
      let k_y = Infinity;
      if (dx !== 0) {
        k_x = cx / Math.abs(dx);
      }
      if (dy !== 0) {
        k_y = cy / Math.abs(dy);
      }
      return clamp(1 / Math.min(k_x, k_y), 0, 1);
    };

    const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));

    const clamp = (value: number, min = 0, max = 100) =>
      Math.min(Math.max(value, min), max);

    // Card update function
    const cardUpdate = (card: HTMLElement) => (e: PointerEvent) => {
      const position = pointerPositionRelativeToElement(card, e);
      const [px, py] = position.pixels;
      const [perx, pery] = position.percent;
      const [dx, dy] = distanceFromCenter(card, px, py);
      const edge = closenessToEdge(card, px, py);
      const angle = angleFromPointerEvent(card, dx, dy);

      card.style.setProperty('--pointer-x', `${round(perx)}%`);
      card.style.setProperty('--pointer-y', `${round(pery)}%`);
      card.style.setProperty('--pointer-deg', `${round(angle)}deg`);
      card.style.setProperty('--pointer-d', `${round(edge * 100)}`);

      card.classList.remove('animating');
    };

    // Initialize all glow cards
    const glowCards = document.querySelectorAll<HTMLElement>('.glow-card');
    const handlers: Array<{ element: HTMLElement; handler: (e: PointerEvent) => void }> = [];

    glowCards.forEach((card) => {
      const handler = cardUpdate(card);
      handlers.push({ element: card, handler });
      card.addEventListener('pointermove', handler);
    });

    // Cleanup function
    return () => {
      handlers.forEach(({ element, handler }) => {
        element.removeEventListener('pointermove', handler);
      });
    };
  }, []);

  return null; // This component doesn't render anything
}
