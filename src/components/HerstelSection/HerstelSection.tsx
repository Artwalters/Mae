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
