'use client';

import { useEffect, useRef, ReactNode } from 'react';
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
  const isMobileRef = useRef(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const { activePanel, progress } = usePanel();
  const activePanelRef = useRef(activePanel);

  // Keep refs in sync for use in callbacks
  isOpenRef.current = isOpen;
  lenisRef.current = lenis;
  activePanelRef.current = activePanel;

  // Update progress as CSS custom property directly on the panel (no React re-render)
  const updateProgress = () => {
    if (activePanelRef.current !== 'meet-maarten' || !contentRef.current || !panelRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const max = scrollHeight - clientHeight;
    if (max > 0) {
      panelRef.current.style.setProperty('--panel-progress', String(scrollTop / max));
    }
  };

  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (!panel || !overlay) return;

    // Kill any ongoing overlay animations
    gsap.killTweensOf(overlay);

    let transitionHandler: ((e: TransitionEvent) => void) | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      // Stop Lenis smooth scroll and prevent all scrolling
      lenisRef.current?.stop();
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';

      // Reset scroll position and progress
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      panel.style.setProperty('--panel-progress', '0');

      // Trigger clip-path animation via data attribute
      panel.setAttribute('data-panel-open', 'true');

      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'auto'
      });
    } else {
      // Trigger clip-path close animation
      panel.setAttribute('data-panel-open', 'false');

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        pointerEvents: 'none'
      });

      // Restore Lenis + body scroll (only runs once)
      let restored = false;
      const restoreLenis = () => {
        if (restored) return;
        restored = true;
        if (!isOpenRef.current) {
          lenisRef.current?.start();
          document.documentElement.style.overflowY = '';
          document.body.style.overflowY = '';
          ScrollTrigger.refresh();
        }
      };

      // Wait for CSS transition to finish, then restart Lenis
      transitionHandler = (e: TransitionEvent) => {
        if (e.propertyName !== 'clip-path') return;
        panel.removeEventListener('transitionend', transitionHandler!);
        restoreLenis();
      };
      panel.addEventListener('transitionend', transitionHandler);

      // Fallback: ensure Lenis restarts even if transitionend doesn't fire
      fallbackTimer = setTimeout(restoreLenis, 1200);
    }

    return () => {
      if (transitionHandler && panel) {
        panel.removeEventListener('transitionend', transitionHandler);
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [isOpen]);

  // Panel-scoped Lenis smooth scroll (desktop only)
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    // Reset scroll position when panel content changes
    contentRef.current.scrollTop = 0;

    // No panel Lenis on mobile — native scroll is smoother
    if (isMobile) return;

    const timer = setTimeout(() => {
      if (!contentRef.current) return;

      const panelLenis = new Lenis({
        wrapper: contentRef.current,
        eventsTarget: contentRef.current,
      });
      panelLenisRef.current = panelLenis;

      // Track progress via Lenis scroll callback (direct DOM, no React re-render)
      panelLenis.on('scroll', updateProgress);

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

  // Scroll progress listener (mobile only — desktop uses Lenis callback)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !isOpen || !isMobileRef.current) return;
    el.addEventListener('scroll', updateProgress, { passive: true });
    return () => el.removeEventListener('scroll', updateProgress);
  }, [isOpen, activePanel]);

  // Sync context progress (from StartNuPanel steps) to CSS variable
  useEffect(() => {
    if (activePanelRef.current !== 'meet-maarten' && panelRef.current) {
      panelRef.current.style.setProperty('--panel-progress', String(progress));
    }
  }, [progress]);

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
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
