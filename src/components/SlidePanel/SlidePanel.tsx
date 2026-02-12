'use client';

import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useLenis } from '@/components/SmoothScroll';
import { usePanel } from '@/context/PanelContext';
import styles from './SlidePanel.module.css';

gsap.registerPlugin(ScrollTrigger);

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
}

export default function SlidePanel({ isOpen, onClose, children, header }: SlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelLenisRef = useRef<Lenis | null>(null);
  const isOpenRef = useRef(isOpen);
  const lenis = useLenis();
  const { activePanel, setProgress } = usePanel();

  // Keep ref in sync for use in onComplete callbacks
  isOpenRef.current = isOpen;

  // Track scroll progress for meet-maarten
  const handleScroll = useCallback(() => {
    if (activePanel === 'meet-maarten' && contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const max = scrollHeight - clientHeight;
      if (max > 0) {
        setProgress(scrollTop / max);
      }
    }
  }, [activePanel, setProgress]);

  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (!panel || !overlay) return;

    // Kill any ongoing animations to prevent race conditions
    gsap.killTweensOf(panel);
    gsap.killTweensOf(overlay);

    if (isOpen) {
      // Stop Lenis smooth scroll and prevent all scrolling
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // Reset scroll position
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }

      // Check if mobile or desktop for animation
      const isMobile = window.innerWidth <= 767;

      // Show panel and animate in
      gsap.set(panel, { visibility: 'visible' });
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'auto'
      });

      if (isMobile) {
        gsap.to(panel, {
          x: '0%',
          y: '0%',
          duration: 0.5,
          ease: 'power3.out'
        });
      } else {
        // Desktop: skewed animation
        gsap.fromTo(panel,
          {
            x: '100%',
            skewX: -10,
          },
          {
            x: '0%',
            skewX: 0,
            duration: 0.6,
            ease: 'power3.out'
          }
        );
      }
    } else {
      // Animate out
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        pointerEvents: 'none'
      });

      // Check if mobile or desktop for animation direction
      const isMobile = window.innerWidth <= 767;

      const onCloseComplete = () => {
        // Only restart Lenis if panel is still closed (prevents race condition)
        if (!isOpenRef.current) {
          lenis?.start();
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          // Re-sync ScrollTrigger with current scroll position after Lenis restart
          ScrollTrigger.refresh();
          gsap.set(panel, { visibility: 'hidden' });
        }
        gsap.set(panel, { skewX: 0 });
      };

      if (isMobile) {
        gsap.to(panel, {
          x: '0%',
          y: '100%',
          duration: 0.5,
          ease: 'power3.in',
          onComplete: onCloseComplete
        });
      } else {
        // Desktop: skewed animation out
        gsap.to(panel, {
          x: '100%',
          skewX: -10,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: onCloseComplete
        });
      }
    }
  }, [isOpen, lenis]);

  // Set initial position based on screen size
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const setInitialPosition = () => {
      const isMobile = window.innerWidth <= 767;
      gsap.set(panel, {
        x: isMobile ? '0%' : '100%',
        y: isMobile ? '100%' : '0%'
      });
    };

    setInitialPosition();
    window.addEventListener('resize', setInitialPosition);

    return () => {
      window.removeEventListener('resize', setInitialPosition);
    };
  }, []);

  // Panel-scoped Lenis smooth scroll
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    // Reset scroll position when panel content changes
    contentRef.current.scrollTop = 0;

    const timer = setTimeout(() => {
      if (!contentRef.current) return;

      const panelLenis = new Lenis({
        wrapper: contentRef.current,
        eventsTarget: contentRef.current,
      });
      panelLenisRef.current = panelLenis;

      const tick = (time: number) => {
        panelLenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      (panelLenis as unknown as Record<string, unknown>)._tickRef = tick;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (panelLenisRef.current) {
        const tick = (panelLenisRef.current as unknown as Record<string, unknown>)._tickRef as (time: number) => void;
        if (tick) gsap.ticker.remove(tick);
        panelLenisRef.current.destroy();
        panelLenisRef.current = null;
      }
    };
  }, [isOpen, activePanel]);

  // Scroll progress listener
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !isOpen) return;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isOpen, handleScroll]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={styles.overlay}
        onClick={onClose}
      />

      {/* Panel */}
      <div ref={panelRef} className={styles.panel}>
        {/* Scrollable Content */}
        <div ref={contentRef} className={styles.content} data-lenis-prevent>
          {/* Sticky header: bar + divider + white space */}
          <div className={styles.panelHeader}>
            <div className={styles.panelHeaderInner}>
              {header}
              <button className={styles.closeButton} onClick={onClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.divider} />
          </div>
          <div className={styles.contentInner}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
