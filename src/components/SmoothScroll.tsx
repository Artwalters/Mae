'use client';

import { useEffect, createContext, useContext, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  return (
    <LenisContext.Provider value={{ stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
