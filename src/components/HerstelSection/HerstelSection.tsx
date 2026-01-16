'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from '@/components/ScrambleText';
import styles from './HerstelSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HerstelSection() {
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

        const bannerTopPosition = sectionRect.top + parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.5;

        if (bannerTopPosition < viewportHeight - bannerHeight && sectionRect.bottom > viewportHeight) {
          banner.style.position = 'fixed';
          banner.style.top = 'auto';
          banner.style.bottom = '0';
          banner.style.right = '0.5em';
        } else if (sectionRect.bottom <= viewportHeight) {
          banner.style.position = 'absolute';
          banner.style.top = 'auto';
          banner.style.bottom = '0.5em';
          banner.style.right = '0.5em';
        } else {
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
      {/* Left Content */}
      <div className={styles.content}>
        <span className={styles.label}>
          [ <ScrambleText retriggerAtEnd>Fysiotherapie</ScrambleText> ]
        </span>
        <h2 className={styles.title}>Herstel</h2>
        <p className={styles.description}>
          Bij M.A.E. Fysiotherapie kijken we anders naar revalidatie. Waar veel
          zorgprofessionals vooral beperkingen opleggen, geloven wij in een
          doelgerichte, persoonlijke en stapsgewijze aanpak. Het doel: jou weer
          laten functioneren zonder belemmeringen.
        </p>
        <a href="#" className={styles.accentButton}><span>Ontdek meer</span></a>
      </div>

      {/* Right Image */}
      <div className={styles.imageContainer}>
        <div ref={bannerRef} className={styles.banner}>
          <p className={styles.bannerText}>
            Maarten is gespecialiseerd in sportblessures en revalidatie. Met jarenlange ervaring helpt hij sporters en actieve mensen om sterker terug te komen na een blessure.
          </p>
          <a href="#" className={`btn-bar ${styles.bannerButton}`}>
            Meet Maarten
          </a>
        </div>
        <img
          src="/img/run.png"
          alt="Hardlopers tijdens marathon"
          className={styles.image}
        />
      </div>
    </section>
  );
}
