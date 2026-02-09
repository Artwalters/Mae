'use client';

import { useState } from 'react';
import styles from './StartNuPanel.module.css';

type Step = 'choice' | 'fysio' | 'leefstijl' | 'contact';

export default function StartNuPanel() {
  const [currentStep, setCurrentStep] = useState<Step>('choice');
  const [selectedPath, setSelectedPath] = useState<'fysio' | 'leefstijl' | null>(null);

  const handleChoice = (choice: 'fysio' | 'leefstijl') => {
    setSelectedPath(choice);
    setCurrentStep(choice);
  };

  const goToContact = () => {
    setCurrentStep('contact');
  };

  const goBack = () => {
    if (currentStep === 'contact') {
      setCurrentStep(selectedPath || 'choice');
    } else {
      setCurrentStep('choice');
      setSelectedPath(null);
    }
  };

  return (
    <div className={styles.panel}>
      {/* Step 1: Choice */}
      {currentStep === 'choice' && (
        <div className={styles.stepContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Keuze</span>
            <span className={styles.sectionNumber}>[01]</span>
          </div>
          <h2 className={styles.sectionTitle}>Waar kunnen we je mee helpen?</h2>

          <div className={styles.choiceGrid}>
            <div className={styles.choiceCard} onClick={() => handleChoice('fysio')}>
              <div className={styles.choiceContent}>
                <h3 className={styles.choiceTitle}>Fysiotherapie</h3>
                <p className={styles.choiceText}>
                  Herstel van blessures, pijnklachten, of revalidatie na een operatie
                </p>
              </div>
              <button className="btn-bar">Start traject</button>
            </div>

            <div className={styles.choiceCard} onClick={() => handleChoice('leefstijl')}>
              <div className={styles.choiceContent}>
                <h3 className={styles.choiceTitle}>Leefstijl Coaching</h3>
                <p className={styles.choiceText}>
                  Meer energie, betere gewoontes en een gezondere levensstijl
                </p>
              </div>
              <button className="btn-bar">Start traject</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2a: Fysiotherapie Info */}
      {currentStep === 'fysio' && (
        <div className={styles.stepContent}>
          <button className={styles.backButton} onClick={goBack}>
            <span>&#8592;</span>
          </button>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Fysiotherapie</span>
            <span className={styles.sectionNumber}>[02]</span>
          </div>
          <h2 className={styles.sectionTitle}>Wat kun je verwachten?</h2>

          <div className={styles.expectationList}>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>1</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Intake gesprek (45 min)</h4>
                <p className={styles.expectationText}>We bespreken je klachten, doelen en medische geschiedenis</p>
              </div>
            </div>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>2</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Fysiek onderzoek</h4>
                <p className={styles.expectationText}>Grondige analyse van je bewegingspatronen en pijnpunten</p>
              </div>
            </div>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>3</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Behandelplan</h4>
                <p className={styles.expectationText}>Een persoonlijk plan met concrete doelen en tijdlijn</p>
              </div>
            </div>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>4</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Behandelingen</h4>
                <p className={styles.expectationText}>Sessies van 30-45 minuten, meestal 1-2x per week</p>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Tarieven & Vergoeding</span>
              <span className={styles.sectionNumber}>[03]</span>
            </div>
            <div className={styles.priceGrid}>
              <div className={styles.priceItem}>
                <span className={styles.priceAmount}>€65</span>
                <span className={styles.priceDescription}>Intake + eerste behandeling</span>
              </div>
              <div className={styles.priceItem}>
                <span className={styles.priceAmount}>€45</span>
                <span className={styles.priceDescription}>Vervolgbehandeling (30 min)</span>
              </div>
            </div>
            <p className={styles.priceNote}>
              Fysiotherapie wordt vaak (deels) vergoed vanuit je aanvullende verzekering.
              Check je polis of neem contact op voor meer informatie.
            </p>
          </section>

          <button className={styles.ctaButton} onClick={goToContact}>
            <span>Maak een afspraak</span>
          </button>
        </div>
      )}

      {/* Step 2b: Leefstijl Info */}
      {currentStep === 'leefstijl' && (
        <div className={styles.stepContent}>
          <button className={styles.backButton} onClick={goBack}>
            <span>&#8592;</span>
          </button>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Leefstijl Coaching</span>
            <span className={styles.sectionNumber}>[02]</span>
          </div>
          <h2 className={styles.sectionTitle}>Wat kun je verwachten?</h2>

          <div className={styles.expectationList}>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>1</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Kennismakingsgesprek (gratis)</h4>
                <p className={styles.expectationText}>We bespreken je situatie en kijken of we een match zijn</p>
              </div>
            </div>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>2</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Uitgebreide intake</h4>
                <p className={styles.expectationText}>Analyse van je huidige leefstijl, gewoontes en doelen</p>
              </div>
            </div>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>3</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Persoonlijk plan</h4>
                <p className={styles.expectationText}>Stapsgewijze aanpak voor voeding, beweging en mindset</p>
              </div>
            </div>
            <div className={styles.expectationItem}>
              <span className={styles.expectationNumber}>4</span>
              <div className={styles.expectationContent}>
                <h4 className={styles.expectationTitle}>Begeleiding & Support</h4>
                <p className={styles.expectationText}>Wekelijkse check-ins en onbeperkt contact via WhatsApp</p>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Trajecten</span>
              <span className={styles.sectionNumber}>[03]</span>
            </div>
            <div className={styles.packageGrid}>
              <div className={styles.packageCard}>
                <h4 className={styles.packageTitle}>Kickstart</h4>
                <p className={styles.packageDuration}>4 weken</p>
                <p className={styles.packagePrice}>€249</p>
                <ul className={styles.packageFeatures}>
                  <li>Intake + eindgesprek</li>
                  <li>Persoonlijk plan</li>
                  <li>WhatsApp support</li>
                </ul>
              </div>
              <div className={`${styles.packageCard} ${styles.packageFeatured}`}>
                <span className={styles.packageBadge}>Populair</span>
                <h4 className={styles.packageTitle}>Transform</h4>
                <p className={styles.packageDuration}>12 weken</p>
                <p className={styles.packagePrice}>€599</p>
                <ul className={styles.packageFeatures}>
                  <li>Alles van Kickstart</li>
                  <li>Wekelijkse coaching</li>
                  <li>Voortgangsmetingen</li>
                  <li>Trainingsschema</li>
                </ul>
              </div>
            </div>
          </section>

          <button className={styles.ctaButton} onClick={goToContact}>
            <span>Plan een kennismaking</span>
          </button>
        </div>
      )}

      {/* Step 3: Contact Form */}
      {currentStep === 'contact' && (
        <div className={styles.stepContent}>
          <button className={styles.backButton} onClick={goBack}>
            <span>&#8592;</span>
          </button>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Contact</span>
            <span className={styles.sectionNumber}>[03]</span>
          </div>
          <h2 className={styles.sectionTitle}>Laten we kennismaken</h2>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Voornaam *</label>
                <input type="text" className={styles.formInput} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Achternaam *</label>
                <input type="text" className={styles.formInput} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>E-mail *</label>
              <input type="email" className={styles.formInput} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Telefoon</label>
              <input type="tel" className={styles.formInput} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Waar kunnen we je mee helpen?</label>
              <textarea className={styles.formTextarea} rows={4} placeholder="Vertel kort over je situatie en doelen..." />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Voorkeur voor contact</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="contact" value="email" defaultChecked />
                  <span>E-mail</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="contact" value="phone" />
                  <span>Telefoon</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="contact" value="whatsapp" />
                  <span>WhatsApp</span>
                </label>
              </div>
            </div>

            <button type="submit" className={styles.ctaButton}>
              <span>Verstuur aanvraag</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
