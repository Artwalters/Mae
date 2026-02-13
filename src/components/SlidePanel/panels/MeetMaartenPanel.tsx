'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './MeetMaartenPanel.module.css';
import basePath from '@/lib/basePath';

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
      </div>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img src={`${basePath}/img/maarten.png`} alt="Maarten" className="img-cover" />
      </div>

      {/* Over Maarten Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Over Maarten</span>
          <span className={styles.aboutNumber}>[01]</span>
        </div>
        <div className={styles.aboutText}>
          <p className={`${styles.text} par`}>
            Mijn naam is Maarten en ik ben een enthousiast krachtsporter, fysiotherapeut en personal coach. Van jongs af aan heb ik altijd veel moeite gehad met stilzitten, zoekend naar nieuwe uitdagingen en gefascineerd door de kracht en mogelijkheden van het menselijk lichaam. Deze fascinatie heeft zich ontwikkeld tot een diepe passie voor krachtsport, die de basis vormt voor mijn professionele leven.
          </p>
          <p className={`${styles.text} par`}>
            Mijn aanpak gaat verder dan het standaard behandelprotocol; ik streef ernaar om een plan te creëren dat perfect is afgestemd op de unieke behoeften van de individuele cliënt. Ik zie elk obstakel als een mogelijkheid. In de huidige zorgpraktijk merk ik dat er vaak te snel grenzen worden gesteld aan wat cliënten kunnen bereiken. Hier zet ik mij tegen af door niet alleen te focussen op wat tijdelijk onmogelijk lijkt, maar door actief oplossingen en alternatieven te zoeken.
          </p>
          <p className={`${styles.text} par`}>
            Van de dakdekker met aanhoudende rugklachten tot de sporter met een scheve rug, ik ben ervan overtuigd dat met de juiste benadering en begeleiding, iedereen kan werken aan een leven vrij van belemmeringen.
          </p>
        </div>
        <div className={styles.photoGrid}>
          <div className={styles.photo}>
            <img src={`${basePath}/img/maarten.png`} alt="Maarten" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src={`${basePath}/img/run.png`} alt="Training" className="img-cover" />
          </div>
          <div className={styles.photo}>
            <img src={`${basePath}/img/RICKv2.png`} alt="Sessie" className="img-cover" />
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
              <h4 className={styles.stepTitle}>Intake, screening & onderzoek</h4>
              <p className={`${styles.stepText} par`}>Tijdens het intakegesprek bespreken we waar jij staat en waar je naartoe wilt. We doen een screening om ernstige oorzaken uit te sluiten, gevolgd door een lichamelijk en bewegingsonderzoek om de basis van je klacht in kaart te brengen.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Persoonlijk revalidatieplan</h4>
              <p className={`${styles.stepText} par`}>Na de intake ontvang je een op maat gemaakt revalidatieplan, volledig aangepast op wat jouw lichaam op dat moment aankan. Dit plan wordt elke week geüpdatet zodat je altijd traint op een niveau dat bij jou past.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Wekelijks online contactmoment</h4>
              <p className={`${styles.stepText} par`}>Wekelijks bespreken we hoe de uitvoering van je plan is verlopen. Je kunt trainingsvideo&apos;s insturen voor concrete feedback en pijnscores bijhouden zodat we het plan continu kunnen afstemmen.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>4</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Maandelijkse fysieke afspraak</h4>
              <p className={`${styles.stepText} par`}>Iedere maand plannen we een persoonlijke afspraak van een uur om je voortgang te evalueren en samen verder te werken aan je herstel. In overleg is vaker mogelijk.</p>
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
        <p className={`${styles.ctaText} par`}>
          Klaar om te beginnen? Plan een vrijblijvend kennismakingsgesprek.
        </p>
        <a href="#contact" className={styles.ctaButton}>
          <span>Plan een afspraak</span>
        </a>
      </section>
    </div>
  );
}
