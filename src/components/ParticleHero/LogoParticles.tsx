'use client';

import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Logo3DProps {
  scale?: number;
  scrollProgress?: number;
  isFooterArea?: boolean;
}

export default function Logo3D({ scale = 1, scrollProgress = 0, isFooterArea = false }: Logo3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load GLB model
  const { scene } = useGLTF('/3D/mae.glb');

  // Clone and setup in useMemo - solid white with shaded edges
  const model = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1,
          metalness: 0,
        });
      }
    });

    return cloned;
  }, [scene]);

  // Smooth rotation based on scroll
  useFrame(() => {
    if (groupRef.current) {
      let targetRotationX: number;
      const maxTilt = Math.PI * 0.25;

      if (isFooterArea) {
        // Footer: start tilted backwards, scroll to upright
        targetRotationX = -maxTilt * (1 - scrollProgress);
      } else {
        // Top: start upright, scroll to tilted backwards
        targetRotationX = scrollProgress * -maxTilt;
      }

      // Smooth interpolation
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

// Preload model
useGLTF.preload('/3D/mae.glb');
