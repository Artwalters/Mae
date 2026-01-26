'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from '@/components/ScrambleText';
import { usePanel } from '@/context/PanelContext';
import styles from './LeefstijlSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function LeefstijlSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { openPanel } = usePanel();

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
          banner.style.left = '0.5em';
        } else if (sectionRect.bottom <= viewportHeight) {
          banner.style.position = 'absolute';
          banner.style.top = 'auto';
          banner.style.bottom = '0.5em';
          banner.style.left = '0.5em';
        } else {
          banner.style.position = 'absolute';
          banner.style.top = '0.5em';
          banner.style.bottom = 'auto';
          banner.style.left = '0.5em';
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Left Image */}
      <div className={styles.imageContainer}>
        <div ref={bannerRef} className={`banner-accent ${styles.banner}`}>
          <p className="banner-text">
            Merel helpt je bij het vinden van een duurzame levensstijl die bij jou past. Geen diëten, maar echte verandering met zelfacceptatie als uitgangspunt.
          </p>
          <button className={`btn-bar ${styles.bannerButton}`} onClick={() => openPanel('meet-merel')}>
            Meet Merel
          </button>
        </div>
        <img
          src="/img/run.png"
          alt="Leefstijl coaching"
          className="img-cover img-grayscale"
        />
      </div>

      {/* Right Content */}
      <div className={styles.content}>
        <span className="label label-light">
          [ <ScrambleText retriggerAtEnd>Leefstijlcoaching</ScrambleText> ]
        </span>
        <h2 className={`title-chaney ${styles.title}`}>Balans</h2>
        <p className={`text-description ${styles.description}`}>
          Bij leefstijlcoaching nemen we jouw volledige levensstijl onder de loep.
          Geen diëten, maar duurzame verandering. Samen stellen we doelen op en
          ontvang je een persoonlijk leefstijlplan, voedingsplan en trainingsschema
          waarmee je stapsgewijs naar jouw doelen toe kunt werken.
        </p>
        <button className="btn-accent" onClick={() => openPanel('start-nu')}><span>Start nu</span></button>
      </div>
    </section>
  );
}
