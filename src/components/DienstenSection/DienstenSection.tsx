'use client';

import styles from './DienstenSection.module.css';

const diensten = [
  {
    id: '01',
    title: 'Fysiotherapie',
    description: 'Meer dan een behandelplan. We kijken verder dan de symptomen en beginnen met écht luisteren. Wat zegt je lichaam? Waar zit de belemmering?',
    features: ['Bewegingsonderzoek', 'Persoonlijk revalidatieplan', 'Begeleiding via WhatsApp', 'Geen standaardprotocols'],
  },
  {
    id: '02',
    title: 'Personal Training',
    description: 'Op maat gemaakte trainingen om jouw doelen te bereiken. Of je nu wilt afvallen, sterker worden of je conditie verbeteren.',
    features: ['1-op-1 begeleiding', 'Aangepast schema', 'Voortgangsmetingen', 'Motivatie coaching'],
  },
  {
    id: '03',
    title: 'Leefstijl Coaching',
    description: 'Holistische aanpak voor een gezondere en actievere levensstijl. Wij kijken naar voeding, beweging, slaap en stress.',
    features: ['Voedingsadvies', 'Gedragsverandering', 'Stressmanagement', 'Slaapoptimalisatie'],
  },
  {
    id: '04',
    title: 'Sport Revalidatie',
    description: 'Doelgerichte en persoonlijke revalidatie om belemmeringsvrij te functioneren en je weer krachtig in je lijf te voelen.',
    features: ['Return to sport', 'Krachttraining', 'Conditieopbouw', 'Blessurepreventie'],
  },
];

export default function DienstenSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.label}>Onze diensten</span>
          <h2 className={styles.title}>WAT WIJ BIEDEN</h2>
          <p className={`${styles.intro} par`}>
            Bij MAE combineren we fysiotherapie, personal training en leefstijlcoaching
            voor een complete aanpak van jouw gezondheid en prestaties.
          </p>
        </header>

        <div className={styles.grid}>
          {diensten.map((dienst) => (
            <article key={dienst.id} className={styles.card}>
              <span className={styles.cardNumber}>{dienst.id}</span>
              <h3 className={styles.cardTitle}>{dienst.title}</h3>
              <p className={`${styles.cardDescription} par`}>{dienst.description}</p>
              <ul className={styles.featureList}>
                {dienst.features.map((feature, index) => (
                  <li key={index} className={styles.feature}>{feature}</li>
                ))}
              </ul>
              <button className={styles.cardButton}>Meer info</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
