'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './ParticleHero.module.css';

const vertexShader = `
  attribute vec2 offset;
  attribute float random;
  attribute vec3 color;
  uniform float uTime;
  uniform float uPointSize;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;

  varying vec3 vColor;

  void main() {
    vec3 pos = position;

    // Add offset from image position
    pos.x += offset.x;
    pos.y += offset.y;

    // Wave animation (like original)
    pos.z += sin(pos.x * uWaveFrequency + uTime) * uWaveAmplitude;
    pos.z += sin(pos.y * uWaveFrequency + uTime * 0.8) * uWaveAmplitude;

    // Subtle floating
    pos.x += sin(uTime * 0.3 + random * 6.28) * 0.5;
    pos.y += cos(uTime * 0.4 + random * 3.14) * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size based on distance
    gl_PointSize = uPointSize * (300.0 / -mvPosition.z);

    vColor = color;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    // Circular particle with soft edges
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

export default function ParticleHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    material: THREE.ShaderMaterial;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Load image and create particles
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/img/run.png';

    img.onload = () => {
      // Create canvas to read pixel data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Scale down for performance (more particles = slower)
      const scale = 0.4;
      const imgWidth = Math.floor(img.width * scale);
      const imgHeight = Math.floor(img.height * scale);

      canvas.width = imgWidth;
      canvas.height = imgHeight;
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

      const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
      const data = imageData.data;

      // Create particle positions based on image pixels
      const positions: number[] = [];
      const offsets: number[] = [];
      const randoms: number[] = [];
      const colors: number[] = [];
      const threshold = 30; // Brightness threshold

      for (let y = 0; y < imgHeight; y++) {
        for (let x = 0; x < imgWidth; x++) {
          const i = (y * imgWidth + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;

          // Only create particle if bright enough
          if (brightness > threshold) {
            positions.push(0, 0, 0);
            offsets.push(
              (x - imgWidth / 2) * 1.2,
              -(y - imgHeight / 2) * 1.2
            );
            randoms.push(Math.random());
            // Grayscale color based on brightness
            const gray = brightness / 255;
            colors.push(gray, gray, gray);
          }
        }
      }

      // Create geometry
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 2));
      geometry.setAttribute('random', new THREE.Float32BufferAttribute(randoms, 1));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      // Create material with shaders
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPointSize: { value: 2.0 },
          uWaveFrequency: { value: 0.02 },
          uWaveAmplitude: { value: 3.0 }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      sceneRef.current = { scene, camera, renderer, particles, material };
    };

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (sceneRef.current) {
        const { material } = sceneRef.current;
        material.uniforms.uTime.value = clock.getElapsedTime();
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      sceneRef.current.camera.aspect = newWidth / newHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      if (sceneRef.current) {
        sceneRef.current.particles.geometry.dispose();
        sceneRef.current.material.dispose();
        sceneRef.current.renderer.dispose();
      }

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.container} />;
}
