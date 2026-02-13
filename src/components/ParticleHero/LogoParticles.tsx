'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import basePath from '@/lib/basePath';

const VIDEO_PATH = `${basePath}/img/hero.mp4`;

interface Logo3DProps {
  scale?: number;
  scrollProgress?: number;
  mode?: 'hero' | 'footer';
  isMobile?: boolean;
}

export default function Logo3D({ scale = 1, scrollProgress = 0, mode = 'hero', isMobile = false }: Logo3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  // Load GLB model
  const { scene } = useGLTF(`${basePath}/3D/maelogo2.glb`);

  // Create video texture and material once
  useEffect(() => {
    const video = document.createElement('video');
    video.src = VIDEO_PATH;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    videoRef.current = video;

    video.addEventListener('canplay', () => {
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.flipY = false;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.wrapS = THREE.ClampToEdgeWrapping;
      videoTexture.wrapT = THREE.ClampToEdgeWrapping;
      videoTexture.colorSpace = THREE.SRGBColorSpace;

      materialRef.current = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: videoTexture },
          rotateUV: { value: 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D map;
          uniform float rotateUV;
          varying vec2 vUv;
          void main() {
            vec3 edgeColor = vec3(0.616, 0.941, 0.196);
            float margin = 0.02;
            bool isEdge = vUv.x < margin || vUv.x > 1.0 - margin ||
                          vUv.y < margin || vUv.y > 1.0 - margin;
            vec2 uv = vUv;
            if (rotateUV > 0.5) {
              uv = vec2(1.0 - vUv.y, vUv.x);
            }
            if (isEdge) {
              gl_FragColor = vec4(edgeColor, 1.0);
            } else {
              gl_FragColor = texture2D(map, uv);
            }
          }
        `,
      });
      setReady(true);
    }, { once: true });

    video.play().catch(() => {});

    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      materialRef.current?.dispose();
    };
  }, []);

  // Clone and setup model with image texture
  const model = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (materialRef.current) {
          mesh.material = materialRef.current;
        } else {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
          });
        }
      }
    });

    return cloned;
  }, [scene, ready]);

  // Smooth rotation and position based on scroll
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Update UV rotation uniform
    if (materialRef.current) {
      materialRef.current.uniforms.rotateUV.value = 0.0;
    }

    {
      const maxTilt = Math.PI * 0.25;
      const maxDrop = 1.5;
      let targetRotationX: number;
      let targetY: number;

      if (mode === 'hero') {
        // Hero: starts centered, tilts backward + drops down
        targetRotationX = scrollProgress * -maxTilt;
        targetY = -(scrollProgress * scrollProgress) * maxDrop;
      } else {
        // Footer: starts above + tilted, comes down to center
        targetRotationX = -maxTilt * (1 - scrollProgress);
        targetY = maxDrop * (1 - scrollProgress);
      }

      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.1;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

// Preload model
useGLTF.preload(`${basePath}/3D/maelogo2.glb`);
