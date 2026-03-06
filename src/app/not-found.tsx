'use client';

import Link from 'next/link';
import ParticleHero from '@/components/ParticleHero';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.logoContainer}>
          <ParticleHero />
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.message}>Deze pagina bestaat niet.</p>
        <Link href="/" className="btn-accent">
          <span>Terug naar home</span>
        </Link>
      </div>
    </div>
  );
}
