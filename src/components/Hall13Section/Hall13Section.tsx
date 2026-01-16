'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hall13Section.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hall13Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const banner = bannerRef.current;

    if (!section || !banner) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: () => {
        const sectionRect = section.getBoundingClientRect();
        const bannerHeight = banner.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calculate where the banner would be if positioned at top
        const bannerTopPosition = sectionRect.top + parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.5;

        if (bannerTopPosition < viewportHeight - bannerHeight && sectionRect.bottom > viewportHeight) {
          // Stick to bottom of viewport
          banner.style.position = 'fixed';
          banner.style.top = 'auto';
          banner.style.bottom = '0';
          banner.style.right = '0.5em';
        } else if (sectionRect.bottom <= viewportHeight) {
          // Stop at bottom of section
          banner.style.position = 'absolute';
          banner.style.top = 'auto';
          banner.style.bottom = '0.5em';
          banner.style.right = '0.5em';
        } else {
          // Default position at top
          banner.style.position = 'absolute';
          banner.style.top = '0.5em';
          banner.style.bottom = 'auto';
          banner.style.right = '0.5em';
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={bannerRef} className={styles.banner}>
        <p className={styles.bannerText}>
          MAE maakt deel uit van Hall 13, een platform voor beweging en prestatie. Naast fysiotherapie en leefstijlcoaching biedt Hall 13 nog meer: performance coaching, sport specifieke trainingen en mentale begeleiding.
        </p>
        <a href="https://hall13.nl" target="_blank" rel="noopener noreferrer" className={`btn-bar ${styles.bannerButton}`}>
          Ontdek Hall 13
        </a>
      </div>
      <img
        src="/img/run.png"
        alt="Hall 13"
        className={styles.image}
      />
    </section>
  );
}
