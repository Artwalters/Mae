'use client';

import styles from './MeetMaartenPanel.module.css';

export default function MeetMaartenPanel() {
  return (
    <div className={styles.panel}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          <img src="/img/maarten.png" alt="Maarten" className={styles.image} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.label}>[ Personal Trainer & Fysiotherapeut ]</span>
          <h2 className={styles.name}>Maarten</h2>
          <p className={styles.tagline}>Beweging is de sleutel tot een gezond leven</p>
        </div>
      </div>

      {/* Introduction */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Over Mij</h3>
        <p className={styles.text}>
          Als gecertificeerd fysiotherapeut en personal trainer combineer ik het beste van beide werelden.
          Met meer dan 8 jaar ervaring in de sport- en gezondheidssector heb ik een unieke aanpak ontwikkeld
          die verder gaat dan standaard behandelingen.
        </p>
        <p className={styles.text}>
          Mijn filosofie is simpel: ik geloof niet in beperkingen opleggen, maar in mogelijkheden creëren.
          Of je nu herstelt van een blessure, je prestaties wilt verbeteren, of gewoon fitter wilt worden -
          samen vinden we de weg die bij jou past.
        </p>
      </section>

      {/* Work Method */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Mijn Aanpak</h3>
        <div className={styles.methodGrid}>
          <div className={styles.methodCard}>
            <span className={styles.methodNumber}>01</span>
            <h4 className={styles.methodTitle}>Intake & Analyse</h4>
            <p className={styles.methodText}>
              We beginnen met een uitgebreide intake waarin ik je fysieke conditie,
              doelen en eventuele beperkingen in kaart breng.
            </p>
          </div>
          <div className={styles.methodCard}>
            <span className={styles.methodNumber}>02</span>
            <h4 className={styles.methodTitle}>Persoonlijk Plan</h4>
            <p className={styles.methodText}>
              Op basis van de analyse stel ik een volledig op maat gemaakt plan op
              dat past bij jouw niveau en levensstijl.
            </p>
          </div>
          <div className={styles.methodCard}>
            <span className={styles.methodNumber}>03</span>
            <h4 className={styles.methodTitle}>Begeleiding</h4>
            <p className={styles.methodText}>
              Tijdens de sessies werk ik intensief met je samen, waarbij ik
              technieken uitleg en direct feedback geef.
            </p>
          </div>
          <div className={styles.methodCard}>
            <span className={styles.methodNumber}>04</span>
            <h4 className={styles.methodTitle}>Evaluatie & Bijsturing</h4>
            <p className={styles.methodText}>
              Regelmatige evaluaties zorgen ervoor dat we het plan aanpassen
              aan jouw voortgang en veranderende behoeften.
            </p>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Specialisaties</h3>
        <div className={styles.specList}>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </span>
            <span className={styles.specText}>Sportblessures & Revalidatie</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </span>
            <span className={styles.specText}>Strength & Conditioning</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10"/>
                <path d="M12 20V4"/>
                <path d="M6 20v-6"/>
              </svg>
            </span>
            <span className={styles.specText}>Performance Training</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </span>
            <span className={styles.specText}>Leefstijlcoaching</span>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Diploma's & Certificeringen</h3>
        <ul className={styles.credentialsList}>
          <li className={styles.credential}>
            <span className={styles.credentialYear}>2016</span>
            <span className={styles.credentialText}>Bachelor Fysiotherapie - Hogeschool Rotterdam</span>
          </li>
          <li className={styles.credential}>
            <span className={styles.credentialYear}>2018</span>
            <span className={styles.credentialText}>Master Sports Physiotherapy</span>
          </li>
          <li className={styles.credential}>
            <span className={styles.credentialYear}>2019</span>
            <span className={styles.credentialText}>Certified Strength & Conditioning Specialist (CSCS)</span>
          </li>
          <li className={styles.credential}>
            <span className={styles.credentialYear}>2020</span>
            <span className={styles.credentialText}>Dry Needling Certificaat</span>
          </li>
          <li className={styles.credential}>
            <span className={styles.credentialYear}>2022</span>
            <span className={styles.credentialText}>Leefstijlcoach Certificering</span>
          </li>
        </ul>
      </section>

      {/* Quote */}
      <section className={styles.quoteSection}>
        <blockquote className={styles.quote}>
          "Mijn doel is niet om je afhankelijk te maken van mij, maar om je de
          tools te geven waarmee je zelf de regie over je gezondheid neemt."
        </blockquote>
        <span className={styles.quoteAuthor}>— Maarten</span>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h3 className={styles.ctaTitle}>Klaar om te beginnen?</h3>
        <p className={styles.ctaText}>
          Plan een vrijblijvend kennismakingsgesprek en ontdek hoe ik je kan helpen.
        </p>
        <a href="#contact" className={styles.ctaButton}>
          <span>Plan een afspraak</span>
        </a>
      </section>
    </div>
  );
}
