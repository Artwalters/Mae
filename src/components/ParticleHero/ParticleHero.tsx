'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import WaterEffect from './WaterEffect';
import { useSharedVideo } from '@/context/SharedVideoContext';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

function MobileVideoBackground({ video }: { video: HTMLVideoElement | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!video || !containerRef.current) return;
    video.className = styles.mobileVideo;
    containerRef.current.appendChild(video);
    return () => {
      if (video.parentNode === containerRef.current) {
        containerRef.current?.removeChild(video);
      }
    };
  }, [video]);

  return <div ref={containerRef} />;
}

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet-md' | 'tablet' | 'desktop-sm' | 'desktop' | 'desktop-lg' | null;

export default function ParticleHero() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const scrollProgressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sideLabelsRef = useRef<HTMLDivElement>(null);
  const { video: sharedVideo, texture: sharedTexture } = useSharedVideo();
  const mouseRef = useRef({ x: 0, y: 0 });

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

  // Mouse tracking for 3D logo tilt (desktop only)
  useEffect(() => {
    if (screenSize === 'mobile') return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [screenSize]);

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
  const WaterComponent = screenSize === null ? null : isMobile ? null : WaterEffect;

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
      {/* Mobile video background — reuse the shared video element */}
      {isMobile && <MobileVideoBackground video={sharedVideo} />}

      {/* Side Labels - fade out as you scroll */}
      <div ref={sideLabelsRef} className={styles.sideLabels}>
        <span className={`${styles.sideLabel} ${styles.left}`}>
          [CONTACT]
        </span>
        <button className={`${styles.sideLabel} ${styles.right}`} onClick={() => document.getElementById('mae-section')?.scrollIntoView({ behavior: 'smooth' })}>
          [SCROLL DOWN]
        </button>
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
              <Logo3D scale={scale} scrollProgressRef={scrollProgressRef} mouseRef={mouseRef} mode="hero" isMobile={isMobile} sharedTexture={sharedTexture} />
            </Center>
          </group>
          {WaterComponent && <WaterComponent sharedTexture={sharedTexture} sharedVideo={sharedVideo} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
