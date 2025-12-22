'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorBg = cursorBgRef.current;
    if (!cursor || !cursorBg) return;

    // Make cursor follow mouse
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.6, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Setup magnetic hover targets
    const setupMagneticTargets = () => {
      const hoverTargets = document.querySelectorAll('[data-magnetic-cursor-target]');
      if (!hoverTargets.length) return;

      hoverTargets.forEach((target) => {
        const bgHolder = target.querySelector('[data-magnetic-cursor-bg]');
        if (!bgHolder) return;

        const handleMouseEnter = () => {
          const state = Flip.getState(cursorBg);
          bgHolder.appendChild(cursorBg);
          Flip.from(state, {
            ease: 'power2.out',
            duration: 0.25,
          });
        };

        const handleMouseLeave = () => {
          const state = Flip.getState(cursorBg, {
            props: 'opacity',
          });
          cursor.appendChild(cursorBg);
          Flip.from(state, {
            ease: 'power2.out',
            duration: 0.3,
          });
        };

        target.addEventListener('mouseenter', handleMouseEnter);
        target.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupMagneticTargets, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor">
      <div ref={cursorBgRef} className="cursor-bg"></div>
    </div>
  );
}
