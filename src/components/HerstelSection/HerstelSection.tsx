'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from '@/components/ScrambleText';
import { usePanel } from '@/context/PanelContext';
import styles from './HerstelSection.module.css';
import basePath from '@/lib/basePath';

gsap.registerPlugin(ScrollTrigger);

export default function HerstelSection() {
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
    <section ref={sectionRef} className={styles.section}>
      {/* Left Content */}
      <div className={styles.content}>
        <span className="label label-light">
          [ <ScrambleText retriggerAtEnd>Fysiotherapie bij MAE</ScrambleText> ]
        </span>
        <h2 className={`title-chaney ${styles.title}`}>Herstel</h2>
        <p className={`text-description ${styles.description} par`}>
          Bij MAE zien we fysiotherapie niet als een vast stramien, maar als een ingang.
          Een poort naar het échte gesprek, naar beweging, naar ervaren, en vooral: naar
          verandering. Geen standaardprotocols of voorspelbare trajecten, maar een
          behandeling die begint met écht luisteren.
        </p>
        <button className="btn-accent" onClick={() => openPanel('start-nu')}><span>Start nu</span></button>
      </div>

      {/* Right Image */}
      <div className={styles.imageContainer}>
        <div ref={bannerRef} className={`banner-accent ${styles.banner}`}>
          <p className="banner-text par">
            Jij bent niet je klacht. En herstel begint niet altijd met een behandelplan, maar met vertrouwen, inzicht en een fysiotherapeut die naast je staat.
          </p>
          <button className={`btn-bar ${styles.bannerButton}`} onClick={() => openPanel('meet-maarten')}>
            Meet Maarten
          </button>
        </div>
        <img
          src={`${basePath}/img/run.png`}
          alt="Hardlopers tijdens marathon"
          className="img-cover img-grayscale"
        />
      </div>
    </section>
  );
}
