'use client';

import { useEffect, createContext, useContext, useRef, useCallback, useMemo } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LenisContextType {
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextType | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Scroll naar top bij page load
    window.scrollTo(0, 0);

    // Geen Lenis op mobile - veroorzaakt scroll problemen
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Op mobile: alleen native scroll met ScrollTrigger
      return;
    }

    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const contextValue = useMemo(() => ({ stop, start }), [stop, start]);

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}
