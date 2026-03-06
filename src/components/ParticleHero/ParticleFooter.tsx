'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import WaterEffect from './WaterEffect';
import { useSharedVideo } from '@/context/SharedVideoContext';
import cdn from '@/lib/cdn';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet-md' | 'tablet' | 'desktop-sm' | 'desktop' | 'desktop-lg' | null;

export default function ParticleFooter() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const scrollProgressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const footerTagsRef = useRef<HTMLDivElement>(null);
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
        scrollProgressRef.current = self.progress;
        // Update footer tags opacity directly via DOM
        if (footerTagsRef.current) {
          footerTagsRef.current.style.opacity = String(Math.max(0, (self.progress - 0.7) / 0.3));
        }
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
          src={`${cdn}/hero.mp4`}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Footer Tags - fade in when logo reaches center */}
      <div ref={footerTagsRef} className={styles.footerTags} style={{ opacity: 0 }}>
        <button className={styles.footerTag} onClick={() => document.getElementById('herstel-section')?.scrollIntoView({ behavior: 'smooth' })}>
          [START FYSIOTHERAPIE]
        </button>
        <button className={styles.footerTag} onClick={() => document.getElementById('leefstijl-section')?.scrollIntoView({ behavior: 'smooth' })}>
          [START LEEFSTIJL COACHING]
        </button>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <span className={styles.bottomBarText}>&copy; 2026 M.A.E. All rights reserved.</span>
        <div className={styles.bottomBarSocials}>
          <a href="https://www.instagram.com/m.a.e.coaching.fysiotherapie/" target="_blank" rel="noopener noreferrer" className={styles.bottomBarSocialLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://www.tiktok.com/@maecoaching" target="_blank" rel="noopener noreferrer" className={styles.bottomBarSocialLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"/></svg>
          </a>
        </div>
        <a href="/privacy" className={styles.bottomBarLink}>Privacy Policy</a>
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
              <Logo3D scale={scale} scrollProgressRef={scrollProgressRef} mouseRef={mouseRef} mode="footer" isMobile={isMobile} sharedTexture={sharedTexture} />
            </Center>
          </group>
          {WaterComponent && <WaterComponent sharedTexture={sharedTexture} sharedVideo={sharedVideo} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
