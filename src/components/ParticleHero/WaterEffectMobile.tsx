'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function WaterEffectMobile() {
  const { gl, size, scene, camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseVelocity = useRef(new THREE.Vector2(0, 0));
  const lastInteractionTime = useRef(Date.now());
  const isInactive = useRef(false);
  const lastResetTime = useRef(Date.now());
  const needsReset = useRef(false);

  // Mobile-safe buffers
  const buffers = useMemo(() => {
    const glContext = gl.getContext();
    let textureType: THREE.TextureDataType = THREE.UnsignedByteType;
    let hasFloatSupport = false;

    if (glContext instanceof WebGL2RenderingContext) {
      const floatExt = glContext.getExtension('EXT_color_buffer_float');
      if (floatExt) {
        textureType = THREE.FloatType;
        hasFloatSupport = true;
      } else {
        textureType = THREE.HalfFloatType;
      }
    } else {
      const halfFloatExt = glContext.getExtension('OES_texture_half_float');
      const halfFloatLinearExt = glContext.getExtension('OES_texture_half_float_linear');
      if (halfFloatExt && halfFloatLinearExt) {
        textureType = THREE.HalfFloatType;
      }
    }

    const resolution = 512;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    return {
      read: new THREE.WebGLRenderTarget(resolution, resolution, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: textureType,
        generateMipmaps: false
      }),
      write: new THREE.WebGLRenderTarget(resolution, resolution, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: textureType,
        generateMipmaps: false
      }),
      scene: new THREE.WebGLRenderTarget(
        Math.floor(size.width * pixelRatio * 0.8),
        Math.floor(size.height * pixelRatio * 0.8),
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          generateMipmaps: false
        }
      ),
      hasFloatSupport,
      resolution
    };
  }, [gl, size]);

  const simMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uPrevious: { value: null },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) },
        uDelta: { value: 1.0 },
        uHasFloatSupport: { value: buffers.hasFloatSupport ? 1.0 : 0.0 },
        uIsInactive: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uPrevious;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uMouseVelocity;
        uniform float uDelta;
        uniform float uHasFloatSupport;
        uniform float uIsInactive;
        varying vec2 vUv;

        void main() {
          vec2 texel = 1.0 / vec2(512.0);

          vec4 prev = texture2D(uPrevious, vUv);
          float pressure, velocity;

          if (uHasFloatSupport > 0.5) {
            pressure = prev.x;
            velocity = prev.y;
          } else {
            pressure = prev.x * 2.0 - 1.0;
            velocity = prev.y * 2.0 - 1.0;
          }

          vec4 leftSample = texture2D(uPrevious, vUv - vec2(texel.x, 0.0));
          vec4 rightSample = texture2D(uPrevious, vUv + vec2(texel.x, 0.0));
          vec4 upSample = texture2D(uPrevious, vUv + vec2(0.0, texel.y));
          vec4 downSample = texture2D(uPrevious, vUv - vec2(0.0, texel.y));

          float left, right, up, down;
          if (uHasFloatSupport > 0.5) {
            left = leftSample.x;
            right = rightSample.x;
            up = upSample.x;
            down = downSample.x;
          } else {
            left = leftSample.x * 2.0 - 1.0;
            right = rightSample.x * 2.0 - 1.0;
            up = upSample.x * 2.0 - 1.0;
            down = downSample.x * 2.0 - 1.0;
          }

          float delta = min(uDelta, 1.0);
          velocity += delta * (-2.0 * pressure + left + right) * 0.1875;
          velocity += delta * (-2.0 * pressure + up + down) * 0.1875;

          pressure += delta * velocity;

          float velocityDamping = (uHasFloatSupport < 0.5) ? 0.985 : 0.998;
          float pressureDamping = (uHasFloatSupport < 0.5) ? 0.990 : 0.999;

          if (uIsInactive > 0.5) {
            velocityDamping = 0.90;
            pressureDamping = 0.92;
          }

          velocity *= velocityDamping;
          pressure *= pressureDamping;

          if (uHasFloatSupport < 0.5) {
            pressure = clamp(pressure, -0.5, 0.5);
            velocity = clamp(velocity, -0.5, 0.5);
          }

          // Touch interaction
          float dist = distance(vUv, uMouse);
          float swipeRadius = 0.15;
          float swipeStrength = 0.5;

          vec2 flowDir = normalize(uMouseVelocity + vec2(0.001));
          float velocityMagnitude = length(uMouseVelocity) * 15.0;

          if (dist < swipeRadius && velocityMagnitude > 0.01) {
            vec2 toMouse = vUv - uMouse;
            float alongFlow = dot(toMouse, flowDir);
            float trailFactor = smoothstep(-swipeRadius * 0.5, swipeRadius * 1.5, -alongFlow);
            float falloff = smoothstep(swipeRadius, 0.0, dist);
            float turbulence = sin(vUv.x * 30.0 + uTime) * cos(vUv.y * 30.0 - uTime) * 0.2;
            float effect = falloff * trailFactor * swipeStrength * (1.0 + velocityMagnitude);
            pressure += effect * (1.0 + turbulence);
            velocity += effect * dot(toMouse, flowDir) * 0.3;
          }

          // Simplified idle waves for mobile
          if (uIsInactive < 0.5) {
            float idleWaveStrength = 0.02;
            float idleSpeed = 0.3;
            float wave1 = sin(vUv.x * 8.0 + uTime * idleSpeed) * 0.5;
            float wave2 = sin(vUv.y * 6.0 + uTime * idleSpeed * 0.8) * 0.5;
            float idleDisturbance = (wave1 + wave2) * idleWaveStrength;
            pressure += idleDisturbance;
          }

          float gradX = (right - left) * 0.5;
          float gradY = (up - down) * 0.5;

          if (uHasFloatSupport > 0.5) {
            gl_FragColor = vec4(pressure, velocity, gradX, gradY);
          } else {
            gl_FragColor = vec4(
              (pressure + 1.0) * 0.5,
              (velocity + 1.0) * 0.5,
              (gradX + 1.0) * 0.5,
              (gradY + 1.0) * 0.5
            );
          }
        }
      `
    });
  }, [buffers]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uWaterTexture: { value: null },
        uSceneTexture: { value: null },
        uTime: { value: 0 },
        uHasFloatSupport: { value: buffers.hasFloatSupport ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uWaterTexture;
        uniform sampler2D uSceneTexture;
        uniform float uTime;
        uniform float uHasFloatSupport;
        varying vec2 vUv;

        void main() {
          vec4 water = texture2D(uWaterTexture, vUv);
          float pressure, gradX, gradY;

          if (uHasFloatSupport > 0.5) {
            pressure = water.x;
            gradX = water.z;
            gradY = water.w;
          } else {
            pressure = water.x * 2.0 - 1.0;
            gradX = water.z * 2.0 - 1.0;
            gradY = water.w * 2.0 - 1.0;
          }

          float distortionStrength = 0.07;
          vec2 distortion = vec2(gradX, gradY) * distortionStrength;
          vec2 distortedUv = vUv + distortion;

          // Green chromatic aberration - boosted for mobile
          float aberrationStrength = 0.012;
          vec2 aberrationOffset = distortion * aberrationStrength / max(distortionStrength, 0.001);

          vec2 uvCenter = clamp(distortedUv, 0.001, 0.999);
          vec2 uvOffset = clamp(distortedUv + aberrationOffset, 0.001, 0.999);

          vec4 centerColor = texture2D(uSceneTexture, uvCenter);
          vec4 offsetColor = texture2D(uSceneTexture, uvOffset);

          // Accent green: #9DF032
          vec3 accentGreen = vec3(0.616, 0.941, 0.196);

          vec3 greenOffset = offsetColor.rgb * accentGreen;

          // Boost green visibility on mobile
          float distortionAmount = length(distortion) * 8.0;
          vec3 boostedGreen = greenOffset + accentGreen * distortionAmount * 0.25;

          vec3 finalRgb = max(centerColor.rgb, boostedGreen);

          vec4 sceneColor = vec4(finalRgb, centerColor.a);

          vec3 waterColor = vec3(0.99, 0.995, 1.0);
          vec3 finalColor = sceneColor.rgb * waterColor;
          finalColor += pressure * 0.01;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: false,
      depthTest: false,
      depthWrite: false
    });
  }, [buffers]);

  // Touch tracking
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const newX = e.touches[0].clientX / window.innerWidth;
        const newY = 1.0 - (e.touches[0].clientY / window.innerHeight);
        mouseVelocity.current.x = newX - mouse.current.x;
        mouseVelocity.current.y = newY - mouse.current.y;
        mouse.current.x = newX;
        mouse.current.y = newY;
        lastInteractionTime.current = Date.now();
        isInactive.current = false;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX / window.innerWidth;
        mouse.current.y = 1.0 - (e.touches[0].clientY / window.innerHeight);
        lastInteractionTime.current = Date.now();
        isInactive.current = false;
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const simScene = useMemo(() => {
    const s = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, simMaterial);
    s.add(mesh);
    return s;
  }, [simMaterial]);

  const simCamera = useMemo(() => {
    return new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }, []);

  useFrame((state, delta) => {
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionTime.current;
    const timeSinceLastReset = now - lastResetTime.current;

    if (timeSinceLastInteraction > 30000) {
      isInactive.current = true;
      if (Math.floor(state.clock.elapsedTime * 30) % 2 === 0) return;
    }

    if (!buffers.hasFloatSupport && timeSinceLastReset > 45000) {
      needsReset.current = true;
      lastResetTime.current = now;
    }

    const clampedDelta = Math.min(delta * 60, 1.4);
    const currentTarget = gl.getRenderTarget();

    try {
      if (needsReset.current) {
        gl.setRenderTarget(buffers.read);
        gl.clear();
        gl.setRenderTarget(buffers.write);
        gl.clear();
        needsReset.current = false;
      }

      simMaterial.uniforms.uPrevious.value = buffers.read.texture;
      simMaterial.uniforms.uTime.value = (state.clock.elapsedTime * 0.3) % 1000;
      simMaterial.uniforms.uMouse.value.copy(mouse.current);
      simMaterial.uniforms.uMouseVelocity.value.copy(mouseVelocity.current);
      simMaterial.uniforms.uDelta.value = clampedDelta;
      simMaterial.uniforms.uIsInactive.value = isInactive.current ? 1.0 : 0.0;

      mouseVelocity.current.multiplyScalar(0.95);

      gl.setRenderTarget(buffers.write);
      gl.clear();
      gl.render(simScene, simCamera);

      const temp = buffers.read;
      buffers.read = buffers.write;
      buffers.write = temp;
    } catch (e) {
      console.warn('Water sim error:', e);
    }

    try {
      if (meshRef.current) {
        meshRef.current.visible = false;
        gl.setRenderTarget(buffers.scene);
        gl.setClearColor(new THREE.Color(0x1a1a1a), 1.0);
        gl.clear();
        gl.render(scene, camera);
        meshRef.current.visible = true;
      }
    } catch (e) {
      console.warn('Scene capture error:', e);
      if (meshRef.current) meshRef.current.visible = true;
    }

    try {
      material.uniforms.uWaterTexture.value = buffers.read.texture;
      material.uniforms.uSceneTexture.value = buffers.scene.texture;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    } catch (e) {
      console.warn('Display error:', e);
    }

    gl.setRenderTarget(currentTarget);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 10]} frustumCulled={false} renderOrder={9999}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} />
    </mesh>
  );
}
