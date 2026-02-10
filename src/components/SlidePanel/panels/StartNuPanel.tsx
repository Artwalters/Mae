'use client';

import { useState, useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';
import styles from './StartNuPanel.module.css';

type Step = 'situatie' | 'verdieping' | 'contact' | 'bevestiging';
type Situatie = 'pijn' | 'fitter' | 'leefstijl' | 'weet-niet' | null;

const VERDIEPING_OPTIONS: Record<string, { question: string; options: string[] }[]> = {
  pijn: [
    {
      question: 'Waar zit de klacht?',
      options: ['Nek / schouder', 'Rug / onderrug', 'Knie', 'Heup', 'Enkel / voet', 'Elleboog / pols', 'Anders'],
    },
    {
      question: 'Hoe lang heb je er al last van?',
      options: ['Minder dan een week', 'Een paar weken', 'Een paar maanden', 'Langer dan een half jaar'],
    },
  ],
  fitter: [
    {
      question: 'Wat wil je bereiken?',
      options: ['Sterker worden', 'Afvallen', 'Betere conditie', 'Terugkomen na blessure', 'Algeheel fitter'],
    },
  ],
  leefstijl: [
    {
      question: 'Waar wil je mee beginnen?',
      options: ['Voeding', 'Meer bewegen', 'Meer energie', 'Beter slapen', 'Stressvermindering', 'Een totale reset'],
    },
  ],
};

export default function StartNuPanel() {
  const { setProgress, setOnBack } = usePanel();
  const [currentStep, setCurrentStep] = useState<Step>('situatie');
  const [situatie, setSituatie] = useState<Situatie>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [extra, setExtra] = useState('');

  const handleSituatie = (choice: Situatie) => {
    setSituatie(choice);
    setAnswers({});
    setCurrentQuestion(0);

    if (choice === 'weet-niet') {
      setCurrentStep('contact');
    } else {
      setCurrentStep('verdieping');
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    const questions = VERDIEPING_OPTIONS[situatie || ''] || [];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentStep('contact');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('bevestiging');
  };

  const goBack = () => {
    if (currentStep === 'bevestiging') {
      setCurrentStep('contact');
    } else if (currentStep === 'contact') {
      if (situatie === 'weet-niet') {
        setCurrentStep('situatie');
      } else {
        setCurrentStep('verdieping');
        const questions = VERDIEPING_OPTIONS[situatie || ''] || [];
        setCurrentQuestion(questions.length - 1);
      }
    } else if (currentStep === 'verdieping') {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      } else {
        setCurrentStep('situatie');
        setSituatie(null);
      }
    }
  };

  const questions = situatie ? VERDIEPING_OPTIONS[situatie] || [] : [];

  // Evenly distributed progress after situatie
  const stepsAfterSituatie =
    situatie === 'weet-niet' ? 2 :
    questions.length > 0 ? questions.length + 2 : 2;

  const currentStepIndex =
    currentStep === 'verdieping' ? 1 + currentQuestion :
    currentStep === 'contact' ? (situatie === 'weet-niet' ? 1 : questions.length + 1) :
    currentStep === 'bevestiging' ? stepsAfterSituatie :
    0;

  useEffect(() => {
    if (currentStep === 'situatie') {
      setProgress(0);
    } else {
      setProgress(currentStepIndex / stepsAfterSituatie);
    }
  }, [currentStep, currentStepIndex, stepsAfterSituatie, setProgress]);

  // Register back handler in header bar
  useEffect(() => {
    if (currentStep === 'situatie') {
      setOnBack(null);
    } else {
      setOnBack(() => goBack);
    }
    return () => setOnBack(null);
  }, [currentStep, currentQuestion, situatie, setOnBack]);

  return (
    <div className={styles.panel}>
      {/* Step 1: Situatie */}
      {currentStep === 'situatie' && (
        <div className={styles.stepContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Start</span>
            <span className={styles.sectionNumber}>[01]</span>
          </div>
          <h2 className={styles.sectionTitle}>Wat speelt er bij jou?</h2>
          <p className={`${styles.subtitle} par`}>
            Kies wat het beste bij je situatie past. Wij stemmen alles af op jou.
          </p>

          <div className={styles.choiceGrid}>
            <div className={styles.choiceCard} onClick={() => handleSituatie('pijn')}>
              <div className={styles.choiceContent}>
                <h3 className={styles.choiceTitle}>Ik heb pijn of een blessure</h3>
                <p className={`${styles.choiceText} par`}>
                  Klachten, blessures of herstel na een operatie
                </p>
              </div>
            </div>

            <div className={styles.choiceCard} onClick={() => handleSituatie('fitter')}>
              <div className={styles.choiceContent}>
                <h3 className={styles.choiceTitle}>Ik wil sterker of fitter worden</h3>
                <p className={`${styles.choiceText} par`}>
                  Krachtiger, betere conditie of terugkomen na een blessure
                </p>
              </div>
            </div>

            <div className={styles.choiceCard} onClick={() => handleSituatie('leefstijl')}>
              <div className={styles.choiceContent}>
                <h3 className={styles.choiceTitle}>Ik wil mijn leefstijl veranderen</h3>
                <p className={`${styles.choiceText} par`}>
                  Meer energie, betere gewoontes, gezonder leven
                </p>
              </div>
            </div>

            <div className={styles.choiceCard} onClick={() => handleSituatie('weet-niet')}>
              <div className={styles.choiceContent}>
                <h3 className={styles.choiceTitle}>Ik weet het nog niet precies</h3>
                <p className={`${styles.choiceText} par`}>
                  Geen probleem — we zoeken het samen uit
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Verdieping */}
      {currentStep === 'verdieping' && questions[currentQuestion] && (
        <div className={styles.stepContent}>

          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Verdieping</span>
            <span className={styles.sectionNumber}>[{String(currentStepIndex).padStart(2, '0')}]</span>
          </div>
          <h2 className={styles.sectionTitle}>{questions[currentQuestion].question}</h2>

          <div className={styles.optionGrid}>
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                className={styles.optionButton}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {currentStep === 'contact' && (
        <div className={styles.stepContent}>

          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Contact</span>
            <span className={styles.sectionNumber}>[{String(currentStepIndex).padStart(2, '0')}]</span>
          </div>
          <h2 className={styles.sectionTitle}>Hoe kunnen we je bereiken?</h2>
          <p className={`${styles.subtitle} par`}>
            We nemen via WhatsApp contact met je op. Kort, persoonlijk en vrijblijvend.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <input
                type="text"
                className={styles.formInput}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Voornaam *"
                required
              />
              <input
                type="text"
                className={styles.formInput}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Achternaam *"
                required
              />
              <input
                type="email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mailadres *"
                required
              />
              <input
                type="tel"
                className={styles.formInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefoonnummer *"
                required
              />
            </div>

            <div className={styles.formDivider} />

            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Extra</span>
              <span className={styles.sectionNumber}>[{String(currentStepIndex + 1).padStart(2, '0')}]</span>
            </div>
            <p className={`${styles.subtitle} par`}>
              Wil je nog iets kwijt? Dat mag hier.
            </p>

            <textarea
              className={styles.formTextarea}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              rows={4}
              placeholder="Bijvoorbeeld: hoe lang je al klachten hebt, wat je al geprobeerd hebt..."
            />

            <div className={styles.formActions}>
              <button type="submit" className={styles.ctaButton}>
                <span>Verstuur</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 4: Bevestiging */}
      {currentStep === 'bevestiging' && (
        <div className={styles.stepContent}>
          <div className={styles.confirmationIcon}>&#10003;</div>
          <h2 className={styles.sectionTitle}>
            Bedankt{firstName ? ` ${firstName}` : ''}!
          </h2>
          <p className={`${styles.confirmationText} par`}>
            We nemen binnen 24 uur contact met je op via WhatsApp.
          </p>
          <div className={styles.confirmationDetails}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Wat kun je verwachten?</span>
            </div>
            <div className={styles.expectationList}>
              <div className={styles.expectationItem}>
                <span className={styles.expectationNumber}>1</span>
                <div className={styles.expectationContent}>
                  <p className="par">Een kort persoonlijk bericht via WhatsApp</p>
                </div>
              </div>
              <div className={styles.expectationItem}>
                <span className={styles.expectationNumber}>2</span>
                <div className={styles.expectationContent}>
                  <p className="par">We bespreken samen wat de beste aanpak is</p>
                </div>
              </div>
              <div className={styles.expectationItem}>
                <span className={styles.expectationNumber}>3</span>
                <div className={styles.expectationContent}>
                  <p className="par">We plannen een eerste afspraak in — vrijblijvend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
