'use client';

import { usePanel } from '@/context/PanelContext';
import styles from './CTASection.module.css';

export default function CTASection() {
  const { openPanel } = usePanel();
  return (
    <section id="cta-section" className={styles.section}>
      <div className={styles.header}>
        <span className="label label-dark">
          [ START NOW ]
        </span>
        <h2 className={styles.title}>
          <span className={styles.titleLine}>ARE YOU READY</span>
          <span className={styles.titleLine}>TO E<span style={{ fontFeatureSettings: '"ss02" 1' }}>V</span>OL<span style={{ fontFeatureSettings: '"ss02" 1' }}>V</span>E?</span>
        </h2>
      </div>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardLight}`}>
          <h3 className={styles.cardTitle}>Leefstijl</h3>
          <p className={`${styles.cardText} par`}>
            Bouw aan een sterker fundament. Persoonlijke begeleiding voor meer energie, betere gewoontes en duurzame resultaten.
          </p>
          <button className={`btn-bar ${styles.cardButton}`} onClick={() => openPanel('start-nu', 'leefstijl')}>
            Start je traject
          </button>
        </div>

        <div className={`${styles.card} ${styles.cardAccent}`}>
          <h3 className={styles.cardTitle}>Compleet overzicht</h3>
          <p className={`${styles.cardText} par`}>
            Ontdek het volledige aanbod op HAL 13. Van coaching en training tot revalidatie — alles onder één dak.
          </p>
          <a href="https://www.hal13.nl/" target="_blank" rel="noopener noreferrer" className={`btn-bar ${styles.cardButton}`}>
            Bekijk alle diensten
          </a>
        </div>

        <div className={`${styles.card} ${styles.cardDark}`}>
          <h3 className={styles.cardTitle}>Fysiotherapie</h3>
          <p className={`${styles.cardText} par`}>
            Gericht herstel en preventie. Samen werken we aan jouw bewegingsvrijheid, kracht en een pijnvrij lichaam.
          </p>
          <button className={`btn-bar ${styles.cardButton}`} onClick={() => openPanel('start-nu', 'fysio')}>
            Start je traject
          </button>
        </div>
      </div>

      {/* Swipe indicator - mobile only */}
      <div className={styles.swipeIndicator} />
    </section>
  );
}
