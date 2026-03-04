'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';
import styles from './Navigation.module.css';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Home', target: 'top' },
  { label: 'Fysio', target: 'herstel-section' },
  { label: 'Leefstijl', target: 'leefstijl-section' },
  { label: 'FAQ', target: 'faq-section' },
  { label: 'Contact', target: 'cta-section', accent: true },
];

const sectionColors: { id: string; bg: string }[] = [
  { id: 'mae-section', bg: '#d7d7d7' },
  { id: 'herstel-section', bg: '#3a3a3a' },
  { id: 'herstel-image', bg: '#d7d7d7' },
  { id: 'leefstijl-content', bg: '#3a3a3a' },
  { id: 'leefstijl-image', bg: '#d7d7d7' },
  { id: 'faq-section', bg: '#d7d7d7' },
  { id: 'cta-section', bg: '#d7d7d7' },
  { id: 'footer-section', bg: '#3a3a3a' },
];

export default function Navigation() {
  const [active, setActive] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const lottieRef = useRef<any>(null);
  const lenis = useLenis();

  const open = useCallback(() => {
    setActive(true);
    lenis?.stop();
    setTimeout(() => {
      const el = lottieRef.current;
      if (el?.dotLottie) {
        el.dotLottie.setMode('forward');
        el.dotLottie.play();
      }
    }, 500);
  }, [lenis]);

  const close = useCallback(() => {
    setActive(false);
    lenis?.start();
    const el = lottieRef.current;
    if (el?.dotLottie) {
      el.dotLottie.setMode('reverse');
      el.dotLottie.play();
    }
  }, [lenis]);

  const toggle = useCallback(() => {
    if (active) close();
    else open();
  }, [active, open, close]);

  const scrollTo = useCallback((target: string) => {
    close();
    requestAnimationFrame(() => {
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }, [close]);

  // ESC key closes navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, close]);

  // Click outside tile closes navigation
  useEffect(() => {
    if (!active) return;
    const handleClick = (e: MouseEvent) => {
      const tile = document.querySelector(`.${styles.tile}`);
      const hamburger = document.querySelector(`.${styles.hamburger}`);
      if (tile && !tile.contains(e.target as Node) && hamburger && !hamburger.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [active, close]);

  // Scroll closes navigation
  useEffect(() => {
    if (!active) return;
    const handleScroll = () => close();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, close]);

  // Hamburger + page logo color adapts to current section
  useEffect(() => {
    const btn = hamburgerRef.current;
    if (!btn) return;

    const heroColor = '#3a3a3a';
    btn.style.backgroundColor = heroColor;

    const triggers = sectionColors.map(({ id, bg }, index) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const prevColor = index === 0
        ? heroColor
        : sectionColors[index - 1].bg;

      return ScrollTrigger.create({
        trigger: el,
        start: 'top top+=80',
        end: 'bottom top+=80',
        onEnter: () => { btn.style.backgroundColor = bg; },
        onEnterBack: () => { btn.style.backgroundColor = bg; },
        onLeave: () => {},
        onLeaveBack: () => { btn.style.backgroundColor = prevColor; },
      });
    });

    return () => {
      triggers.forEach(t => t?.kill());
    };
  }, []);

  return (
    <nav
      className={styles.nav}
      data-navigation-status={active ? 'active' : 'not-active'}
    >
      {/* Hamburger */}
      <button
        ref={hamburgerRef}
        className={styles.hamburger}
        onClick={toggle}
        aria-label={active ? 'Close menu' : 'Open menu'}
      >
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
      </button>

      {/* Fullscreen overlay */}
      <div className={styles.tile}>
        {/* Logo top-left */}
        <button className={styles.logo} onClick={() => scrollTo('top')} aria-label="Home">
          <dotlottie-wc
            ref={lottieRef}
            src="https://lottie.host/f0906274-5272-4bff-a63b-12216f8152d3/7pJjJ1FQcj.lottie"
          />
        </button>

        <ul className={styles.menuList}>
          {navItems.map((item) => (
            <li key={item.target} className={styles.menuItem}>
              <button
                className={`${styles.menuLink} ${item.accent ? styles.menuLinkAccent : ''}`}
                onClick={() => scrollTo(item.target)}
              >
                {item.label.split('').map((char, i) =>
                  char.toLowerCase() === 'a' || char.toLowerCase() === 'v'
                    ? <span key={i} className={styles.menuLinkAlt}>{char}</span>
                    : char
                )}
              </button>
            </li>
          ))}
        </ul>

        <a href="mailto:info@mae-studio.nl" className={`${styles.menuCornerLink} ${styles.menuCornerTopLeft}`}>info@mae-studio.nl</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${styles.menuCornerLink} ${styles.menuCornerBottomLeft}`}>LinkedIn</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${styles.menuCornerLink} ${styles.menuCornerBottomRight}`}>Instagram</a>
      </div>
    </nav>
  );
}
