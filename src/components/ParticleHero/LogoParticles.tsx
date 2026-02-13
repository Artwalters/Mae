'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import basePath from '@/lib/basePath';

interface Logo3DProps {
  scale?: number;
  scrollProgressRef?: React.RefObject<number>;
  mode?: 'hero' | 'footer';
  isMobile?: boolean;
  sharedTexture?: THREE.VideoTexture | null;
}

export default function Logo3D({ scale = 1, scrollProgressRef, mode = 'hero', isMobile = false, sharedTexture }: Logo3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
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
        varying vec2 vUv;
        void main() {
          vec3 edgeColor = vec3(0.616, 0.941, 0.196);
          float margin = 0.02;
          bool isEdge = vUv.x < margin || vUv.x > 1.0 - margin ||
                        vUv.y < margin || vUv.y > 1.0 - margin;
          if (isEdge) {
            gl_FragColor = vec4(edgeColor, 1.0);
          } else {
            gl_FragColor = texture2D(map, vUv);
          }
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
  useFrame(() => {
    if (!groupRef.current) return;

    {
      const scrollProgress = scrollProgressRef?.current ?? 0;
      const maxTilt = Math.PI * 0.25;
      const maxDrop = 1.5;
      let targetRotationX: number;
      let targetY: number;

      if (mode === 'hero') {
        targetRotationX = scrollProgress * -maxTilt;
        targetY = -(scrollProgress * scrollProgress) * maxDrop;
      } else {
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
