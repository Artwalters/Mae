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
  { id: 'mae-section', bg: '#d7d7d7' },           // --color-light darkened
  { id: 'herstel-section', bg: '#3a3a3a' },       // dark grey like hero
  { id: 'herstel-image', bg: '#d7d7d7' },         // light darkened
  { id: 'leefstijl-content', bg: '#3a3a3a' },     // dark grey like hero
  { id: 'leefstijl-image', bg: '#d7d7d7' },       // light darkened
  { id: 'faq-section', bg: '#d7d7d7' },           // light darkened
  { id: 'cta-section', bg: '#d7d7d7' },           // light darkened
  { id: 'footer-section', bg: '#3a3a3a' },        // dark grey like hero
];

export default function Navigation() {
  const [active, setActive] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  const open = useCallback(() => {
    setActive(true);
    lenis?.stop();
  }, [lenis]);

  const close = useCallback(() => {
    setActive(false);
    lenis?.start();
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

  // Hamburger adapts background color to current section
  useEffect(() => {
    const btn = hamburgerRef.current;
    if (!btn) return;

    const heroColor = '#3a3a3a';
    btn.style.backgroundColor = heroColor;

    const triggers = sectionColors.map(({ id, bg }, index) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const color = bg;

      // Find the previous section's color (or hero color)
      const prevColor = index === 0
        ? heroColor
        : sectionColors[index - 1].bg;

      return ScrollTrigger.create({
        trigger: el,
        start: 'top top+=80',
        end: 'bottom top+=80',
        onEnter: () => { btn.style.backgroundColor = color; },
        onEnterBack: () => { btn.style.backgroundColor = color; },
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
      {/* Desktop nav links */}
      <div className={styles.desktopNav}>
        {navItems.map((item) => (
          <button
            key={item.target}
            className={styles.navLink}
            onClick={() => scrollTo(item.target)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Hamburger (mobile) */}
      <button
        ref={hamburgerRef}
        className={styles.hamburger}
        onClick={toggle}
        aria-label={active ? 'Close menu' : 'Open menu'}
      >
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
      </button>

      {/* Menu overlay */}
      <div className={styles.tile}>
        <div className={styles.tileContent}>
          {/* Close button */}
          <button className={styles.closeBtn} onClick={close} aria-label="Close menu">
            X
          </button>

          <ul className={styles.menuList}>
            {navItems.map((item) => (
              <li key={item.target} className={styles.menuItem}>
                <button
                  className={`${styles.menuLink} ${item.accent ? styles.menuLinkAccent : ''}`}
                  onClick={() => scrollTo(item.target)}
                >
                  <span className={styles.menuLinkText}>{item.label}</span>
                  <span className={styles.menuLinkText}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.menuFooter}>
            <a href="mailto:info@mae-studio.nl" className={styles.menuContactLink}>info@mae-studio.nl</a>
            <a href="tel:+31612345678" className={styles.menuContactLink}>+31 6 1234 5678</a>
            <div className={styles.menuSocials}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">[ LinkedIn ]</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">[ Instagram ]</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
