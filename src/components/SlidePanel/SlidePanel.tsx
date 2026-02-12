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

    // Kill any ongoing overlay animations
    gsap.killTweensOf(overlay);

    let transitionHandler: ((e: TransitionEvent) => void) | null = null;

    if (isOpen) {
      // Stop Lenis smooth scroll and prevent all scrolling
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // Reset scroll position
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }

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

      // Wait for CSS transition to finish, then restart Lenis
      transitionHandler = (e: TransitionEvent) => {
        if (e.propertyName !== 'clip-path') return;
        panel.removeEventListener('transitionend', transitionHandler!);
        if (!isOpenRef.current) {
          lenis?.start();
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          ScrollTrigger.refresh();
        }
      };
      panel.addEventListener('transitionend', transitionHandler);
    }

    return () => {
      if (transitionHandler && panel) {
        panel.removeEventListener('transitionend', transitionHandler);
      }
    };
  }, [isOpen, lenis]);

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
