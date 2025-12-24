'use client';

import styles from './HerstelSection.module.css';

export default function HerstelSection() {
  return (
    <section className={styles.section}>
      {/* Left Content */}
      <div className={styles.content}>
        <span className={styles.label}>Fysiotherapie</span>
        <h2 className={styles.title}>Herstel</h2>
        <p className={styles.description}>
          Bij M.A.E. Fysiotherapie kijken we anders naar revalidatie. Waar veel
          zorgprofessionals vooral beperkingen opleggen, geloven wij in een
          doelgerichte, persoonlijke en stapsgewijze aanpak. Het doel: jou weer
          laten functioneren zonder belemmeringen.
        </p>
        <div className={styles.accentBar} />
      </div>

      {/* Right Image */}
      <div className={styles.imageContainer}>
        <div className={styles.banner}>
          <div className={styles.bannerIcon} />
          <p className={styles.bannerText}>Meet Fysiotherapeut Maarten</p>
        </div>
        <img
          src="/img/run.png"
          alt="Hardlopers tijdens marathon"
          className={styles.image}
        />
      </div>
    </section>
  );
}
