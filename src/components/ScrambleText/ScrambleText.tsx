'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrambleTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  trigger?: 'load' | 'scroll';
  retriggerAtEnd?: boolean;
  retriggerAtStart?: boolean;
  duration?: number;
  speed?: number;
  chars?: string;
}

export default function ScrambleText({
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
  const [displayText, setDisplayText] = useState(children);
  const originalText = children;
  const isAnimating = useRef(false);
  const hasInitialAnimated = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    // Prevent overlapping animations
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const textLength = originalText.length;
    let iteration = 0;
    const totalIterations = duration * speed;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            // Keep spaces and brackets as-is
            if (char === ' ' || char === '[' || char === ']') {
              return char;
            }

            // Gradually reveal characters from left to right
            const revealThreshold = (iteration / totalIterations) * textLength;
            if (index < revealThreshold) {
              return originalText[index];
            }

            // Random character from chars set
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration >= totalIterations) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(originalText);
        isAnimating.current = false;
      }
    }, 1000 / speed);
  }, [originalText, duration, speed, chars]);

  // Initial animation (load or scroll)
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (trigger === 'load') {
      if (!hasInitialAnimated.current) {
        hasInitialAnimated.current = true;
        scramble();
      }
    } else {
      // Scroll trigger - fires on enter and when scrolling back up
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        end: 'top 10%',
        onEnter: () => {
          scramble();
        },
        onEnterBack: () => {
          scramble();
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) {
          st.kill();
        }
      });
    };
  }, [trigger, scramble]);

  // Footer retrigger
  useEffect(() => {
    if (!retriggerAtEnd) return;

    // Find the footer spacer element
    const footerSpacer = document.querySelector('[class*="footerSpacer"]');

    if (!footerSpacer) return;

    // Create a ScrollTrigger that fires when the footer spacer comes into view
    // and when scrolling back up
    const footerTrigger = ScrollTrigger.create({
      trigger: footerSpacer,
      start: 'top 80%',
      end: 'top 20%',
      onEnter: () => {
        scramble();
      },
      onLeaveBack: () => {
        scramble();
      }
    });

    return () => {
      footerTrigger.kill();
    };
  }, [retriggerAtEnd, scramble]);

  // Hero retrigger (when scrolling back to top)
  useEffect(() => {
    if (!retriggerAtStart) return;

    // Find the hero spacer element
    const heroSpacer = document.querySelector('[class*="heroSpacer"]');

    if (!heroSpacer) return;

    // Create a ScrollTrigger that fires when scrolling back up to the hero
    const heroTrigger = ScrollTrigger.create({
      trigger: heroSpacer,
      start: 'bottom 80%',
      end: 'top top',
      onEnterBack: () => {
        scramble();
      }
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

  return (
    <Tag ref={elementRef as any} className={className}>
      {displayText}
    </Tag>
  );
}
