'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MaeSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const maeData = [
  {
    number: '01',
    title: 'MOVE',
    description: 'Verandering begint met beweging. Niet alleen fysiek, maar ook mentaal. De eerste stap is vaak het lastigst, en de weg ernaartoe gaat niet altijd in een rechte lijn. Dat hoort erbij. Wij zijn er om je te begeleiden, te motiveren wanneer het tegenzit, en je te helpen volhouden.',
    image: '/img/maarten.png'
  },
  {
    number: '02',
    title: 'ADAPT',
    description: 'Iedereen is anders. Daarom krijg je een plan dat volledig is afgestemd op jouw situatie, doelen en niveau. En omdat jij verandert, verandert je plan mee. We evalueren regelmatig en sturen bij waar nodig, zodat je altijd blijft groeien.',
    image: '/img/run.png'
  },
  {
    number: '03',
    title: 'EVOLVE',
    description: 'Dit gaat verder dan alleen trainen. Het gaat om bouwen aan een sterkere, gezondere versie van jezelf. Niet voor even, maar voor de lange termijn. Meer energie, meer zelfvertrouwen, en een lichaam waar je je goed in voelt.',
    image: '/img/RICKv2.png'
  }
];

export default function MaeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsWrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const shadowsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const rowsWrapper = rowsWrapperRef.current;
    const overlay = overlayRef.current;
    const rows = rowsRef.current;

    if (!section || !rowsWrapper || !overlay || rows.length === 0) return;

    // All elements (overlay + 3 rows) = 4 items
    // They all start stacked at position 0 (top)
    // Order from top: overlay (z-4), MOVE (z-3), ADAPT (z-2), EVOLVE (z-1)

    const allElements = [overlay, ...rows];
    const heights = allElements.map(el => el.offsetHeight);

    // Set initial state: all stacked at top with rotation
    // Later cards have more rotation
    // Extra offset to hide cards behind overlay
    const extraOffset = 50;

    allElements.forEach((el, index) => {
      if (index > 0) {
        // Move up by sum of all previous heights + extra offset
        const offset = heights.slice(0, index).reduce((sum, h) => sum + h, 0) + extraOffset;
        gsap.set(el, {
          y: -offset,
          rotation: -3 - (index - 1) * 1.5,
          transformOrigin: 'right top'
        });
      }
    });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rowsWrapper,
        start: 'top 90%',
        end: 'bottom 60%',
        scrub: true,
      },
    });

    // Animate all elements (except first) to y: 0 and rotation: 0
    // Later cards have slight delay and are slower
    const shadows = shadowsRef.current;

    allElements.forEach((el, index) => {
      if (index > 0) {
        const delay = (index - 1) * 0.1;
        const duration = 1 + (index - 1) * 0.6;

        tl.to(el, {
          y: 0,
          rotation: 0,
          ease: 'power1.inOut',
          duration: duration,
        }, delay);

        // Fade out shadow overlay
        if (shadows[index - 1]) {
          tl.to(shadows[index - 1], {
            opacity: 0,
            ease: 'power1.inOut',
            duration: duration,
          }, delay);
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.label}>[ FYSIOTHERAPIE ]</span>
      </div>

      {/* Main Title */}
      <h1 className={styles.title}>
        <span className={styles.titleLine}>THE PLACE</span>
        <span className={styles.titleLine}>WHERE YOU MOVE</span>
        <span className={styles.titleLine}>ADAPT EVOLVE</span>
      </h1>

      {/* Content rows */}
      <div className={styles.content}>
        <div ref={rowsWrapperRef} className={styles.rowsWrapper}>
          {/* White overlay that hides all rows initially */}
          <div ref={overlayRef} className={styles.overlay}>
            <div className={styles.divider} />
          </div>
          {maeData.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) rowsRef.current[index] = el;
              }}
              className={styles.row}
            >
              <div
                ref={(el) => {
                  if (el) shadowsRef.current[index] = el;
                }}
                className={styles.shadowOverlay}
              />
              <div className={styles.rowContent}>
                <span className={styles.number}>{item.number}</span>
                <div className={styles.textContent}>
                  <h2 className={styles.rowTitle}>{item.title}</h2>
                  <p className={styles.description}>{item.description}</p>
                </div>
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.image}
                  />
                </div>
              </div>
              <div className={styles.divider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
