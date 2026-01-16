'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import WaterEffect from './WaterEffect';
import WaterEffectMobile from './WaterEffectMobile';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet' | 'desktop' | null;

export default function ParticleHero() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFooterArea, setIsFooterArea] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 900) {
        setScreenSize('tablet-sm');
      } else if (width < 1200) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Scroll-based rotation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobileDevice = window.innerWidth < 768;
    const footerStartOffset = isMobileDevice ? '300vh' : '800vh';

    // Top trigger: tilt backwards when scrolling away from hero
    const topTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        setIsFooterArea(false);
      }
    });

    // Footer trigger: tilt from backwards to upright when reaching bottom
    const footerTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: `bottom-=${footerStartOffset} bottom`,
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        setIsFooterArea(true);
      }
    });

    return () => {
      topTrigger.kill();
      footerTrigger.kill();
    };
  }, []);

  // Don't render water effect until we know the device type (prevents hydration mismatch)
  const isMobile = screenSize === 'mobile';
  const WaterComponent = screenSize === null ? null : isMobile ? WaterEffectMobile : WaterEffect;

  // Responsive scale en zoom
  const getScaleAndZoom = () => {
    switch (screenSize) {
      case 'mobile':
        return { scale: 0.055, zoom: 180 };
      case 'tablet-sm':
        return { scale: 0.085, zoom: 200 };
      case 'tablet':
        return { scale: 0.11, zoom: 220 };
      case 'desktop':
      default:
        return { scale: 0.15, zoom: 280 };
    }
  };

  const { scale, zoom } = getScaleAndZoom();

  return (
    <div ref={containerRef} className={styles.container}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Strong frontal light for white front, darker edges */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 10]} intensity={2.5} />

        <Suspense fallback={null}>
          <Center precise>
            <Logo3D scale={scale} scrollProgress={scrollProgress} isFooterArea={isFooterArea} />
          </Center>
          {WaterComponent && <WaterComponent />}
        </Suspense>
      </Canvas>
    </div>
  );
}
