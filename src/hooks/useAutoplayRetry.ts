'use client';

import { useEffect } from 'react';

/**
 * Retries video.play() on first user interaction.
 * Handles browsers that block autoplay until a gesture occurs
 * (iOS Low Power Mode, Data Saver, strict autoplay policies).
 */
export function useAutoplayRetry(video: HTMLVideoElement | null) {
  useEffect(() => {
    if (!video) return;

    // Already playing — nothing to do
    if (!video.paused) return;

    const events = ['click', 'touchstart', 'scroll', 'keydown'] as const;

    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      events.forEach((evt) => document.removeEventListener(evt, tryPlay));
    };

    events.forEach((evt) =>
      document.addEventListener(evt, tryPlay, { once: true, passive: true })
    );

    return cleanup;
  }, [video]);
}
