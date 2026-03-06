'use client';

import styles from './ShowreelSection.module.css';
import cdn from '@/lib/cdn';

export default function ShowreelSection() {
  return (
    <section className={styles.section}>
      <div className={styles.contentWrap}>
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            src={`${cdn}/hero.mp4`}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
