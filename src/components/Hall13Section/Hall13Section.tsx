'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hall13Section.module.css';
import cdn from '@/lib/cdn';

gsap.registerPlugin(ScrollTrigger);

export default function Hall13Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const banner = bannerRef.current;

    if (!section || !banner) return;

    // Read CSS-defined top value as reference (0.5em in correct font-size context)
    const initialTop = parseFloat(getComputedStyle(banner).top) || 0;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: () => {
        const sectionRect = section.getBoundingClientRect();
        const bannerHeight = banner.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Keep banner absolute, calculate top to simulate sticky-to-viewport-bottom
        const desiredTop = viewportHeight - bannerHeight - sectionRect.top;
        const minTop = initialTop;
        const maxTop = sectionRect.height - bannerHeight - initialTop;

        banner.style.top = Math.max(minTop, Math.min(desiredTop, maxTop)) + 'px';
        banner.style.bottom = 'auto';
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={bannerRef} className={`banner-accent ${styles.banner}`}>
        <p className="banner-text par">
          MAE maakt deel uit van Hal 13, een platform voor beweging en prestatie. Naast fysiotherapie en leefstijlcoaching biedt Hal 13 nog meer: performance coaching, sport specifieke trainingen en mentale begeleiding.
        </p>
        <a href="https://hal13.nl/" target="_blank" rel="noopener noreferrer" className={`btn-bar ${styles.bannerButton}`}>
          Ontdek Hal 13
        </a>
      </div>
      <video
        src={`${cdn}/degym.mp4`}
        autoPlay
        loop
        muted
        playsInline
        className="img-cover"
      />
    </section>
  );
}
