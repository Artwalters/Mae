'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './MeetMaartenPanel.module.css';

const credentials = [
  { year: '2018', text: 'Bachelor Trainingskunde' },
  { year: '2020', text: 'Voedingscoach Certificering' },
  { year: '2021', text: 'Leefstijlcoach Certificering' },
  { year: '2023', text: 'Personal Coach Certificering' },
];

export default function MeetMerelPanel() {
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
        <h2 className={styles.name}>Merel</h2>
      </div>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img src="/img/maarten.png" alt="Merel" className="img-cover" />
      </div>

      {/* Over Merel Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Over Merel</span>
          <span className={styles.aboutNumber}>[01]</span>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5+</span>
            <span className={styles.statLabel}>Jaar ervaring</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>200+</span>
            <span className={styles.statLabel}>Cliënten</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Persoonlijk</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>Diëten</span>
          </div>
        </div>
        <div className={styles.aboutText}>
          <p className={styles.text}>
            Als leefstijlcoach en krachtsporter heb ik uit eigen ervaring geleerd hoe cruciaal een gezonde
            verbinding met voeding en beweging is. Mijn eigen worsteling heeft mij doen inzien hoe deze
            aspecten kunnen bijdragen aan herstel, zowel fysiek als mentaal.
          </p>
          <p className={styles.text}>
            Ik geloof niet in diëten, maar in duurzame verandering. Samen werken we aan een levensstijl
            die past bij jouw identiteit en waarden, waarin zelfacceptatie centraal staat.
          </p>
        </div>
        <div className={styles.photoGrid}>
          <div className={styles.photo}>
            <img src="/img/maarten.png" alt="Merel" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src="/img/run.png" alt="Training" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src="/img/RICKv2.png" alt="Coaching" className="img-cover" />
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
              <h4 className={styles.stepTitle}>Intake & Basismeting</h4>
              <p className={styles.stepText}>We brengen jouw volledige levensstijl in kaart: slaap, beweging, voeding, werk en privé. Samen stellen we doelen op en doen een basismeting.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Persoonlijk Plan</h4>
              <p className={styles.stepText}>Je ontvangt een gepersonaliseerd leefstijlplan, voedingsplan en trainingsschema. Geen standaard dieet, maar een aanpak die bij jou past.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Technieksessie</h4>
              <p className={styles.stepText}>We nemen alle oefeningen samen door zodat je weet hoe je ze correct uitvoert. Dit minimaliseert blessures en maximaliseert resultaat.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>4</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Wekelijkse Begeleiding</h4>
              <p className={styles.stepText}>Via wekelijkse contactmomenten en maandelijkse evaluaties houden we je voortgang bij en passen we het plan aan waar nodig.</p>
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
          <div className={styles.timelineMain}>
            <div className={styles.timelineTitleWrapper}>
              <h3 ref={titleRef} className={styles.timelineTitle}>
                {credentials[activeCredential].text}
              </h3>
            </div>
          </div>
          <div className={styles.timelineNav}>
            <button className={styles.timelineArrow} onClick={goToPrev}>
              <span>&#8592;</span>
            </button>
            <button className={styles.timelineArrow} onClick={goToNext}>
              <span>&#8594;</span>
            </button>
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
          Klaar voor een duurzame verandering? Plan een vrijblijvend kennismakingsgesprek.
        </p>
        <a href="#contact" className={styles.ctaButton}>
          <span>Plan een afspraak</span>
        </a>
      </section>
    </div>
  );
}
