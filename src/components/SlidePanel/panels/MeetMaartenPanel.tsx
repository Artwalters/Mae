'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './MeetMaartenPanel.module.css';

const credentials = [
  { year: '2016', text: 'Bachelor Fysiotherapie' },
  { year: '2018', text: 'Master Sports Physiotherapy' },
  { year: '2019', text: 'Certified Strength & Conditioning Specialist' },
  { year: '2022', text: 'Leefstijlcoach Certificering' },
];

export default function MeetMaartenPanel() {
  const [activeCredential, setActiveCredential] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        titleRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeCredential]);

  const animateAndChange = (newIndex: number) => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: '-100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setActiveCredential(newIndex),
      });
    }
  };

  const goToPrev = () => {
    const newIndex = activeCredential > 0 ? activeCredential - 1 : credentials.length - 1;
    animateAndChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeCredential < credentials.length - 1 ? activeCredential + 1 : 0;
    animateAndChange(newIndex);
  };

  const handleTimelineClick = (index: number) => {
    if (index !== activeCredential) {
      animateAndChange(index);
    }
  };

  return (
    <div className={styles.panel}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h2 className={styles.name}>Maarten</h2>
        <span className={styles.heroLabel}>Over Maarten</span>
      </div>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img src="/img/maarten.png" alt="Maarten" className="img-cover" />
      </div>

      {/* Over Maarten Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Over Maarten</span>
          <span className={styles.aboutNumber}>[01]</span>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>8+</span>
            <span className={styles.statLabel}>Jaar actief</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Cliënten</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1500+</span>
            <span className={styles.statLabel}>Sessies</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>2</span>
            <span className={styles.statLabel}>Disciplines</span>
          </div>
        </div>
        <div className={styles.aboutText}>
          <p className={styles.text}>
            Als gecertificeerd fysiotherapeut en personal trainer combineer ik het beste van beide werelden.
            Mijn filosofie is simpel: ik geloof niet in beperkingen opleggen, maar in mogelijkheden creëren.
          </p>
          <p className={styles.text}>
            Of je nu herstelt van een blessure, je prestaties wilt verbeteren, of gewoon fitter wilt worden -
            samen vinden we de weg die bij jou past.
          </p>
        </div>
        <div className={styles.photoGrid}>
          <div className={styles.photo}>
            <img src="/img/maarten.png" alt="Maarten" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src="/img/run.png" alt="Training" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src="/img/RICKv2.png" alt="Sessie" className="img-cover" />
          </div>
        </div>
      </section>

      {/* Work Method */}
      <section className={styles.section}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Werkwijze</span>
          <span className={styles.aboutNumber}>[02]</span>
        </div>
        <div className={styles.stepsList}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Intake & Analyse</h4>
              <p className={styles.stepText}>We beginnen met een uitgebreide intake waarin ik je fysieke conditie, doelen en eventuele beperkingen in kaart breng.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Persoonlijk Plan</h4>
              <p className={styles.stepText}>Op basis van de analyse stel ik een volledig op maat gemaakt plan op dat past bij jouw niveau en levensstijl.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Begeleiding</h4>
              <p className={styles.stepText}>Tijdens de sessies werk ik intensief met je samen, waarbij ik technieken uitleg en direct feedback geef.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>4</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Evaluatie & Bijsturing</h4>
              <p className={styles.stepText}>Regelmatige evaluaties zorgen ervoor dat we het plan aanpassen aan jouw voortgang.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Timeline */}
      <section className={styles.section}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Certificeringen</span>
          <span className={styles.aboutNumber}>[03]</span>
        </div>

        <div className={styles.timelineContent}>
          <div className={styles.timelineNav}>
            <button className={styles.timelineArrow} onClick={goToPrev}>
              <span>&#8592;</span>
            </button>
            <button className={styles.timelineArrow} onClick={goToNext}>
              <span>&#8594;</span>
            </button>
          </div>
          <div className={styles.timelineMain}>
            <h3 ref={titleRef} className={styles.timelineTitle}>
              {credentials[activeCredential].text}
            </h3>
          </div>
        </div>

        <div className={styles.timeline}>
          {credentials.map((cred, index) => (
            <button
              key={cred.year}
              className={`${styles.timelineItem} ${index === activeCredential ? styles.timelineItemActive : ''}`}
              onClick={() => handleTimelineClick(index)}
            >
              <span className={styles.timelineYear}>{cred.year}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <p className={styles.ctaText}>
          Klaar om te beginnen? Plan een vrijblijvend kennismakingsgesprek.
        </p>
        <a href="#contact" className={styles.ctaButton}>
          <span>Plan een afspraak</span>
        </a>
      </section>
    </div>
  );
}
