'use client';

import React, { useEffect, useRef, useCallback, ElementType, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrambleTextProps {
  children: string;
  className?: string;
  as?: ElementType;
  trigger?: 'load' | 'scroll';
  retriggerAtEnd?: boolean;
  retriggerAtStart?: boolean;
  duration?: number;
  speed?: number;
  chars?: string;
}

function ScrambleText({
  children,
  className,
  as: Tag = 'span',
  trigger = 'scroll',
  retriggerAtEnd = false,
  retriggerAtStart = false,
  duration = 1.2,
  speed = 50,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
}: ScrambleTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  const originalText = children;
  const isAnimating = useRef(false);
  const hasInitialAnimated = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    if (isAnimating.current || !elementRef.current) return;
    isAnimating.current = true;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const textLength = originalText.length;
    let iteration = 0;
    const totalIterations = duration * speed;
    const el = elementRef.current;

    intervalRef.current = setInterval(() => {
      const text = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '[' || char === ']') return char;
          const revealThreshold = (iteration / totalIterations) * textLength;
          if (index < revealThreshold) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      // Direct DOM update — no React re-render
      el.textContent = text;
      iteration++;

      if (iteration >= totalIterations) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        el.textContent = originalText;
        isAnimating.current = false;
      }
    }, 1000 / speed);
  }, [originalText, duration, speed, chars]);

  // Initial animation (load or scroll)
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let trigger_: ScrollTrigger | null = null;

    if (trigger === 'load') {
      if (!hasInitialAnimated.current) {
        hasInitialAnimated.current = true;
        scramble();
      }
    } else {
      trigger_ = ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        end: 'top 10%',
        onEnter: () => scramble(),
        onEnterBack: () => scramble()
      });
    }

    return () => {
      trigger_?.kill();
    };
  }, [trigger, scramble]);

  // Footer retrigger
  useEffect(() => {
    if (!retriggerAtEnd) return;

    const footerSpacer = document.querySelector('[class*="footerSpacer"]');
    if (!footerSpacer) return;

    const footerTrigger = ScrollTrigger.create({
      trigger: footerSpacer,
      start: 'top 80%',
      end: 'top 20%',
      onEnter: () => scramble(),
      onLeaveBack: () => scramble()
    });

    return () => {
      footerTrigger.kill();
    };
  }, [retriggerAtEnd, scramble]);

  // Hero retrigger (when scrolling back to top)
  useEffect(() => {
    if (!retriggerAtStart) return;

    const heroSpacer = document.querySelector('[class*="heroSpacer"]');
    if (!heroSpacer) return;

    const heroTrigger = ScrollTrigger.create({
      trigger: heroSpacer,
      start: 'bottom 80%',
      end: 'top top',
      onEnterBack: () => scramble()
    });

    return () => {
      heroTrigger.kill();
    };
  }, [retriggerAtStart, scramble]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;
  return (
    <Component ref={elementRef} className={className}>
      {originalText}
    </Component>
  );
}

export default memo(ScrambleText);
