'use client';

import { useState, useCallback } from 'react';
import { useAutoplayRetry } from '@/hooks/useAutoplayRetry';
import styles from './ShowreelSection.module.css';
import cdn from '@/lib/cdn';

export default function ShowreelSection() {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    setVideoEl(node);
  }, []);

  useAutoplayRetry(videoEl);

  return (
    <section className={styles.section}>
      <div className={styles.contentWrap}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            src={`${cdn}/hero.mp4`}
            preload="none"
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
