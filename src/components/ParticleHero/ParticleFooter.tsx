'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import VideoPlane from './VideoPlane';
import { useSharedVideo } from '@/context/SharedVideoContext';
import { usePanel } from '@/context/PanelContext';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

const isStrongHardware = typeof navigator !== 'undefined' && navigator.hardwareConcurrency > 4;

function Invalidator({ active }: { active: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => { if (active) invalidate(); }, [active, invalidate]);
  useFrame(() => { if (active) invalidate(); });
  return null;
}

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet-md' | 'tablet' | 'desktop-sm' | 'desktop' | 'desktop-lg' | null;

export default function ParticleFooter() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const scrollProgressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const footerTagsRef = useRef<HTMLDivElement>(null);
  const { video: sharedVideo, texture: sharedTexture } = useSharedVideo();
  const { openPanel } = usePanel();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '50%' }
    );
    observer.observe(el);
    return () => observer.disconnect();
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

  // Mouse tracking (desktop) / auto-drift (mobile) — same as hero
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
      {/* Footer Tags - fade in when logo reaches center */}
      <div ref={footerTagsRef} className={styles.footerTags} style={{ opacity: 0 }}>
        <button className={styles.footerTag} onClick={() => document.getElementById('herstel-section')?.scrollIntoView({ behavior: 'smooth' })}>
          [START FYSIOTHERAPIE]
        </button>
        <button className={styles.footerTag} onClick={() => document.getElementById('leefstijl-section')?.scrollIntoView({ behavior: 'smooth' })}>
          [START LEEFSTIJL COACHING]
        </button>
      </div>

      {/* Mobile: socials + legal above CTA buttons */}
      {isMobile && (
        <div className={styles.footerMobileBottom}>
          <a href="/privacy" className={styles.footerMobileLegalLink}>Legal</a>
          <div className={styles.footerMobileSocials}>
            <a href="https://www.instagram.com/m.a.e.coaching.fysiotherapie/" target="_blank" rel="noopener noreferrer" className={styles.bottomBarSocialLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
          <a href="https://walters.studio" target="_blank" rel="noopener noreferrer" className={styles.footerMobileLegalLink}>by walters.studio</a>
        </div>
      )}

      {/* Mobile CTA buttons */}
      {isMobile && (
        <div className={styles.mobileCta}>
          <button className={styles.mobileCtaGreen} onClick={() => openPanel('start-nu', 'fysio')}>
            Fysiotherapie
          </button>
          <button className={styles.mobileCtaGray} onClick={() => openPanel('start-nu', 'leefstijl')}>
            Leefstijlcoaching
          </button>
        </div>
      )}

      {/* Bottom bar - desktop only */}
      {!isMobile && (
        <div className={styles.bottomBar}>
          <span className={styles.bottomBarText}>&copy; 2026 M.A.E. All rights reserved.</span>
          <div className={styles.bottomBarSocials}>
            <a href="https://www.instagram.com/m.a.e.coaching.fysiotherapie/" target="_blank" rel="noopener noreferrer" className={styles.bottomBarSocialLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
          <a href="https://walters.studio" target="_blank" rel="noopener noreferrer" className={styles.bottomBarLink}>Design &amp; Dev by walters.studio</a>
        </div>
      )}

      {/* Only render Canvas once screenSize is known */}
      {screenSize !== null && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 100], zoom, near: 0.1, far: 200 }}
          frameloop="demand"
          gl={{ antialias: isStrongHardware, alpha: true }}
          dpr={isStrongHardware ? [1, 1.5] : [1, 1]}
        >
          <Invalidator active={visible} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 10]} intensity={2.5} />

          <VideoPlane texture={sharedTexture} video={sharedVideo} brightness={0.18} />
          <Suspense fallback={null}>
            <group position={[0, getLogoYOffset(), 0]}>
              <Center precise>
                <Logo3D scale={scale} scrollProgressRef={scrollProgressRef} mouseRef={mouseRef} mode="footer" isMobile={isMobile} sharedTexture={sharedTexture} />
              </Center>
            </group>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
