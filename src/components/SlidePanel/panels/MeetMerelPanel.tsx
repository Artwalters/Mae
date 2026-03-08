'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { usePanel } from '@/context/PanelContext';
import styles from './MeetMaartenPanel.module.css';
import cdn from '@/lib/cdn';

const credentials = [
  { year: '2025', text: 'Sportkunde' },
];

export default function MeetMerelPanel() {
  const [activeCredential, setActiveCredential] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { openPanel, setPanelStep } = usePanel();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

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

  // Track which section is visible and update navBar step number
  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setPanelStep(String(idx + 1).padStart(2, '0'));
          }
        }
      },
      { threshold: 0.5, root: sections[0]?.closest('[data-lenis-prevent]') }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [setPanelStep]);

  return (
    <div className={styles.panel}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h2 className={styles.name}>Merel</h2>
      </div>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img src={`${cdn}/merel-consult.webp`} alt="Merel leefstijlcoach bij MAE in gesprek met cliënt" className="img-cover" style={{ objectPosition: 'center 5%' }} />
      </div>

      {/* Over Merel Section */}
      <section ref={(el) => { sectionsRef.current[0] = el; }} className={styles.aboutSection}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Over Merel</span>
          <span className={styles.aboutNumber}>[01]</span>
        </div>
        <h3 className={styles.aboutSubtitle}>Transformatie vanuit ervaring</h3>
        <div className={styles.aboutText}>
          <p className={styles.text}>
            Mijn naam is Merel en ik ben fervent krachtsporter, leefstijlcoach en personal coach. Ondanks mijn langdurige haat-liefde relatie met sport en voeding, heb ik geleerd hoe cruciaal een gezonde verbinding met deze aspecten is, zowel fysiek als mentaal. Mijn eigen worsteling met zelfbeeld en gezondheid heeft mij doen inzien hoe voeding en beweging kunnen bijdragen aan herstel, zowel in tijden van fysieke als mentale ziekte.
          </p>
          <p className={styles.text}>
            Uit deze persoonlijke ervaring is een diepgewortelde liefde ontstaan om anderen te helpen bij het bereiken van een gezonder en meer gebalanceerd leven, waarbij zelfacceptatie centraal staat. Ik deel graag mijn geleerde lessen en ondersteun anderen bij hun transformatie naar een gezondere levensstijl.
          </p>
        </div>
        <div className={styles.photoGrid}>
          <div className={styles.photo}>
            <img src={`${cdn}/merel-coaching.webp`} alt="Merel begeleidt cliënt bij leefstijlcoaching" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src={`${cdn}/merel-training.webp`} alt="Merel begeleidt functionele training bij MAE" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src={`${cdn}/merel-meting.webp`} alt="Lichaamsmeting als onderdeel van leefstijlcoaching" className="img-cover" />
          </div>
        </div>
      </section>

      {/* Work Method */}
      <section ref={(el) => { sectionsRef.current[1] = el; }} className={styles.section}>
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
      <section ref={(el) => { sectionsRef.current[2] = el; }} className={styles.section}>
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
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeMiterlimit="10" style={{ transform: 'scaleX(-1)' }}>
                <path d="M14 19L21 12L14 5" />
                <path d="M21 12H2" />
              </svg>
            </button>
            <button className={styles.timelineArrow} onClick={goToNext}>
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeMiterlimit="10">
                <path d="M14 19L21 12L14 5" />
                <path d="M21 12H2" />
              </svg>
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
        <button className={styles.ctaButton} onClick={() => openPanel('start-nu', 'leefstijl')}>
          <span>Start Traject</span>
        </button>
      </section>
    </div>
  );
}
