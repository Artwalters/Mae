'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FAQSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Hoe kan ik een afspraak maken?',
    answer: 'Je kunt direct een afspraak inplannen via onze website of contact opnemen via WhatsApp. Een verwijzing is niet nodig — voor zowel fysiotherapie als leefstijlcoaching kun je zelf rechtstreeks terecht bij MAE.',
  },
  {
    question: 'Wat kan ik verwachten bij mijn eerste bezoek?',
    answer: 'We beginnen altijd met een uitgebreide intake van 60 minuten. Hierin bespreken we je klachten, doelen en situatie. Op basis daarvan stellen we samen een persoonlijk plan op dat aansluit bij wat jij nodig hebt.',
  },
  {
    question: 'Voor wie is MAE geschikt?',
    answer: 'Voor iedereen. Of je nu herstellende bent van een blessure, meer wilt bewegen, gezonder wilt leven of topsport bedrijft. Ons aanbod is volledig afgestemd op jouw niveau en doelen.',
  },
  {
    question: 'Wat kost een behandeling en wordt het vergoed?',
    answer: 'Intake (prestatiecode 1864): €55 btw-vrij. Behandeling (prestatiecode 1000): €45 btw-vrij. Wij werken zonder contracten met zorgverzekeraars zodat we volledige vrijheid hebben in onze aanpak. Je kunt facturen met deze prestatiecodes mogelijk indienen bij je zorgverzekeraar voor een (gedeeltelijke) vergoeding vanuit je aanvullende verzekering.',
  },
  {
    question: 'Kan ik fysiotherapie en leefstijlcoaching combineren?',
    answer: 'Zeker. Sterker nog, de combinatie versterkt je resultaat. We stemmen beide trajecten op elkaar af zodat je lichaam én leefstijl samen vooruitgaan.',
  },
];

export default function FAQSection() {
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
    <section ref={sectionRef} id="faq-section" className={styles.section}>
      <div className={styles.header}>
        <span className="label label-dark">[ Veelgestelde vragen ]</span>
      </div>

      <h2 className={styles.title}>
        <span className={styles.titleLine}>VRAGEN?</span>
        <span className={styles.titleLine}>WIJ HEBBEN</span>
        <span className={styles.titleLine}><span style={{ fontFeatureSettings: '"ss02" 1' }}>A</span>NTWOORDEN.</span>
      </h2>

      <div className={styles.list}>
        <div ref={rowsWrapperRef} className={styles.rowsWrapper}>
          {/* White overlay that hides all rows initially */}
          <div ref={overlayRef} className={styles.overlay}>
            <div className={styles.divider} />
          </div>
          {faqs.map((faq, index) => (
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
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.textContent}>
                  <h3 className={styles.question}>{faq.question}</h3>
                  <p className={`${styles.answer} par`}>{faq.answer}</p>
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
