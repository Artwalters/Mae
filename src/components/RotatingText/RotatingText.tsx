'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './RotatingText.module.css';

interface RotatingTextProps {
  words: string[];
  stepDuration?: number;
  className?: string;
}

export default function RotatingText({ words, stepDuration = 1.75, className = '' }: RotatingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const wordEls = wordRefs.current;

    if (!container || wordEls.length === 0) return;

    const duration = 0.5;

    // Get the height of the first word for animation distance
    const wordHeight = wordEls[0].offsetHeight;

    // Find the widest word and set container to that width (no width animation)
    let maxWidth = 0;
    wordEls.forEach(el => {
      const w = el.getBoundingClientRect().width;
      if (w > maxWidth) maxWidth = w;
    });
    container.style.width = maxWidth + 'px';
    container.style.height = wordHeight + 'px';

    // Initial state: all words hidden below
    gsap.set(wordEls, { y: wordHeight, opacity: 0 });

    // Show first word immediately
    let activeIndex = 0;
    gsap.set(wordEls[activeIndex], { y: 0, opacity: 1 });

    function showNext() {
      const nextIndex = (activeIndex + 1) % wordEls.length;
      const prev = wordEls[activeIndex];
      const current = wordEls[nextIndex];

      // Move old word out (up) - pure vertical motion
      gsap.to(prev, {
        y: -wordHeight,
        opacity: 0,
        duration: duration,
        ease: 'power2.inOut'
      });

      // Reveal new word (from below) - pure vertical motion
      gsap.fromTo(
        current,
        { y: wordHeight, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: duration,
          ease: 'power2.inOut'
        }
      );

      activeIndex = nextIndex;
    }

    // Start rotating after first step
    let delayedCall: gsap.core.Tween | null = null;

    function startLoop() {
      delayedCall = gsap.delayedCall(stepDuration, () => {
        showNext();
        startLoop();
      });
    }

    if (wordEls.length > 1) {
      startLoop();
    }

    return () => {
      if (delayedCall) delayedCall.kill();
    };
  }, [words, stepDuration]);

  return (
    <span ref={containerRef} className={`${styles.container} ${className}`}>
      {words.map((word, index) => (
        <span
          key={index}
          ref={(el) => { if (el) wordRefs.current[index] = el; }}
          className={styles.word}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
