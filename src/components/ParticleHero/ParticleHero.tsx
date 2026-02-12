'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import WaterEffect from './WaterEffect';
import WaterEffectMobile from './WaterEffectMobile';
import ScrambleText from '@/components/ScrambleText';
import basePath from '@/lib/basePath';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet-md' | 'tablet' | 'desktop-sm' | 'desktop' | 'desktop-lg' | null;

export default function ParticleHero() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFooterArea, setIsFooterArea] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 900) {
        setScreenSize('tablet-sm');
      } else if (width < 1000) {
        setScreenSize('tablet-md');
      } else if (width < 1200) {
        setScreenSize('tablet');
      } else if (width < 1500) {
        setScreenSize('desktop-sm');
      } else if (width < 1900) {
        setScreenSize('desktop');
      } else {
        setScreenSize('desktop-lg');
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

    // Hide trigger: hide model at end of MaeSection
    const maeSection = document.getElementById('mae-section');
    const hideTrigger = maeSection ? ScrollTrigger.create({
      trigger: maeSection,
      start: 'bottom 80%',
      end: 'bottom 80%',
      onEnter: () => setIsVisible(false),
      onLeaveBack: () => setIsVisible(true),
    }) : null;

    // Show trigger: show model at start of CTA section (Ready to Evolve)
    const ctaSection = document.getElementById('cta-section');
    const showTrigger = ctaSection ? ScrollTrigger.create({
      trigger: ctaSection,
      start: 'top bottom',
      end: 'top bottom',
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    }) : null;

    // Footer trigger: tilt from backwards to upright when reaching bottom
    const footerTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: `bottom-=${footerStartOffset} bottom`,
      end: 'bottom bottom',
      scrub: true,
      onEnter: () => setIsFooterArea(true),
      onLeaveBack: () => setIsFooterArea(false),
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    return () => {
      topTrigger.kill();
      hideTrigger?.kill();
      showTrigger?.kill();
      footerTrigger.kill();
    };
  }, []);


  // Don't render water effect until we know the device type (prevents hydration mismatch)
  const isMobile = screenSize === 'mobile';
  const WaterComponent = screenSize === null ? null : isMobile ? null : WaterEffect;

  // Responsive scale en zoom
  const getScaleAndZoom = () => {
    switch (screenSize) {
      case 'mobile':
        return { scale: 0.1, zoom: 180 };
      case 'tablet-sm':
        return { scale: 0.085, zoom: 200 };
      case 'tablet-md':
        return { scale: 0.095, zoom: 210 };
      case 'tablet':
        return { scale: 0.11, zoom: 220 };
      case 'desktop-sm':
        return { scale: 0.11, zoom: 250 };
      case 'desktop':
        return { scale: 0.12, zoom: 280 };
      case 'desktop-lg':
      default:
        return { scale: 0.15, zoom: 280 };
    }
  };

  const { scale, zoom } = getScaleAndZoom();

  // Y-offset voor logo positie per schermgrootte
  const getLogoYOffset = () => {
    switch (screenSize) {
      case 'mobile':
        return 0.30;  // Hoger op mobile
      default:
        return 0;
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Mobile video background */}
      {isMobile && (
        <video
          className={styles.mobileVideo}
          src={`${basePath}/img/hero.mp4`}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Side Labels */}
      <div className={`${styles.sideLabels} ${isVisible ? styles.visible : styles.hidden}`}>
        <span className={`${styles.sideLabel} ${styles.left}`}>
          [<ScrambleText trigger="load" retriggerAtEnd retriggerAtStart>FYSIOTHERAPIE</ScrambleText>]
        </span>
        <span className={`${styles.sideLabel} ${styles.right}`}>
          [<ScrambleText trigger="load" retriggerAtEnd retriggerAtStart>LEEFSTIJL</ScrambleText>]
        </span>
      </div>

      {/* Footer Tags */}
      <div className={`${styles.footerTags} ${(isVisible || isFooterArea) ? styles.visible : styles.hidden}`}>
        <a href="#fysio" className={styles.footerTag}>
          [<ScrambleText retriggerAtEnd>START FYSIOTHERAPIE</ScrambleText>]
        </a>
        <a href="#leefstijl" className={styles.footerTag}>
          [<ScrambleText retriggerAtEnd>START LEEFSTIJL COACHING</ScrambleText>]
        </a>
      </div>

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
          <group position={[0, getLogoYOffset(), 0]}>
            <Center precise>
              <Logo3D scale={scale} scrollProgress={scrollProgress} isFooterArea={isFooterArea} isVisible={isVisible} isMobile={isMobile} />
            </Center>
          </group>
          {WaterComponent && <WaterComponent />}
        </Suspense>
      </Canvas>
    </div>
  );
}
