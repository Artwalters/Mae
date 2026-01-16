'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function WaterEffectMobile() {
  const { gl, size, scene, camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseDown = useRef(false);
  const lastInteractionTime = useRef(Date.now());
  const isInactive = useRef(false);

  // Mobile-safe buffers with proper WebGL extension checking
  // Using useRef to prevent recreation on size changes (which happen often on mobile)
  const buffersRef = useRef<{
    read: THREE.WebGLRenderTarget;
    write: THREE.WebGLRenderTarget;
    scene: THREE.WebGLRenderTarget;
    hasFloatSupport: boolean;
    textureType: THREE.TextureDataType;
    resolution: number;
  } | null>(null);

  const buffers = useMemo(() => {
    // Return existing buffers if already created
    if (buffersRef.current) {
      return buffersRef.current;
    }

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

    const filtering = textureType === THREE.UnsignedByteType ? THREE.LinearFilter : THREE.NearestFilter;

    const options = {
      minFilter: filtering,
      magFilter: filtering,
      format: THREE.RGBAFormat,
      type: textureType,
      generateMipmaps: false
    };

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const baseResolution = 512;
    const resolution = Math.floor(baseResolution / Math.max(pixelRatio, 1.2));

    // Use fixed scene resolution to prevent recreation on viewport size changes
    const sceneSize = Math.max(window.innerWidth, window.innerHeight) * pixelRatio;

    buffersRef.current = {
      read: new THREE.WebGLRenderTarget(resolution, resolution, options),
      write: new THREE.WebGLRenderTarget(resolution, resolution, options),
      scene: new THREE.WebGLRenderTarget(sceneSize, sceneSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        generateMipmaps: false
      }),
      hasFloatSupport,
      textureType,
      resolution
    };

    return buffersRef.current;
  }, [gl]);

  // Adaptive shader based on texture support
  const simMaterial = useMemo(() => {
    const hasFloatSupport = buffers.hasFloatSupport;

    return new THREE.ShaderMaterial({
      uniforms: {
        uPrevious: { value: null },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseDown: { value: 0 },
        uDelta: { value: 1.0 },
        uHasFloatSupport: { value: hasFloatSupport ? 1.0 : 0.0 },
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
        uniform float uMouseDown;
        uniform float uDelta;
        uniform float uHasFloatSupport;
        uniform float uIsInactive;
        varying vec2 vUv;

        void main() {
          vec2 texel = 1.0 / vec2(${buffers.resolution}.0);

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

          float velocityDamping, pressureDamping;
          if (uHasFloatSupport < 0.5) {
            velocityDamping = (uIsInactive > 0.5) ? 0.90 : 0.985;
            pressureDamping = (uIsInactive > 0.5) ? 0.92 : 0.990;
          } else {
            velocityDamping = (uIsInactive > 0.5) ? 0.95 : 0.998;
            pressureDamping = (uIsInactive > 0.5) ? 0.96 : 0.999;
          }

          velocity *= velocityDamping;
          pressure *= pressureDamping;

          if (uHasFloatSupport < 0.5) {
            pressure = clamp(pressure, -0.5, 0.5);
            velocity = clamp(velocity, -0.5, 0.5);
          }

          // Touch interaction
          if (uMouseDown > 0.5) {
            float dist = distance(vUv, uMouse);
            float swipeRadius = 0.12;
            float swipeStrength = 0.3;

            if (dist < swipeRadius) {
              float falloff = smoothstep(swipeRadius, 0.0, dist);
              float turbulence = sin(vUv.x * 30.0 + uTime) * cos(vUv.y * 30.0 - uTime) * 0.2;
              float effect = falloff * swipeStrength;
              pressure += effect * (1.0 + turbulence);
            }
          }

          // Idle waves
          if (uIsInactive < 0.5) {
            float idleWaveStrength = 0.09;
            float idleSpeed = 0.5;
            float wave1 = sin(vUv.x * 10.0 + uTime * idleSpeed) * 0.5;
            float wave2 = sin(vUv.y * 7.0 + uTime * idleSpeed * 0.8) * 0.4;
            float wave3 = sin((vUv.x + vUv.y) * 5.0 + uTime * idleSpeed * 1.2) * 0.3;
            float idleDisturbance = (wave1 + wave2 + wave3) * idleWaveStrength;
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

  // Display material
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

          float distortionStrength = 0.09;
          vec2 distortion = vec2(gradX, gradY) * distortionStrength;
          vec2 distortedUv = vUv + distortion;

          // Green chromatic aberration
          float aberrationStrength = 0.012;
          vec2 aberrationOffset = distortion * aberrationStrength / max(distortionStrength, 0.001);

          vec2 uvCenter = clamp(distortedUv, 0.0001, 0.9999);
          vec2 uvOffset = clamp(distortedUv + aberrationOffset, 0.0001, 0.9999);

          vec4 centerColor = texture2D(uSceneTexture, uvCenter);
          vec4 offsetColor = texture2D(uSceneTexture, uvOffset);

          // Accent green: #9DF032
          vec3 accentGreen = vec3(0.616, 0.941, 0.196);

          vec3 greenOffset = offsetColor.rgb * accentGreen;
          vec3 finalRgb = max(centerColor.rgb, greenOffset);

          vec4 sceneColor = vec4(finalRgb, centerColor.a);

          if (sceneColor.a < 0.01) {
            sceneColor = vec4(1.0, 1.0, 1.0, 1.0);
          }

          vec3 waterColor = vec3(0.98, 0.99, 1.0);

          vec3 normal = normalize(vec3(-gradX, 0.1, -gradY));
          vec3 lightDir = normalize(vec3(-0.3, 1.0, 0.3));

          float depth = abs(pressure) * 2.0 + 0.1;
          float depthAttenuation = exp(-depth * 0.5);

          float spec = pow(max(dot(normal, lightDir), 0.0), 50.0) * depthAttenuation;

          float volumetricScatter = 1.0 - exp(-depth * 0.5);
          vec3 scatterColor = vec3(0.95, 0.97, 1.0);

          float causticScale = 6.0;
          float caustic = sin(vUv.x * causticScale + uTime * 0.3) * sin(vUv.y * causticScale + uTime * 0.2);
          caustic *= exp(-depth * 1.0) * 0.12;

          vec3 finalColor = sceneColor.rgb * waterColor;
          finalColor = mix(finalColor, scatterColor, volumetricScatter * 0.05);
          finalColor += vec3(caustic) * 0.1;

          float effectStrength = 0.04;
          float pressureStrength = 0.01;

          finalColor += vec3(spec) * effectStrength;
          finalColor += pressure * pressureStrength;

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
        mouse.current.x = e.touches[0].clientX / window.innerWidth;
        mouse.current.y = 1.0 - (e.touches[0].clientY / window.innerHeight);
        lastInteractionTime.current = Date.now();
        isInactive.current = false;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX / window.innerWidth;
        mouse.current.y = 1.0 - (e.touches[0].clientY / window.innerHeight);
        mouseDown.current = true;
        lastInteractionTime.current = Date.now();
        isInactive.current = false;
      }
    };

    const handleTouchEnd = () => {
      mouseDown.current = false;
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // WebGL context loss recovery
  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost - WaterEffectMobile');
    };

    const handleContextRestored = () => {
      console.warn('WebGL context restored - WaterEffectMobile');
      lastInteractionTime.current = Date.now();
      isInactive.current = false;
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  // Simulation scene
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

    // After 30 seconds of inactivity, apply stronger damping
    if (timeSinceLastInteraction > 30000) {
      isInactive.current = true;
    }

    const clampedDelta = Math.min(delta * 60, 1.4);
    const currentTarget = gl.getRenderTarget();

    // 1. Water simulation
    try {
      if (simMaterial.uniforms && buffers.read && buffers.write) {
        simMaterial.uniforms.uPrevious.value = buffers.read.texture;
        const safeTime = (state.clock.elapsedTime * 0.3) % 1000;
        simMaterial.uniforms.uTime.value = safeTime;
        simMaterial.uniforms.uMouse.value.copy(mouse.current);
        simMaterial.uniforms.uMouseDown.value = mouseDown.current ? 1.0 : 0.0;
        simMaterial.uniforms.uDelta.value = clampedDelta;
        simMaterial.uniforms.uIsInactive.value = isInactive.current ? 1.0 : 0.0;

        gl.setRenderTarget(buffers.write);
        gl.clear();
        gl.render(simScene, simCamera);

        const temp = buffers.read;
        buffers.read = buffers.write;
        buffers.write = temp;
      }
    } catch (error) {
      console.warn('Water simulation error:', error);
    }

    // 2. Scene capture
    try {
      if (meshRef.current && buffers.scene) {
        meshRef.current.visible = false;

        gl.setRenderTarget(buffers.scene);
        gl.setClearColor(new THREE.Color(0x1a1a1a), 1.0);
        gl.clear();
        gl.render(scene, camera);

        meshRef.current.visible = true;
      }
    } catch (error) {
      console.warn('Scene capture error:', error);
      if (meshRef.current) meshRef.current.visible = true;
    }

    // 3. Update display material
    try {
      if (material.uniforms && buffers.read && buffers.scene) {
        material.uniforms.uWaterTexture.value = buffers.read.texture;
        material.uniforms.uSceneTexture.value = buffers.scene.texture;
        material.uniforms.uTime.value = state.clock.elapsedTime;
      }
    } catch (error) {
      console.warn('Display material error:', error);
    }

    gl.setRenderTarget(currentTarget);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 10]}
      frustumCulled={false}
      renderOrder={9999}
    >
      <planeGeometry args={[2, 2]} />
      <primitive object={material} />
    </mesh>
  );
}
