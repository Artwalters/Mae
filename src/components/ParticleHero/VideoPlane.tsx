'use client';

import { useRef, useMemo, useEffect } from 'react';
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
          float screenWider = step(uVideoAspect, uScreenAspect);
          float scaleY = uVideoAspect / uScreenAspect;
          float scaleX = uScreenAspect / uVideoAspect;
          uv.y = mix(uv.y, (uv.y - 0.5) * scaleY + 0.5, screenWider);
          uv.x = mix(uv.x, (uv.x - 0.5) * scaleX + 0.5, 1.0 - screenWider);

          vec3 color = texture2D(uTexture, uv).rgb * uBrightness;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
    });
  }, [brightness]);

  useEffect(() => {
    return () => { material.dispose(); };
  }, [material]);

  // Set texture once when it becomes available
  useEffect(() => {
    if (texture) {
      material.uniforms.uTexture.value = texture;
    }
  }, [texture, material]);

  useFrame(() => {
    material.uniforms.uBrightness.value = brightnessRef ? brightnessRef.current.value : brightness;

    if (video && video.videoWidth) {
      material.uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
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
