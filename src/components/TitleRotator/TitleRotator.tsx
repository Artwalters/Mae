'use client';

import { useEffect } from 'react';

const titles = [
  'Are you ready to move?',
  'Are you ready to adapt?',
  'Are you ready to evolve?',
];

export default function TitleRotator() {
  // Viewport height fix — calculate once on load, never changes on resize
  useEffect(() => {
    const avh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--avh', `${avh}px`);
  }, []);

  useEffect(() => {
    const originalTitle = 'Move Adapt Evolve';

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pick a random title when user leaves the tab
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        document.title = randomTitle;
      } else {
        // Restore original title when user returns
        document.title = originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
