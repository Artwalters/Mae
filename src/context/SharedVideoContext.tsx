'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAutoplayRetry } from '@/hooks/useAutoplayRetry';
import * as THREE from 'three';
import cdn from '@/lib/cdn';

interface SharedVideoContextType {
  video: HTMLVideoElement | null;
  texture: THREE.VideoTexture | null;
}

const SharedVideoContext = createContext<SharedVideoContextType>({ video: null, texture: null });

export function useSharedVideo() {
  return useContext(SharedVideoContext);
}

export function SharedVideoProvider({ children }: { children: React.ReactNode }) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const vid = document.createElement('video');
    vid.src = `${cdn}/hero.mp4`;
    vid.crossOrigin = 'anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.autoplay = true;
    setVideo(vid);

    vid.addEventListener('canplay', () => {
      const tex = new THREE.VideoTexture(vid);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      textureRef.current = tex;
      setReady(true);
    }, { once: true });

    vid.play().catch(() => {});

    return () => {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
      textureRef.current?.dispose();
      setVideo(null);
    };
  }, []);

  useAutoplayRetry(video);

  return (
    <SharedVideoContext.Provider value={{ video, texture: ready ? textureRef.current : null }}>
      {children}
    </SharedVideoContext.Provider>
  );
}
