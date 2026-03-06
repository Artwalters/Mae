'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = `${cdn}/hero.mp4`;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    videoRef.current = video;

    video.addEventListener('canplay', () => {
      const tex = new THREE.VideoTexture(video);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      textureRef.current = tex;
      setReady(true);
    }, { once: true });

    video.play().catch(() => {});

    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      textureRef.current?.dispose();
    };
  }, []);

  return (
    <SharedVideoContext.Provider value={{ video: videoRef.current, texture: ready ? textureRef.current : null }}>
      {children}
    </SharedVideoContext.Provider>
  );
}
