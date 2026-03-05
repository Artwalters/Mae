'use client';

import { useState, useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';
import styles from './StartNuPanel.module.css';

type Step = 'doel' | 'verdieping' | 'contact' | 'bevestiging';

/* ── Fysio flow (Maarten) ── */

type FysioDoel = 'pijnvrij' | 'sterker' | 'terug-sport' | 'preventie' | null;

const FYSIO_DOELEN: { key: FysioDoel; title: string; text: string }[] = [
  { key: 'pijnvrij', title: 'Pijnvrij bewegen', text: 'Klachten, blessures of herstel na een operatie' },
  { key: 'sterker', title: 'Sterker & krachtiger worden', text: 'Meer kracht opbouwen en je lichaam uitdagen' },
  { key: 'terug-sport', title: 'Terug naar sport na blessure', text: 'Veilig en sterk terugkeren op je oude niveau' },
  { key: 'preventie', title: 'Preventie & optimalisatie', text: 'Blessures voorkomen en je lichaam optimaliseren' },
];

const FYSIO_VERDIEPING: Record<string, { question: string; options: string[] }[]> = {
  pijnvrij: [
    {
      question: 'Waar zit de klacht?',
      options: ['Nek / schouder', 'Rug / onderrug', 'Knie', 'Heup', 'Enkel / voet', 'Elleboog / pols', 'Anders'],
    },
    {
      question: 'Hoe lang heb je er al last van?',
      options: ['Minder dan een week', 'Een paar weken', 'Een paar maanden', 'Langer dan een half jaar'],
    },
  ],
  sterker: [
    {
      question: 'Wat is je ervaring met krachtsport?',
      options: ['Helemaal nieuw', 'Een beetje ervaring', 'Regelmatig getraind', 'Ervaren'],
    },
  ],
  'terug-sport': [
    {
      question: 'Welke sport wil je weer oppakken?',
      options: ['Hardlopen', 'Voetbal / veldsport', 'Krachtsport', 'Racket / slagsport', 'Anders'],
    },
    {
      question: 'Hoe lang geleden was de blessure?',
      options: ['Minder dan een maand', 'Een paar maanden', 'Langer dan een half jaar'],
    },
  ],
  preventie: [
    {
      question: 'Waar wil je je op richten?',
      options: ['Mobiliteit verbeteren', 'Sterker worden', 'Blessurepreventie', 'Algehele optimalisatie'],
    },
  ],
};

/* ── Leefstijl flow (Merel) ── */

type LeefstijlDoel = 'energie' | 'eten' | 'afvallen' | 'gewoontes' | 'reset' | null;

const LEEFSTIJL_DOELEN: { key: LeefstijlDoel; title: string; text: string }[] = [
  { key: 'energie', title: 'Meer energie', text: 'Je wilt je fitter en energieker voelen in het dagelijks leven' },
  { key: 'eten', title: 'Gezonder eten', text: 'Betere voedingskeuzes maken zonder strenge diëten' },
  { key: 'afvallen', title: 'Afvallen', text: 'Op een duurzame manier gewicht verliezen' },
  { key: 'gewoontes', title: 'Betere gewoontes', text: 'Structuur en routine in je dagelijks leven brengen' },
  { key: 'reset', title: 'Een totale reset', text: 'Je hele levensstijl onder de loep nemen en vernieuwen' },
];

const LEEFSTIJL_VERDIEPING: { question: string; options: string[] }[] = [
  {
    question: 'Waar wil je mee beginnen?',
    options: ['Voeding', 'Meer bewegen', 'Beter slapen', 'Stressvermindering'],
  },
];

export default function StartNuPanel() {
  const { panelVariant, activePanel, setProgress, setOnBack } = usePanel();
  const [currentStep, setCurrentStep] = useState<Step>('doel');
  const [fysioDoel, setFysioDoel] = useState<FysioDoel>(null);
  const [leefstijlDoel, setLeefstijlDoel] = useState<LeefstijlDoel>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [extra, setExtra] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset all state when variant changes or panel reopens
  useEffect(() => {
    setCurrentStep('doel');
    setFysioDoel(null);
    setLeefstijlDoel(null);
    setAnswers({});
    setCurrentQuestion(0);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setExtra('');
    setIsSubmitting(false);
    setSubmitError(null);
  }, [panelVariant, activePanel]);

  const isFysio = panelVariant === 'fysio';

  // Get the verdieping questions for the current flow
  const questions = isFysio
    ? FYSIO_VERDIEPING[fysioDoel || ''] || []
    : LEEFSTIJL_VERDIEPING;

  /* ── Handlers ── */

  const handleFysioDoel = (choice: FysioDoel) => {
    setFysioDoel(choice);
    setAnswers({});
    setCurrentQuestion(0);
    setCurrentStep('verdieping');
  };

  const handleLeefstijlDoel = (choice: LeefstijlDoel) => {
    setLeefstijlDoel(choice);
    setAnswers({});
    setCurrentQuestion(0);
    setCurrentStep('verdieping');
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentStep('contact');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const doel = isFysio
      ? FYSIO_DOELEN.find((d) => d.key === fysioDoel)?.title || ''
      : LEEFSTIJL_DOELEN.find((d) => d.key === leefstijlDoel)?.title || '';

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          extra,
          variant: isFysio ? 'fysio' : 'leefstijl',
          doel,
          answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Er ging iets mis.');
      }

      setCurrentStep('bevestiging');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentStep === 'bevestiging') {
      setCurrentStep('contact');
    } else if (currentStep === 'contact') {
      if (questions.length > 0) {
        setCurrentStep('verdieping');
        setCurrentQuestion(questions.length - 1);
      } else {
        setCurrentStep('doel');
      }
    } else if (currentStep === 'verdieping') {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      } else {
        setCurrentStep('doel');
        setFysioDoel(null);
        setLeefstijlDoel(null);
      }
    }
  };

  /* ── Progress ── */

  const totalStepsAfterDoel = questions.length + 2; // verdieping questions + contact + bevestiging

  const currentStepIndex =
    currentStep === 'verdieping' ? 1 + currentQuestion :
    currentStep === 'contact' ? questions.length + 1 :
    currentStep === 'bevestiging' ? totalStepsAfterDoel :
    0;

  useEffect(() => {
    if (currentStep === 'doel') {
      setProgress(0);
    } else {
      setProgress(currentStepIndex / totalStepsAfterDoel);
    }
  }, [currentStep, currentStepIndex, totalStepsAfterDoel, setProgress]);

  // Register back handler
  useEffect(() => {
    if (currentStep === 'doel') {
      setOnBack(null);
    } else {
      setOnBack(() => goBack);
    }
    return () => setOnBack(null);
  }, [currentStep, currentQuestion, fysioDoel, leefstijlDoel, setOnBack]);

  /* ── Render ── */

  const specialist = isFysio ? 'Maarten' : 'Merel';

  return (
    <div className={styles.panel}>
      {/* Step 1: Doel */}
      {currentStep === 'doel' && (
        <div className={styles.stepContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Start</span>
            <span className={styles.sectionNumber}>[01]</span>
          </div>
          <h2 className={styles.sectionTitle}>
            {isFysio ? 'Wat is je doel?' : 'Wat wil je bereiken?'}
          </h2>
          <p className={`${styles.subtitle} par`}>
            {isFysio
              ? 'Kies wat het beste bij je situatie past. Maarten stemt alles af op jou.'
              : 'Kies wat het beste bij je past. Merel stemt alles af op jouw situatie.'}
          </p>

          <div className={styles.choiceGrid}>
            {isFysio
              ? FYSIO_DOELEN.map((d) => (
                  <div key={d.key} className={styles.choiceCard} onClick={() => handleFysioDoel(d.key)}>
                    <div className={styles.choiceContent}>
                      <h3 className={styles.choiceTitle}>{d.title}</h3>
                      <p className={`${styles.choiceText} par`}>{d.text}</p>
                    </div>
                  </div>
                ))
              : LEEFSTIJL_DOELEN.map((d) => (
                  <div key={d.key} className={styles.choiceCard} onClick={() => handleLeefstijlDoel(d.key)}>
                    <div className={styles.choiceContent}>
                      <h3 className={styles.choiceTitle}>{d.title}</h3>
                      <p className={`${styles.choiceText} par`}>{d.text}</p>
                    </div>
                  </div>
                ))}
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
            {specialist} neemt via WhatsApp contact met je op. Kort, persoonlijk en vrijblijvend.
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
              placeholder={isFysio
                ? 'Bijvoorbeeld: hoe lang je al klachten hebt, wat je al geprobeerd hebt...'
                : 'Bijvoorbeeld: wat je al geprobeerd hebt, wat je het moeilijkst vindt...'}
            />

            {submitError && (
              <p className={styles.formError}>{submitError}</p>
            )}

            <div className={styles.formActions}>
              <button type="submit" className={styles.ctaButton} disabled={isSubmitting}>
                <span>{isSubmitting ? 'Versturen...' : 'Verstuur'}</span>
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
            {specialist} neemt binnen 24 uur contact met je op via WhatsApp.
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
                  <p className="par">
                    {isFysio
                      ? 'Maarten bespreekt samen met jou de beste aanpak'
                      : 'Merel bespreekt samen met jou de beste aanpak'}
                  </p>
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
