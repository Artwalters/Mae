'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { useLenis } from '@/components/SmoothScroll';
import styles from './SlidePanel.module.css';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function SlidePanel({ isOpen, onClose, children }: SlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (!panel || !overlay) return;

    if (isOpen) {
      // Stop Lenis smooth scroll and prevent all scrolling
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // Check if mobile or desktop for animation
      const isMobile = window.innerWidth <= 767;

      // Animate in
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

      if (isMobile) {
        gsap.to(panel, {
          x: '0%',
          y: '100%',
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            lenis?.start();
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
          }
        });
      } else {
        // Desktop: skewed animation out
        gsap.to(panel, {
          x: '100%',
          skewX: -10,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            lenis?.start();
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            gsap.set(panel, { skewX: 0 });
          }
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
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div ref={contentRef} className={styles.content} data-lenis-prevent>
          {children}
        </div>
      </div>
    </>
  );
}
