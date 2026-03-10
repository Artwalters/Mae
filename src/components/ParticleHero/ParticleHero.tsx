'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import VideoPlane from './VideoPlane';
import { useSharedVideo } from '@/context/SharedVideoContext';
import { usePanel } from '@/context/PanelContext';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet-md' | 'tablet' | 'desktop-sm' | 'desktop' | 'desktop-lg' | null;

export default function ParticleHero() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const scrollProgressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sideLabelsRef = useRef<HTMLDivElement>(null);
  const mobileCtaRef = useRef<HTMLDivElement>(null);
  const { video: sharedVideo, texture: sharedTexture } = useSharedVideo();
  const { openPanel } = usePanel();
  const mouseRef = useRef({ x: 0, y: 0 });
  const introOffsetRef = useRef(2.0); // Logo starts tilted+dropped below screen
  const bgBrightnessRef = useRef({ value: 0 }); // Animated by GSAP
  const loaderRef = useRef<HTMLDivElement>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  const handleLogoReady = useCallback(() => {
    setLogoReady(true);
  }, []);

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

  // Mouse tracking for 3D logo tilt (desktop) / random drift (mobile)
  useEffect(() => {
    if (screenSize === 'mobile') {
      let raf: number;
      const animate = (time: number) => {
        const t = time * 0.001;
        mouseRef.current.x = Math.sin(t * 0.4) * 0.8 + Math.sin(t * 1.1) * 0.5 + Math.cos(t * 0.7) * 0.3;
        mouseRef.current.y = Math.cos(t * 0.3) * 0.7 + Math.sin(t * 0.9) * 0.4 + Math.cos(t * 1.4) * 0.3;
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [screenSize]);


  // Intro animation: starts only after the 3D logo has rendered its first frame
  useEffect(() => {
    if (!logoReady) return;

    const startDelay = 1; // Logo starts after 1 second
    const logoDuration = 2.0;
    const brightenDuration = 2.0;
    const fadeDuration = 0.8;

    // Fade out loader as logo starts
    if (loaderRef.current) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: startDelay - 0.3,
        ease: 'power2.inOut',
      });
    }

    // After 1 second: logo animates up
    gsap.to(introOffsetRef, {
      current: 0,
      duration: logoDuration,
      delay: startDelay,
      ease: 'power3.out',
    });

    // Background fades in gradually after logo has mostly landed
    const brightenDelay = startDelay + logoDuration * 0.5;
    gsap.to(bgBrightnessRef.current, {
      value: 0.18,
      duration: brightenDuration,
      delay: brightenDelay,
      ease: 'power2.out',
    });

    // Fade in side labels + mobile CTA after background starts brightening
    const uiFadeDelay = brightenDelay + brightenDuration * 0.4;

    gsap.to([sideLabelsRef.current, mobileCtaRef.current].filter(Boolean), {
      opacity: 1,
      duration: fadeDuration,
      delay: uiFadeDelay,
      ease: 'power2.out',
    });

    // Navigation fades in + scroll unblocked after UI elements
    const navTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('heroIntroComplete'));
      setIntroComplete(true);
    }, (uiFadeDelay + fadeDuration * 0.3) * 1000);

    return () => clearTimeout(navTimer);
  }, [logoReady]);

  // Scroll-based: tilt + drop when scrolling away from hero
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        // Update label opacity directly via DOM
        const opacity = String(Math.max(0, 1 - self.progress * 3));
        if (sideLabelsRef.current) sideLabelsRef.current.style.opacity = opacity;
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const isMobile = screenSize === 'mobile';

  const getScaleAndZoom = () => {
    switch (screenSize) {
      case 'mobile':
        return { scale: 0.07, zoom: 180 };
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
        return 0.05;
      default:
        return 0;
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Intro loader */}
      {!introComplete && (
        <div ref={loaderRef} className={styles.loader}>
          <span className={styles.loaderText}>Move Adapt Evolve</span>
        </div>
      )}

      {/* Side Labels - start hidden, fade in after intro */}
      <div ref={sideLabelsRef} className={styles.sideLabels} style={{ opacity: 0 }}>
        <button className={`${styles.sideLabel} ${styles.left}`} onClick={() => openPanel('start-nu', 'fysio')}>
          [START FYSIOTHERAPIE]
        </button>
        <button className={`${styles.sideLabel} ${styles.right}`} onClick={() => openPanel('start-nu', 'leefstijl')}>
          [START LEEFSTIJL COACHING]
        </button>
      </div>

      {/* Mobile CTA buttons — start hidden, fade in after intro */}
      {isMobile && (
        <div ref={mobileCtaRef} className={styles.mobileCta} style={{ opacity: 0 }}>
          <button className={styles.mobileCtaGreen} onClick={() => openPanel('start-nu', 'fysio')}>
            Fysiotherapie
          </button>
          <button className={styles.mobileCtaGray} onClick={() => openPanel('start-nu', 'leefstijl')}>
            Leefstijlcoaching
          </button>
        </div>
      )}

      {/* Only render Canvas once screenSize is known to prevent zoom/scale flash */}
      {screenSize !== null && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 100], zoom, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 10]} intensity={2.5} />

          <VideoPlane texture={sharedTexture} video={sharedVideo} brightnessRef={bgBrightnessRef} />
          <Suspense fallback={null}>
            <group position={[0, getLogoYOffset(), 0]}>
              <Center precise>
                <Logo3D scale={scale} scrollProgressRef={scrollProgressRef} mouseRef={mouseRef} mode="hero" isMobile={isMobile} sharedTexture={sharedTexture} introOffsetRef={introOffsetRef} onReady={handleLogoReady} />
              </Center>
            </group>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
