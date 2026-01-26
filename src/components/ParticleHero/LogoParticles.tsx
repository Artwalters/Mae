'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Logo3DProps {
  scale?: number;
  scrollProgress?: number;
  isFooterArea?: boolean;
  isVisible?: boolean;
}

export default function Logo3D({ scale = 1, scrollProgress = 0, isFooterArea = false, isVisible = true }: Logo3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  // Load GLB model
  const { scene } = useGLTF('/3D/maeuv.glb');

  // Create video texture
  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/img/AQMTzMDuVTIRrLNqrx8zf-LcH3kAxPTsS1MtYKHCy52bZWFvJsg398TWhL7vLuXlk7AjSlswzlKwC6bEATzRL6xg.mp4';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.flipY = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    setVideoTexture(texture);

    return () => {
      video.pause();
      video.src = '';
      texture.dispose();
    };
  }, []);

  // Shader material met grijze randen
  const videoMaterial = useMemo(() => {
    if (!videoTexture) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: videoTexture },
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
          // Fel wit voor de randen
          vec3 edgeColor = vec3(1.1);

          // Check of UV binnen valide bereik is (met marge voor randen)
          float margin = 0.02;
          bool isEdge = vUv.x < margin || vUv.x > 1.0 - margin ||
                        vUv.y < margin || vUv.y > 1.0 - margin;

          if (isEdge) {
            gl_FragColor = vec4(edgeColor, 1.0);
          } else {
            vec4 color = texture2D(map, vUv);

            // Convert to grayscale
            float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));

            // Increase contrast
            float contrast = 1.8;
            luminance = (luminance - 0.5) * contrast + 0.5;
            luminance = clamp(luminance, 0.0, 1.0);

            // Add emissive glow - boost bright areas
            float emissive = pow(luminance, 0.8) * 1.4;
            emissive = clamp(emissive, 0.0, 1.5);

            vec3 finalColor = vec3(emissive);

            gl_FragColor = vec4(finalColor, 1.0);
          }
        }
      `,
    });
  }, [videoTexture]);

  // Clone and setup model with video texture
  const model = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (videoMaterial) {
          mesh.material = videoMaterial;
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
  }, [scene, videoMaterial]);

  // Smooth rotation and visibility based on scroll
  useFrame(() => {
    if (groupRef.current) {
      // Handle visibility with smooth fade
      const targetScale = isVisible ? scale : 0;
      const currentScale = groupRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      groupRef.current.scale.set(newScale, newScale, newScale);

      // Handle rotation
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
    <group ref={groupRef} scale={isVisible ? scale : 0}>
      <primitive object={model} />
    </group>
  );
}

// Preload model
useGLTF.preload('/3D/maeuv.glb');
