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
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

type ScreenSize = 'mobile' | 'tablet-sm' | 'tablet-md' | 'tablet' | 'desktop-sm' | 'desktop' | null;

export default function ParticleHero() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFooterArea, setIsFooterArea] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);

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
      scrub: 1.5,
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

  // Menu hide on scroll with stagger effect
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const menuItems = menu.querySelectorAll('a');
    let menuHidden = false;

    // Set initial state
    gsap.set(menuItems, { yPercent: 0, opacity: 1 });

    const showMenu = () => {
      if (!menuHidden) return;
      menuHidden = false;
      gsap.to(menuItems, {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'expo.out',
        overwrite: true
      });
    };

    const hideMenu = () => {
      if (menuHidden) return;
      menuHidden = true;
      gsap.to(menuItems, {
        yPercent: -110,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.inOut',
        overwrite: true
      });
    };

    // Top trigger - hide when scrolling away from top
    const topTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '100px top',
      onLeave: hideMenu,
      onEnterBack: showMenu
    });

    // Footer trigger - show when reaching footer
    const footerTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'bottom bottom+=200',
      end: 'bottom bottom',
      onEnter: showMenu,
      onLeaveBack: hideMenu
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
      case 'tablet-md':
        return { scale: 0.095, zoom: 210 };
      case 'tablet':
        return { scale: 0.11, zoom: 220 };
      case 'desktop-sm':
        return { scale: 0.13, zoom: 250 };
      case 'desktop':
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
      {/* Menu */}
      <nav ref={menuRef} className={styles.menu}>
        <a href="#home" className={styles.menuItem}>HOME</a>
        <a href="#trajecten" className={styles.menuItem}>TRAJECTEN</a>
        <a href="#over" className={styles.menuItem}>OVER</a>
        <a href="#contact" className={styles.menuItem}>CONTACT</a>
      </nav>

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
              <Logo3D scale={scale} scrollProgress={scrollProgress} isFooterArea={isFooterArea} isVisible={isVisible} />
            </Center>
          </group>
          {WaterComponent && <WaterComponent />}
        </Suspense>
      </Canvas>
    </div>
  );
}
