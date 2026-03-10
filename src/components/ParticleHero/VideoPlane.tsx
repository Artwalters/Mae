'use client';

import { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VideoPlaneProps {
  texture: THREE.VideoTexture | null;
  video: HTMLVideoElement | null;
  brightness?: number;
  brightnessRef?: React.RefObject<{ value: number }>;
}

export default function VideoPlane({ texture, video, brightness = 0.18, brightnessRef }: VideoPlaneProps) {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uBrightness: { value: brightnessRef ? brightnessRef.current.value : brightness },
        uVideoAspect: { value: 1.0 },
        uScreenAspect: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uBrightness;
        uniform float uVideoAspect;
        uniform float uScreenAspect;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          if (uScreenAspect > uVideoAspect) {
            float scale = uVideoAspect / uScreenAspect;
            uv.y = (uv.y - 0.5) * scale + 0.5;
          } else {
            float scale = uScreenAspect / uVideoAspect;
            uv.x = (uv.x - 0.5) * scale + 0.5;
          }

          vec3 color = texture2D(uTexture, uv).rgb * uBrightness;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
    });
  }, [brightness]);

  useFrame(() => {
    if (!material.uniforms) return;

    material.uniforms.uBrightness.value = brightnessRef ? brightnessRef.current.value : brightness;

    if (texture) {
      material.uniforms.uTexture.value = texture;
      if (video && video.videoWidth && video.videoHeight) {
        material.uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
      }
    }
    material.uniforms.uScreenAspect.value = viewport.width / viewport.height;

    // Resize plane to fill viewport
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} />
    </mesh>
  );
}
