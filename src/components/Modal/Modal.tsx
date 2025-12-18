'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Modal.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Modal() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal || !isVisible) return;

    const trigger = gsap.to(modal, {
      x: '150%',
      scrollTrigger: {
        trigger: '.scaling-section',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.5,
      },
    });

    return () => {
      trigger.scrollTrigger?.kill();
    };
  }, [isVisible]);

  const handleClose = () => {
    const modal = modalRef.current;
    if (!modal) return;

    gsap.to(modal, {
      x: '150%',
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => setIsVisible(false),
    });
  };

  if (!isVisible) return null;

  return (
    <div ref={modalRef} className={styles.modal}>
      <button className={styles.modalClose} aria-label="Sluiten" onClick={handleClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={styles.modalLogos}>
        <img src="/icons/mae.svg" alt="MAE" className={styles.modalLogo} />
        <span className={styles.modalDivider}>|</span>
        <img src="/icons/hal13.svg" alt="HAL XIII" className={styles.modalLogoHal} />
      </div>
      <p className={styles.modalText}>
        Voor een complete benadering van gezondheid en fitness combineren wij fysiotherapeutische zorg met professionele coaching en trainingsmogelijkheden.
      </p>
      <div className={styles.modalLinks}>
        <a href="#" className="btn-bar" onClick={handleClose}>Blijf hier voor fysiotherapie</a>
        <a href="https://hal13.nl" target="_blank" rel="noopener noreferrer" className="btn-bar">Bekijk het volledige aanbod bij HAL XIII</a>
      </div>
    </div>
  );
}
