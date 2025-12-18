'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import styles from './ScalingSection.module.css';

gsap.registerPlugin(ScrollTrigger, Flip);

const cardData = [
  {
    title: 'MOVE',
    description: 'Prestatie begint met beweging. Of je nu herstelt van een blessure of je grenzen wilt verleggen — zonder actie geen progressie. Wij zorgen dat jouw lichaam klaar is voor elke uitdaging.',
  },
  {
    title: 'ADAPT',
    description: 'Geen atleet is hetzelfde. Wij ontwikkelen een plan dat zich aanpast aan jouw sport, jouw lichaam en jouw ambities. Naarmate jij groeit, evolueert jouw programma mee.',
  },
  {
    title: 'EVOLVE',
    description: 'Dit is geen eindpunt, maar een continue reis naar de beste versie van jezelf. Sterker, sneller, veerkrachtiger. Wij begeleiden je naar het niveau waar jij altijd van hebt gedroomd.',
  },
];

export default function ScalingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const smallWrapperRef = useRef<HTMLDivElement>(null);
  const bigWrapperRef = useRef<HTMLDivElement>(null);
  const whereRef = useRef<HTMLSpanElement>(null);
  const youRef = useRef<HTMLSpanElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapperElements = [smallWrapperRef.current, bigWrapperRef.current];
    const targetEl = targetRef.current;
    const whereEl = whereRef.current;
    const youEl = youRef.current;
    const spacer = spacerRef.current;

    if (!targetEl || !wrapperElements[0] || !wrapperElements[1] || !whereEl || !youEl || !spacer) return;

    let tl: gsap.core.Timeline;
    let textTl: gsap.core.Timeline;
    let flipST: ScrollTrigger | null = null;

    function setupAnimations() {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (tl) tl.kill();
      if (textTl) textTl.kill();
      gsap.set(targetEl, { clearProps: 'all' });
      gsap.set([whereEl, youEl], { clearProps: 'all' });
      targetEl.classList.remove(styles.fixed);

      // 1. Flip animatie - van klein naar fullscreen
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperElements[0],
          start: 'center center',
          endTrigger: wrapperElements[wrapperElements.length - 1],
          end: 'center center',
          scrub: 0.25,
        },
      });

      flipST = tl.scrollTrigger as ScrollTrigger;

      // 2. Text animatie
      textTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperElements[0],
          start: 'center center',
          endTrigger: wrapperElements[wrapperElements.length - 1],
          end: 'center center',
          scrub: 0.25,
        },
      });

      textTl.to(whereEl, { x: '0.5em', ease: 'none' }, 0);
      textTl.to(youEl, { x: '-0.5em', ease: 'none' }, 0);

      // Flip animatie toevoegen
      wrapperElements.forEach((element, index) => {
        const nextIndex = index + 1;
        if (nextIndex < wrapperElements.length && element) {
          const nextWrapperEl = wrapperElements[nextIndex];
          if (!nextWrapperEl) return;

          const nextRect = nextWrapperEl.getBoundingClientRect();
          const thisRect = element.getBoundingClientRect();
          const nextDistance = nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
          const thisDistance = thisRect.top + window.pageYOffset + element.offsetHeight / 2;
          const offset = nextDistance - thisDistance;

          tl.add(
            Flip.fit(targetEl, nextWrapperEl, {
              duration: offset,
              ease: 'none',
            })
          );
        }
      });

      // Skew naar 0 animeren aan het einde
      const videoImg = targetEl.querySelector('img');
      tl.to(targetEl, {
        skewX: 0,
        ease: 'none',
      }, '<');
      if (videoImg) {
        tl.to(videoImg, {
          skewX: 0,
          ease: 'none',
        }, '<');
      }

      // 3. Na de flip: kill flip animatie en maak fixed
      // Image blijft fixed tot het einde van de spacer
      ScrollTrigger.create({
        trigger: spacer,
        start: 'top bottom',
        end: 'bottom bottom',
        onEnter: () => {
          // Kill de flip ScrollTrigger en clear alle inline styles
          if (flipST) {
            flipST.kill();
            flipST = null;
          }
          tl.kill();
          gsap.set(targetEl, { clearProps: 'all' });
          targetEl.classList.add(styles.fixed);
          // Reset de image transform
          if (videoImg) {
            gsap.set(videoImg, { clearProps: 'transform' });
          }
        },
        onLeave: () => {
          targetEl.classList.remove(styles.fixed);
        },
        onLeaveBack: () => {
          // Herstel de flip animatie
          targetEl.classList.remove(styles.fixed);
          setupAnimations();
        },
      });

      // 3b. Subtiele zoom op de afbeelding tijdens het stacken
      if (videoImg) {
        gsap.to(videoImg, {
          scale: 1.4,
          ease: 'none',
          scrollTrigger: {
            trigger: spacer,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0,
          },
        });
      }

      // 4. Stacking cards animatie
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);

      cards.forEach((card, index) => {
        // Pin elke card wanneer deze bovenaan komt
        // Blijf pinnen tot het einde van de spacer
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: spacer,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });
    }

    setupAnimations();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupAnimations();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className={`${styles.wrapper} scaling-section`}>
      {/* Header Section with small parallelogram */}
      <section className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.line}>THE PLACE</span>
          <span className={styles.line}>
            <span ref={whereRef} className={styles.word}>WHERE</span>
            <span className={styles.smallBox}>
              <span className={styles.videoBefore}></span>
              <span ref={smallWrapperRef} data-flip-element="wrapper" className={styles.videoWrapper}>
                <span ref={targetRef} data-flip-element="target" className={styles.video}>
                  <img src="/img/run.png" alt="Athletes" className={styles.videoImg} />
                </span>
              </span>
            </span>
            <span ref={youRef} className={styles.word}>YOU</span>
          </span>
          <span className={styles.line}>MOVE ADAPT EVOLVE</span>
        </h1>
      </section>

      {/* Fullscreen section */}
      <section className={styles.fullscreen}>
        <div className={styles.bigBox}>
          <div ref={bigWrapperRef} data-flip-element="wrapper" className={styles.videoWrapper}></div>
        </div>
      </section>

      {/* Spacer met stacking cards */}
      <div ref={spacerRef} className={styles.spacer}>
        <div ref={cardsContainerRef} className={styles.cardsContainer}>
          {cardData.map((card, index) => (
            <div key={index} className={styles.card}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
