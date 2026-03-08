'use client';

import { useEffect } from 'react';

/**
 * Retries video.play() on first user interaction and
 * resumes playback when the page becomes visible again
 * (e.g. returning from another tab/app on mobile).
 */
export function useAutoplayRetry(video: HTMLVideoElement | null) {
  // One-time: retry play on first user gesture
  useEffect(() => {
    if (!video) return;
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

  // Persistent: resume when returning to tab/app
  useEffect(() => {
    if (!video) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && video.paused) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [video]);
}
