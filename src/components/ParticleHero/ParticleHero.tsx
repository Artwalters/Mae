'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import Logo3D from './LogoParticles';
import WaterEffect from './WaterEffect';
import WaterEffectMobile from './WaterEffectMobile';
import styles from './ParticleHero.module.css';

export default function ParticleHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobiel: kleinere scale
  const scale = isMobile ? 0.055 : 0.15;

  return (
    <div className={styles.container}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom: isMobile ? 180 : 280, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Center precise>
            <Logo3D scale={scale} />
          </Center>
          {isMobile ? <WaterEffectMobile /> : <WaterEffect />}
        </Suspense>
      </Canvas>
    </div>
  );
}
