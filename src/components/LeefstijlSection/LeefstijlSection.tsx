'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from '@/components/ScrambleText';
import { usePanel } from '@/context/PanelContext';
import styles from './LeefstijlSection.module.css';
import basePath from '@/lib/basePath';

gsap.registerPlugin(ScrollTrigger);

export default function LeefstijlSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { openPanel } = usePanel();

  useEffect(() => {
    const section = sectionRef.current;
    const banner = bannerRef.current;

    if (!section || !banner) return;

    const container = banner.offsetParent as HTMLElement;
    if (!container) return;

    // Read CSS-defined top value as reference (0.5em in correct font-size context)
    const initialTop = parseFloat(getComputedStyle(banner).top) || 0;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: () => {
        const containerRect = container.getBoundingClientRect();
        const bannerHeight = banner.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Keep banner absolute, calculate top to simulate sticky-to-viewport-bottom
        const desiredTop = viewportHeight - bannerHeight - containerRect.top;
        const minTop = initialTop;
        const maxTop = containerRect.height - bannerHeight - initialTop;

        banner.style.top = Math.max(minTop, Math.min(desiredTop, maxTop)) + 'px';
        banner.style.bottom = 'auto';
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="leefstijl-section" className={styles.section}>
      {/* Left Image */}
      <div id="leefstijl-image" className={styles.imageContainer}>
        <div ref={bannerRef} className={`banner-accent ${styles.banner}`}>
          <p className="banner-text par">
            Merel helpt je bij het vinden van een duurzame levensstijl die bij jou past. Geen diëten, maar echte verandering met zelfacceptatie als uitgangspunt.
          </p>
          <button className={`btn-bar ${styles.bannerButton}`} onClick={() => openPanel('meet-merel')}>
            Meet Merel
          </button>
        </div>
        <img
          src={`${basePath}/img/run.png`}
          alt="Leefstijl coaching"
          className="img-cover img-grayscale"
        />
      </div>

      {/* Right Content */}
      <div id="leefstijl-content" className={styles.content}>
        <span className="label label-light">
          [ <ScrambleText retriggerAtEnd>Leefstijlcoaching</ScrambleText> ]
        </span>
        <h2 className={`title-chaney ${styles.title}`}>Balans</h2>
        <p className={`text-description ${styles.description} par`}>
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
