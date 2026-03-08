'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import basePath from '@/lib/basePath';

interface Logo3DProps {
  scale?: number;
  scrollProgressRef?: React.RefObject<number>;
  mouseRef?: React.RefObject<{ x: number; y: number }>;
  mode?: 'hero' | 'footer';
  isMobile?: boolean;
  sharedTexture?: THREE.VideoTexture | null;
  introOffsetRef?: React.RefObject<number>;
  onReady?: () => void;
}

export default function Logo3D({ scale = 1, scrollProgressRef, mouseRef, mode = 'hero', isMobile = false, sharedTexture, introOffsetRef, onReady }: Logo3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const initializedRef = useRef(false);
  const [ready, setReady] = useState(false);

  // Load GLB model
  const { scene } = useGLTF(`${basePath}/3D/maelogo2.glb`);

  // Create shader material using shared texture
  useEffect(() => {
    if (!sharedTexture) return;

    // Clone texture for flipY override without affecting shared instance
    const tex = sharedTexture.clone();
    tex.flipY = false;

    materialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: tex },
        uMobile: { value: isMobile ? 1.0 : 0.0 },
        uTime: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec2 vScreenPos;
        void main() {
          vUv = vec2(uv.x, uv.y - 0.1);
          vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vScreenPos = clipPos.xy / clipPos.w * 0.5 + 0.5;
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float uMobile;
        uniform float uTime;
        varying vec2 vUv;
        varying vec2 vScreenPos;
        void main() {
          vec3 edgeColor = vec3(0.616, 0.941, 0.196);
          float margin = 0.02;
          bool isEdge = vUv.x < margin || vUv.x > 1.0 - margin ||
                        vUv.y < margin || vUv.y > 1.0 - margin;

          vec3 color;
          if (isEdge) {
            color = edgeColor;
          } else {
            color = texture2D(map, vUv).rgb;
          }

          if (uMobile > 0.5) {
            float gray = dot(color, vec3(0.299, 0.587, 0.114));
            vec3 grayColor = vec3(gray);

            vec2 reveal = vec2(
              0.5 + sin(uTime * 0.4) * 0.3 + sin(uTime * 1.1) * 0.15,
              0.5 + cos(uTime * 0.3) * 0.25 + sin(uTime * 0.9) * 0.15
            );
            float dist = distance(vScreenPos, reveal);
            float radius = 0.35;
            float blend = smoothstep(radius, radius * 0.15, dist);
            color = mix(grayColor, color, blend);
          }

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    setReady(true);

    return () => {
      materialRef.current?.dispose();
    };
  }, [sharedTexture]);

  // Clone and setup model with material
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
  useFrame((state) => {
    if (!groupRef.current) return;

    if (materialRef.current?.uniforms.uTime) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    {
      const scrollProgress = scrollProgressRef?.current ?? 0;
      const maxTilt = Math.PI * 0.25;
      const maxDrop = 1.5;
      let targetRotationX: number;
      let targetY: number;

      if (mode === 'hero') {
        // Intro offset pushes logo below screen (only applies to hero)
        const introProgress = introOffsetRef?.current ?? 0;
        const combinedProgress = Math.min(scrollProgress + introProgress, 2.0);
        targetRotationX = combinedProgress * -maxTilt;
        targetY = -(combinedProgress * combinedProgress) * maxDrop;
      } else {
        targetRotationX = -maxTilt * (1 - scrollProgress);
        targetY = maxDrop * (1 - scrollProgress);
      }

      // Mouse-based tilt
      const mouse = mouseRef?.current ?? { x: 0, y: 0 };
      const mouseTilt = isMobile ? 0.25 : 0.15;
      const targetRotationY = mouse.x * mouseTilt;
      const targetMouseTiltX = mouse.y * -mouseTilt * 0.5;

      // On first frame in hero mode, snap to off-screen position and signal ready.
      // Force introOffsetRef back to 2.0 in case GSAP already started animating
      // while the model was still loading (race condition).
      if (!initializedRef.current && mode === 'hero' && introOffsetRef) {
        initializedRef.current = true;
        (introOffsetRef as React.MutableRefObject<number>).current = 2.0;
        const resetProgress = Math.min(scrollProgress + 2.0, 2.0);
        targetRotationX = resetProgress * -maxTilt;
        targetY = -(resetProgress * resetProgress) * maxDrop;
        groupRef.current.rotation.x = targetRotationX + targetMouseTiltX;
        groupRef.current.rotation.y = targetRotationY;
        groupRef.current.position.y = targetY;
        onReady?.();
      } else {
        groupRef.current.rotation.x += (targetRotationX + targetMouseTiltX - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
      }
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
