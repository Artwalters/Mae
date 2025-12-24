'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './LeefstijlSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function LeefstijlSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageContainer = imageContainerRef.current;
    const banner = bannerRef.current;

    if (!section || !imageContainer || !banner) return;

    // Get banner height for calculations
    const bannerHeight = banner.offsetHeight;

    // Create ScrollTrigger animation
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const containerRect = imageContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate if banner should stick to bottom of viewport
        const bannerTopPosition = containerRect.top + 8; // 0.5em ≈ 8px
        const bannerBottomLimit = containerRect.bottom - bannerHeight - 8;

        if (bannerTopPosition < viewportHeight - bannerHeight && containerRect.bottom > viewportHeight) {
          // Stick to bottom of viewport
          banner.style.position = 'fixed';
          banner.style.top = 'auto';
          banner.style.bottom = '0';
          banner.style.right = 'auto';
          banner.style.left = '0.5em';
        } else if (containerRect.bottom <= viewportHeight) {
          // Stop at bottom of container
          banner.style.position = 'absolute';
          banner.style.top = 'auto';
          banner.style.bottom = '0.5em';
          banner.style.right = 'auto';
          banner.style.left = '0.5em';
        } else {
          // Default position at top
          banner.style.position = 'absolute';
          banner.style.top = '0.5em';
          banner.style.bottom = 'auto';
          banner.style.right = 'auto';
          banner.style.left = '0.5em';
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Left Image */}
      <div ref={imageContainerRef} className={styles.imageContainer}>
        <div ref={bannerRef} className={styles.banner}>
          <div className={styles.bannerIcon} />
          <p className={styles.bannerText}>Meet Leefstijlcoach Merel</p>
        </div>
        <img
          src="/img/run.png"
          alt="Leefstijl coaching"
          className={styles.image}
        />
      </div>

      {/* Right Content */}
      <div className={styles.content}>
        <span className={styles.label}>Leefstijl</span>
        <h2 className={styles.title}>Herstel</h2>
        <p className={styles.description}>
          Bij M.A.E. Fysiotherapie kijken we anders naar revalidatie. Waar veel
          zorgprofessionals vooral beperkingen opleggen, geloven wij in een
          doelgerichte, persoonlijke en stapsgewijze aanpak. Het doel: jou weer
          laten functioneren zonder belemmeringen.
        </p>
        <div className={styles.accentBar} />
      </div>
    </section>
  );
}
