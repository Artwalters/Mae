'use client';

import styles from './ShowreelSection.module.css';
import basePath from '@/lib/basePath';

export default function ShowreelSection() {
  return (
    <section className={styles.section}>
      <div className={styles.contentWrap}>
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            src={`${basePath}/img/hero.mp4`}
            autoPlay
            muted
            loop
            playsInline
          />
          <img
            src={`${basePath}/img/sticker.png`}
            alt="MAE sticker"
            className={styles.sticker}
          />
        </div>
        <img
          src={`${basePath}/img/type-banner.png`}
          alt=""
          className={styles.typeBanner}
        />
      </div>
    </section>
  );
}
