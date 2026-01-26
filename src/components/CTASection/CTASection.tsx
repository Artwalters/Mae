'use client';

import ScrambleText from '@/components/ScrambleText';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section id="cta-section" className={styles.section}>
      <div className={styles.header}>
        <span className="label label-dark">
          [ <ScrambleText retriggerAtEnd>READY?</ScrambleText> ]
        </span>
        <h2 className={styles.title}>
          <span className={styles.titleLine}>ARE YOU READY</span>
          <span className={styles.titleLine}>TO EVOLVE?</span>
        </h2>
      </div>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardLight}`}>
          <h3 className={styles.cardTitle}>Leefstijl</h3>
          <p className={styles.cardText}>
            Meer energie, betere gewoontes en een gezonder leven. Persoonlijke begeleiding die past bij jouw situatie.
          </p>
          <a href="#leefstijl" className={`btn-bar ${styles.cardButton}`}>
            Start je traject
          </a>
        </div>

        <div className={`${styles.card} ${styles.cardAccent}`}>
          <h3 className={styles.cardTitle}>Gecombineerd</h3>
          <p className={styles.cardText}>
            De kracht van beide disciplines. Voor wie het maximale uit zichzelf wil halen, fysiek én mentaal.
          </p>
          <a href="#contact" className={`btn-bar ${styles.cardButton}`}>
            Neem contact op
          </a>
        </div>

        <div className={`${styles.card} ${styles.cardDark}`}>
          <h3 className={styles.cardTitle}>Fysiotherapie</h3>
          <p className={styles.cardText}>
            Herstel van blessures, pijnklachten of na een operatie. Samen werken we aan jouw bewegingsvrijheid en kracht.
          </p>
          <a href="#fysio" className={`btn-bar ${styles.cardButton}`}>
            Maak een afspraak
          </a>
        </div>
      </div>

      {/* Swipe indicator - mobile only */}
      <div className={styles.swipeIndicator} />
    </section>
  );
}
