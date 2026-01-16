'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Logo3DProps {
  scale?: number;
}

export default function Logo3D({ scale = 1 }: Logo3DProps) {
  // Load GLB model
  const { scene } = useGLTF('/3D/mae.glb');

  // Clone and setup in useMemo
  const model = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide
        });
      }
    });

    return cloned;
  }, [scene]);

  return (
    <group scale={scale}>
      <primitive object={model} />
    </group>
  );
}

// Preload model
useGLTF.preload('/3D/mae.glb');
