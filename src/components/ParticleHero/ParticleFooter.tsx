'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import WaterEffect from './WaterEffect';
import ScrambleText from '@/components/ScrambleText';
import basePath from '@/lib/basePath';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet-md' | 'tablet' | 'desktop-sm' | 'desktop' | 'desktop-lg' | null;

export default function ParticleFooter() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  // Scroll-based: logo comes from above into center
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const isMobile = screenSize === 'mobile';
  const WaterComponent = screenSize === null ? null : isMobile ? null : WaterEffect;

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

  const getLogoYOffset = () => {
    switch (screenSize) {
      case 'mobile':
        return 0.30;
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

      {/* Footer Tags - fade in when logo reaches center */}
      <div className={styles.footerTags} style={{ opacity: Math.max(0, (scrollProgress - 0.7) / 0.3) }}>
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 10]} intensity={2.5} />

        <Suspense fallback={null}>
          <group position={[0, getLogoYOffset(), 0]}>
            <Center precise>
              <Logo3D scale={scale} scrollProgress={scrollProgress} mode="footer" isMobile={isMobile} />
            </Center>
          </group>
          {WaterComponent && <WaterComponent />}
        </Suspense>
      </Canvas>
    </div>
  );
}
