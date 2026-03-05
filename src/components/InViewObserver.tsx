'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

export default function InViewObserver() {
  useEffect(() => {
    const labels = document.querySelectorAll('.label');

    // Set initial state
    gsap.set(labels, { opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              duration: 1.6,
              ease: 'power2.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    labels.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
