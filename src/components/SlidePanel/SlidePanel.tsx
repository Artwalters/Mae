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

// How much overscroll (in px of wheel delta) to fill phase 2
const OVERSCROLL_THRESHOLD = 550;
// Decay rate when user stops scrolling (0-1, lower = faster snap back)
const OVERSCROLL_DECAY = 0.94;
// Lerp speed for smooth progress bar animation (0-1, lower = smoother)
const PROGRESS_LERP = 0.12;

export default function SlidePanel({ isOpen, onClose, children, header }: SlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelLenisRef = useRef<Lenis | null>(null);
  const isOpenRef = useRef(isOpen);
  const isMobileRef = useRef(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const { activePanel, progress, openPanel } = usePanel();
  const activePanelRef = useRef(activePanel);
  const openPanelRef = useRef(openPanel);
  const lastPhaseRef = useRef(1);

  // Overscroll tracking for phase 2 resistance effect
  const overscrollRef = useRef(0);
  const displayProgressRef = useRef(0);
  const decayRafRef = useRef<number | null>(null);
  const lerpRafRef = useRef<number | null>(null);
  const switchedRef = useRef(false);

  // Keep refs in sync for use in callbacks
  isOpenRef.current = isOpen;
  lenisRef.current = lenis;
  activePanelRef.current = activePanel;
  openPanelRef.current = openPanel;

  // Check if content is scrolled to the bottom
  const isAtBottom = () => {
    const el = contentRef.current;
    if (!el) return false;
    return el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
  };

  // Smooth lerp loop — runs continuously while overscroll is active
  const startLerpLoop = () => {
    if (lerpRafRef.current) return; // already running

    const tick = () => {
      const target = Math.min(overscrollRef.current / OVERSCROLL_THRESHOLD, 1);
      displayProgressRef.current += (target - displayProgressRef.current) * PROGRESS_LERP;

      // Snap to target when close enough
      if (Math.abs(displayProgressRef.current - target) < 0.001) {
        displayProgressRef.current = target;
      }

      if (panelRef.current) {
        panelRef.current.style.setProperty('--panel-progress', String(displayProgressRef.current));

        // Update phase
        const phase = displayProgressRef.current > 0.001 ? 2 : 1;
        if (phase !== lastPhaseRef.current) {
          lastPhaseRef.current = phase;
          panelRef.current.setAttribute('data-panel-phase', String(phase));
        }
      }

      // Auto-switch when display reaches full
      if (displayProgressRef.current >= 0.99 && !switchedRef.current) {
        switchedRef.current = true;
        openPanelRef.current('start-nu');
      }

      // Keep running if there's still movement
      if (overscrollRef.current > 0 || displayProgressRef.current > 0.001) {
        lerpRafRef.current = requestAnimationFrame(tick);
      } else {
        lerpRafRef.current = null;
      }
    };
    lerpRafRef.current = requestAnimationFrame(tick);
  };

  // Decay overscroll back to 0 when user stops scrolling
  const startDecay = () => {
    if (decayRafRef.current) cancelAnimationFrame(decayRafRef.current);

    const tick = () => {
      overscrollRef.current *= OVERSCROLL_DECAY;
      if (overscrollRef.current < 1) {
        overscrollRef.current = 0;
      }
      if (overscrollRef.current > 0) {
        decayRafRef.current = requestAnimationFrame(tick);
      } else {
        decayRafRef.current = null;
      }
    };
    decayRafRef.current = requestAnimationFrame(tick);
    startLerpLoop();
  };

  const stopDecay = () => {
    if (decayRafRef.current) {
      cancelAnimationFrame(decayRafRef.current);
      decayRafRef.current = null;
    }
  };

  const stopLerpLoop = () => {
    if (lerpRafRef.current) {
      cancelAnimationFrame(lerpRafRef.current);
      lerpRafRef.current = null;
    }
  };

  // Update scroll progress (phase 1) as CSS custom property
  const updateProgress = () => {
    if (activePanelRef.current !== 'meet-maarten' || !contentRef.current || !panelRef.current) return;

    // If in overscroll phase, don't update from scroll position
    if (overscrollRef.current > 0) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const max = scrollHeight - clientHeight;
    if (max <= 0) return;

    const barProgress = Math.min(scrollTop / max, 1);
    panelRef.current.style.setProperty('--panel-progress', String(barProgress));

    // Ensure phase 1
    if (lastPhaseRef.current !== 1) {
      lastPhaseRef.current = 1;
      panelRef.current.setAttribute('data-panel-phase', '1');
    }
  };

  // Handle wheel events for overscroll resistance
  const handleWheel = (e: WheelEvent) => {
    if (activePanelRef.current !== 'meet-maarten' || switchedRef.current) return;

    if (isAtBottom() && e.deltaY > 0) {
      // Scrolling down at bottom — accumulate overscroll with heavy resistance
      e.preventDefault();
      stopDecay();
      const ratio = overscrollRef.current / OVERSCROLL_THRESHOLD;
      // Resistance that eases off near the end so it doesn't stall
      const resistance = Math.max(1 - ratio * ratio * 0.85, 0.08);
      overscrollRef.current += e.deltaY * resistance * 0.35;
      overscrollRef.current = Math.min(overscrollRef.current, OVERSCROLL_THRESHOLD);
      startLerpLoop();
    } else if (overscrollRef.current > 0 && e.deltaY < 0) {
      // Scrolling up while in overscroll — reduce overscroll
      e.preventDefault();
      stopDecay();
      overscrollRef.current += e.deltaY * 0.4;
      overscrollRef.current = Math.max(overscrollRef.current, 0);
      startLerpLoop();
    } else if (overscrollRef.current > 0 && e.deltaY > 0) {
      // Still scrolling down in overscroll
      e.preventDefault();
      stopDecay();
      const ratio = overscrollRef.current / OVERSCROLL_THRESHOLD;
      const resistance = Math.max(1 - ratio * ratio * 0.85, 0.08);
      overscrollRef.current += e.deltaY * resistance * 0.35;
      overscrollRef.current = Math.min(overscrollRef.current, OVERSCROLL_THRESHOLD);
      startLerpLoop();
    }
  };

  // Detect when user stops scrolling to start decay
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheelEnd = () => {
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {
      if (overscrollRef.current > 0 && overscrollRef.current < OVERSCROLL_THRESHOLD && !switchedRef.current) {
        startDecay();
      }
    }, 150);
  };

  // Touch overscroll tracking
  const touchStartYRef = useRef<number | null>(null);
  const touchActiveRef = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchActiveRef.current = false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (activePanelRef.current !== 'meet-maarten' || switchedRef.current || touchStartYRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartYRef.current - currentY; // positive = scrolling down

    if (isAtBottom() && deltaY > 0 && !touchActiveRef.current) {
      // Just entered overscroll zone
      touchActiveRef.current = true;
      touchStartYRef.current = currentY;
      return;
    }

    if (touchActiveRef.current) {
      const touchDelta = touchStartYRef.current - currentY;
      e.preventDefault();
      stopDecay();

      if (touchDelta > 0) {
        // Swiping up (scrolling down) — accumulate with resistance
        const ratio = overscrollRef.current / OVERSCROLL_THRESHOLD;
        const resistance = Math.max(1 - ratio * ratio * 0.85, 0.08);
        overscrollRef.current = Math.min(touchDelta * resistance * 0.6, OVERSCROLL_THRESHOLD);
      } else {
        // Swiping down (scrolling up) — reduce
        overscrollRef.current = Math.max(overscrollRef.current + touchDelta * 0.4, 0);
        if (overscrollRef.current <= 0) {
          touchActiveRef.current = false;
        }
      }
      startLerpLoop();
    } else if (overscrollRef.current > 0 && deltaY < 0) {
      // Scrolling up while in overscroll
      e.preventDefault();
      overscrollRef.current += deltaY * 0.4;
      overscrollRef.current = Math.max(overscrollRef.current, 0);
      startLerpLoop();
      touchStartYRef.current = currentY;
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
    touchActiveRef.current = false;
    if (overscrollRef.current > 0 && overscrollRef.current < OVERSCROLL_THRESHOLD && !switchedRef.current) {
      startDecay();
    }
  };

  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (!panel || !overlay) return;

    gsap.killTweensOf(overlay);

    let transitionHandler: ((e: TransitionEvent) => void) | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      lenisRef.current?.stop();
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';

      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      panel.style.setProperty('--panel-progress', '0');
      panel.setAttribute('data-panel-phase', '1');
      lastPhaseRef.current = 1;
      overscrollRef.current = 0;
      displayProgressRef.current = 0;
      switchedRef.current = false;
      stopDecay();
      stopLerpLoop();

      panel.setAttribute('data-panel-open', 'true');

      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        pointerEvents: 'auto'
      });
    } else {
      panel.setAttribute('data-panel-open', 'false');

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        pointerEvents: 'none'
      });

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

      transitionHandler = (e: TransitionEvent) => {
        if (e.propertyName !== 'clip-path') return;
        panel.removeEventListener('transitionend', transitionHandler!);
        restoreLenis();
      };
      panel.addEventListener('transitionend', transitionHandler);
      fallbackTimer = setTimeout(restoreLenis, 1200);
    }

    return () => {
      if (transitionHandler && panel) {
        panel.removeEventListener('transitionend', transitionHandler);
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [isOpen]);

  // Reset overscroll state when switching panels (isOpen stays true)
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    overscrollRef.current = 0;
    displayProgressRef.current = 0;
    switchedRef.current = false;
    stopDecay();
    stopLerpLoop();
    panelRef.current.style.setProperty('--panel-progress', '0');
    panelRef.current.setAttribute('data-panel-phase', '1');
    lastPhaseRef.current = 1;
  }, [activePanel]);

  // Panel-scoped Lenis smooth scroll (desktop only)
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    contentRef.current.scrollTop = 0;

    if (isMobile) return;

    const timer = setTimeout(() => {
      if (!contentRef.current) return;

      const panelLenis = new Lenis({
        wrapper: contentRef.current,
        eventsTarget: contentRef.current,
      });
      panelLenisRef.current = panelLenis;

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

  // Overscroll listeners for phase 2 resistance (wheel + touch)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !isOpen) return;

    const onWheel = (e: WheelEvent) => {
      handleWheel(e);
      handleWheelEnd();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      stopDecay();
      stopLerpLoop();
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
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
      <div
        ref={overlayRef}
        className={styles.overlay}
        onClick={onClose}
      />

      <div ref={panelRef} className={styles.panel}>
        <div ref={contentRef} className={styles.content} data-lenis-prevent>
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
