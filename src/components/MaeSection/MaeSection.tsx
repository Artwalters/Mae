'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MaeSection.module.css';
import basePath from '@/lib/basePath';

gsap.registerPlugin(ScrollTrigger);

const maeData = [
  {
    number: '01',
    title: 'MOVE',
    description: 'Verandering begint met beweging. Niet alleen fysiek, maar ook mentaal. De eerste stap is vaak het lastigst, en de weg ernaartoe gaat niet altijd in een rechte lijn. Dat hoort erbij. Wij zijn er om je te begeleiden, te motiveren wanneer het tegenzit, en je te helpen volhouden.',
    image: `${basePath}/img/maarten.png`,
    keywords: ['Mobiliteit', 'Beweging', 'Motivatie', 'Begeleiding']
  },
  {
    number: '02',
    title: 'ADAPT',
    description: 'Iedereen is anders. Daarom krijg je een plan dat volledig is afgestemd op jouw situatie, doelen en niveau. En omdat jij verandert, verandert je plan mee. We evalueren regelmatig en sturen bij waar nodig, zodat je altijd blijft groeien.',
    image: `${basePath}/img/run.png`,
    keywords: ['Persoonlijk', 'Maatwerk', 'Progressie', 'Evaluatie']
  },
  {
    number: '03',
    title: 'EVOLVE',
    description: 'Dit gaat verder dan alleen trainen. Het gaat om bouwen aan een sterkere, gezondere versie van jezelf. Niet voor even, maar voor de lange termijn. Meer energie, meer zelfvertrouwen, en een lichaam waar je je goed in voelt.',
    image: `${basePath}/img/RICKv2.png`,
    keywords: ['Transformatie', 'Energie', 'Zelfvertrouwen', 'Lange termijn']
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

    const isMobile = window.innerWidth < 768;

    // On mobile: no animation, just show everything statically
    if (isMobile) {
      overlay.style.display = 'none';
      shadowsRef.current.forEach(s => { if (s) s.style.display = 'none'; });
      return;
    }

    const allElements = [overlay, ...rows];
    const heights = allElements.map(el => el.offsetHeight);
    const extraOffset = 50;

    allElements.forEach((el, index) => {
      if (index > 0) {
        const offset = heights.slice(0, index).reduce((sum, h) => sum + h, 0) + extraOffset;
        gsap.set(el, {
          y: -offset,
          rotation: -3 - (index - 1) * 1.5,
          transformOrigin: 'right top',
          force3d: true,
        });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rowsWrapper,
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      },
    });

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
          force3d: true,
        }, delay);

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
    <section ref={sectionRef} id="mae-section" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <span className="label label-dark">
          [ VISIE EN MISSIE ]
        </span>
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
                  <p className={`${styles.description} par`}>{item.description}</p>
                  <div className={styles.keywords}>
                    {item.keywords.map((keyword, i) => (
                      <span key={i}>{keyword}{i < item.keywords.length - 1 ? ' /' : ''}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-cover img-grayscale"
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
