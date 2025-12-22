'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Nav.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastScrollY = 0;
    const threshold = 50;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        // Scrolling down - hide nav
        gsap.to(nav, {
          y: '-200%',
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // Scrolling up - show nav
        gsap.to(nav, {
          y: '0%',
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav ref={navRef} className={styles.nav}>
      <a href="#" className={styles.navLink}>HOME</a>
      <a href="#" className={styles.navLink}>TRAJECTEN</a>
      <a href="#" className={styles.navLink}>OVER</a>
      <a href="#" className={styles.navLink}>CONTACT</a>
    </nav>
  );
}
