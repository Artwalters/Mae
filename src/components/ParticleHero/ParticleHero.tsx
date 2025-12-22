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
  uniform vec2 uMouse;
  uniform float uMouseRadius;

  varying vec3 vColor;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec3 pos = position;

    // Add offset from image position
    pos.x += offset.x;
    pos.y += offset.y;

    // Noise-based wobble animation - larger patterns, subtler movement
    float noiseX = snoise(vec2(offset.x * 0.005 + uTime * 0.2, offset.y * 0.005));
    float noiseY = snoise(vec2(offset.y * 0.005 + uTime * 0.18, offset.x * 0.005 + 100.0));
    float noiseZ = snoise(vec2(offset.x * 0.003 + offset.y * 0.003 + uTime * 0.15, random * 10.0));

    pos.x += noiseX * 4.0;
    pos.y += noiseY * 4.0;
    pos.z += noiseZ * 10.0;

    // Wave animation
    pos.z += sin(pos.x * uWaveFrequency + uTime) * uWaveAmplitude;
    pos.z += sin(pos.y * uWaveFrequency + uTime * 0.8) * uWaveAmplitude;

    // Mouse interaction - push particles away
    vec2 particlePos = vec2(pos.x, pos.y);
    float dist = distance(particlePos, uMouse);
    if (dist < uMouseRadius) {
      float force = (1.0 - dist / uMouseRadius) * 30.0;
      vec2 dir = normalize(particlePos - uMouse);
      pos.x += dir.x * force;
      pos.y += dir.y * force;
      pos.z += force * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Fixed size for orthographic camera
    gl_PointSize = uPointSize;

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
    camera: THREE.OrthographicCamera;
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

    // Use OrthographicCamera for better 2D particle coverage
    // Match the container's aspect ratio (656/204)
    const frustumSize = 100;
    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect,
      frustumSize * aspect,
      frustumSize,
      -frustumSize,
      1,
      1000
    );
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
          uPointSize: { value: 3.0 },
          uWaveFrequency: { value: 0.03 },
          uWaveAmplitude: { value: 5.0 },
          uMouse: { value: new THREE.Vector2(9999, 9999) },
          uMouseRadius: { value: 50.0 }
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
      const newAspect = newWidth / newHeight;

      const cam = sceneRef.current.camera;
      cam.left = -frustumSize * newAspect;
      cam.right = frustumSize * newAspect;
      cam.top = frustumSize;
      cam.bottom = -frustumSize;
      cam.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(newWidth, newHeight);
    };

    // Handle mouse move for particle interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !sceneRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Convert to scene coordinates
      const sceneX = ((x / rect.width) * 2 - 1) * frustumSize * (rect.width / rect.height);
      const sceneY = -((y / rect.height) * 2 - 1) * frustumSize;

      sceneRef.current.material.uniforms.uMouse.value.set(sceneX, sceneY);
    };

    const handleMouseLeave = () => {
      if (!sceneRef.current) return;
      // Move mouse far away when leaving
      sceneRef.current.material.uniforms.uMouse.value.set(9999, 9999);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
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
