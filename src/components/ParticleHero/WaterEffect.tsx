'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function WaterEffect() {
  const { gl, size, scene, camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mousePrev = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseVelocity = useRef(new THREE.Vector2(0, 0));
  const mouseDown = useRef(false);
  const frameCounter = useRef(0);

  // Create ping-pong buffers for water simulation + scene capture
  const buffers = useMemo(() => {
    const options = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    };
    const resolution = 2048;
    const sceneResolution = Math.max(size.width, size.height) * window.devicePixelRatio;

    return {
      read: new THREE.WebGLRenderTarget(resolution, resolution, options),
      write: new THREE.WebGLRenderTarget(resolution, resolution, options),
      scene: new THREE.WebGLRenderTarget(sceneResolution, sceneResolution, {
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        samples: 8,
        generateMipmaps: true,
        anisotropy: gl.capabilities.getMaxAnisotropy()
      })
    };
  }, []);

  // Water simulation material
  const simMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uPrevious: { value: null },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) },
        uMouseDown: { value: 0 },
        uDelta: { value: 1.0 }
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
        uniform float uMouseDown;
        uniform float uDelta;
        varying vec2 vUv;

        void main() {
          vec2 texel = 1.0 / vec2(256.0);

          vec4 prev = texture2D(uPrevious, vUv);
          float pressure = prev.x;
          float velocity = prev.y;

          float left = texture2D(uPrevious, vUv - vec2(texel.x, 0.0)).x;
          float right = texture2D(uPrevious, vUv + vec2(texel.x, 0.0)).x;
          float up = texture2D(uPrevious, vUv + vec2(0.0, texel.y)).x;
          float down = texture2D(uPrevious, vUv - vec2(0.0, texel.y)).x;

          float delta = min(uDelta, 1.0);
          velocity += delta * (-2.0 * pressure + left + right) * 0.1875;
          velocity += delta * (-2.0 * pressure + up + down) * 0.1875;

          pressure += delta * velocity;

          velocity *= 0.998;
          pressure *= 0.999;

          // Mouse interaction (hover)
          float dist = distance(vUv, uMouse);
          float swipeRadius = 0.12;
          float swipeStrength = 0.3;

          vec2 flowDir = normalize(uMouseVelocity + vec2(0.001));
          float velocityMagnitude = length(uMouseVelocity) * 10.0;

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

          // Idle waves
          float idleWaveStrength = 0.06;
          float idleSpeed = 0.3;
          float wave1 = sin(vUv.x * 12.0 + uTime * idleSpeed) * 0.4;
          float wave2 = sin(vUv.y * 8.0 + uTime * idleSpeed * 0.7) * 0.3;
          float wave3 = sin((vUv.x + vUv.y) * 6.0 + uTime * idleSpeed * 1.3) * 0.3;
          float idleDisturbance = (wave1 + wave2 + wave3) * idleWaveStrength;
          pressure += idleDisturbance;

          float gradX = (right - left) * 0.5;
          float gradY = (up - down) * 0.5;

          gl_FragColor = vec4(pressure, velocity, gradX, gradY);
        }
      `
    });
  }, []);

  // Display material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uWaterTexture: { value: null },
        uSceneTexture: { value: null },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) }
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
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
          vec4 water = texture2D(uWaterTexture, vUv);
          float pressure = water.x;
          float gradX = water.z;
          float gradY = water.w;

          float distortionStrength = 0.055;
          vec2 distortion = vec2(gradX, gradY) * distortionStrength;
          vec2 distortedUv = vUv + distortion;

          // Green accent chromatic aberration
          float aberrationStrength = 0.008;
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
          float caustic1 = sin(vUv.x * causticScale + uTime * 0.3) * sin(vUv.y * causticScale + uTime * 0.2);
          float caustic2 = sin(vUv.x * causticScale * 1.3 - uTime * 0.25) * sin(vUv.y * causticScale * 0.8 + uTime * 0.18);
          float caustic = (caustic1 + caustic2) * 0.5;
          caustic = smoothstep(-0.5, 0.5, caustic);
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
  }, [size]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX / window.innerWidth;
      const newY = 1.0 - (e.clientY / window.innerHeight);
      mouseVelocity.current.x = newX - mouse.current.x;
      mouseVelocity.current.y = newY - mouse.current.y;
      mousePrev.current.copy(mouse.current);
      mouse.current.x = newX;
      mouse.current.y = newY;
    };

    const handleMouseDown = () => {
      mouseDown.current = true;
    };

    const handleMouseUp = () => {
      mouseDown.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const newX = e.touches[0].clientX / window.innerWidth;
        const newY = 1.0 - (e.touches[0].clientY / window.innerHeight);
        mouseVelocity.current.x = newX - mouse.current.x;
        mouseVelocity.current.y = newY - mouse.current.y;
        mousePrev.current.copy(mouse.current);
        mouse.current.x = newX;
        mouse.current.y = newY;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX / window.innerWidth;
        mouse.current.y = 1.0 - (e.touches[0].clientY / window.innerHeight);
        mouseDown.current = true;
      }
    };

    const handleTouchEnd = () => {
      mouseDown.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

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
    const clampedDelta = Math.min(delta * 60, 1.4);
    const currentTarget = gl.getRenderTarget();

    // 1. Water simulation
    try {
      if (simMaterial.uniforms && buffers.read && buffers.write) {
        simMaterial.uniforms.uPrevious.value = buffers.read.texture;
        simMaterial.uniforms.uTime.value = state.clock.elapsedTime;
        simMaterial.uniforms.uMouse.value.copy(mouse.current);
        simMaterial.uniforms.uMouseVelocity.value.copy(mouseVelocity.current);
        simMaterial.uniforms.uMouseDown.value = mouseDown.current ? 1.0 : 0.0;
        simMaterial.uniforms.uDelta.value = clampedDelta;

        mouseVelocity.current.multiplyScalar(0.95);

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

    // 2. Scene capture (every 2 frames)
    frameCounter.current++;
    if (meshRef.current && buffers.scene && frameCounter.current % 2 === 0) {
      try {
        meshRef.current.visible = false;

        gl.setRenderTarget(buffers.scene);
        gl.setClearColor(new THREE.Color(0x1a1a1a), 1.0);
        gl.clear();
        gl.render(scene, camera);

        meshRef.current.visible = true;
      } catch (error) {
        console.warn('Scene capture error:', error);
        if (meshRef.current) meshRef.current.visible = true;
      }
    }

    // 3. Update display material
    try {
      if (material.uniforms && buffers.read && buffers.scene) {
        material.uniforms.uWaterTexture.value = buffers.read.texture;
        material.uniforms.uSceneTexture.value = buffers.scene.texture;
        material.uniforms.uTime.value = state.clock.elapsedTime;
        material.uniforms.uResolution.value.set(size.width, size.height);
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
