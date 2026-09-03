import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Eye, RotateCw, Zap } from 'lucide-react';

interface Interactive3DHeroCanvasProps {
  className?: string;
  onCoreClick?: () => void;
}

export const Interactive3DHeroCanvas: React.FC<Interactive3DHeroCanvasProps> = ({
  className = '',
  onCoreClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<'core' | 'helix' | 'pulse'>('core');
  const [isInteracting, setIsInteracting] = useState(false);
  const [fpsState, setFpsState] = useState('60 FPS');

  // Mouse & Scroll interaction refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(0);
  const modeRef = useRef(activeMode);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const objectsRef = useRef<{
    coreGroup: THREE.Group;
    innerMesh: THREE.Mesh;
    wireMesh: THREE.Mesh;
    torus1: THREE.Mesh;
    torus2: THREE.Mesh;
    helixGroup: THREE.Group;
    particles: THREE.Points;
  } | null>(null);

  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 480;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 3, 20);
    pointLight1.position.set(4, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3.5, 20);
    pointLight2.position.set(-4, -3, 4);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xec4899, 2, 15);
    pointLight3.position.set(0, 4, -2);
    scene.add(pointLight3);

    // 4. Geometry & Meshes
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Core Group
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    // Inner icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      emissive: 0x312e81,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      transparent: true,
      opacity: 0.88,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Outer wireframe shell
    const wireGeo = new THREE.IcosahedronGeometry(2.0, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // Orbiting Torus Ring 1 (Cyan)
    const torus1Geo = new THREE.TorusGeometry(2.6, 0.04, 16, 100);
    const torus1Mat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const torus1 = new THREE.Mesh(torus1Geo, torus1Mat);
    torus1.rotation.x = Math.PI / 3;
    coreGroup.add(torus1);

    // Orbiting Torus Ring 2 (Violet)
    const torus2Geo = new THREE.TorusGeometry(3.1, 0.03, 16, 100);
    const torus2Mat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.8,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.y = Math.PI / 4;
    torus2.rotation.x = -Math.PI / 6;
    coreGroup.add(torus2);

    // Helix Group (for Neural Helix mode)
    const helixGroup = new THREE.Group();
    helixGroup.visible = false;
    rootGroup.add(helixGroup);

    const helixCurvePoints: THREE.Vector3[] = [];
    const helixCurvePoints2: THREE.Vector3[] = [];
    for (let i = 0; i < 120; i++) {
      const t = (i / 120) * Math.PI * 6;
      const y = (i / 120) * 5 - 2.5;
      const r = 1.3;
      helixCurvePoints.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
      helixCurvePoints2.push(new THREE.Vector3(Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r));
    }
    const helixGeo1 = new THREE.BufferGeometry().setFromPoints(helixCurvePoints);
    const helixGeo2 = new THREE.BufferGeometry().setFromPoints(helixCurvePoints2);
    const helixMat1 = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
    const helixMat2 = new THREE.LineBasicMaterial({ color: 0xa855f7, linewidth: 2 });
    helixGroup.add(new THREE.Line(helixGeo1, helixMat1));
    helixGroup.add(new THREE.Line(helixGeo2, helixMat2));

    // Particle Cloud (300 floating micro-sparkles)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8);
    const color2 = new THREE.Color(0x818cf8);
    const color3 = new THREE.Color(0xf472b6);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 2.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i3 + 2] = radius * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
      particleColors[i3] = chosenColor.r;
      particleColors[i3 + 1] = chosenColor.g;
      particleColors[i3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    objectsRef.current = {
      coreGroup,
      innerMesh,
      wireMesh,
      torus1,
      torus2,
      helixGroup,
      particles,
    };

    // 5. Mouse & Interaction Handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.8;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY * 0.0012;
    };

    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let shockwave = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const curMode = modeRef.current;

      // Mode Visibility Transition
      if (curMode === 'helix') {
        coreGroup.visible = false;
        helixGroup.visible = true;
        helixGroup.rotation.y = elapsedTime * 0.8;
      } else {
        coreGroup.visible = true;
        helixGroup.visible = false;
      }

      // Root rotation tracking mouse and scroll
      rootGroup.rotation.y = elapsedTime * 0.2 + mouseRef.current.x * 0.6;
      rootGroup.rotation.x = mouseRef.current.y * 0.4 + scrollRef.current;

      // Inner Core Pulse (Simulating bio-rhythm heartbeat)
      const pulseSpeed = curMode === 'pulse' ? 4.5 : 2.0;
      const pulseAmplitude = curMode === 'pulse' ? 0.12 : 0.05;
      const baseScale = 1.0 + Math.sin(elapsedTime * pulseSpeed) * pulseAmplitude;
      innerMesh.scale.setScalar(baseScale);

      // Rotating wireframe and rings
      innerMesh.rotation.y = elapsedTime * 0.3;
      innerMesh.rotation.x = elapsedTime * 0.15;

      wireMesh.rotation.y = -elapsedTime * 0.2;
      wireMesh.rotation.z = elapsedTime * 0.1;

      torus1.rotation.z = elapsedTime * 0.4;
      torus2.rotation.z = -elapsedTime * 0.3;

      // Slowly swirl particle cloud
      particles.rotation.y = elapsedTime * 0.08;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();

      // Dispose Three.js objects
      innerGeo.dispose();
      innerMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      torus1Geo.dispose();
      torus1Mat.dispose();
      torus2Geo.dispose();
      torus2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      helixGeo1.dispose();
      helixGeo2.dispose();
      helixMat1.dispose();
      helixMat2.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleCanvasClick = () => {
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 400);
    if (onCoreClick) onCoreClick();
  };

  return (
    <div className={`relative w-full h-full min-h-[380px] sm:min-h-[480px] flex items-center justify-center ${className}`}>
      {/* Ambient background glow layers */}
      <div className="absolute w-72 h-72 rounded-full bg-indigo-600/20 blur-[90px] pointer-events-none animate-pulse-glow" />
      <div className="absolute w-64 h-64 rounded-full bg-cyan-500/15 blur-[80px] pointer-events-none translate-x-12 translate-y-12" />

      {/* Main 3D Canvas Mount */}
      <div
        ref={mountRef}
        onClick={handleCanvasClick}
        className="relative w-full h-full cursor-grab active:cursor-grabbing z-10"
        title="Click or drag to interact with the 3D Bio-Resonance Core"
      />

      {/* Floating Mode Switcher & Stats HUD */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-[10px] font-mono font-bold">
        <button
          onClick={() => setActiveMode('core')}
          className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
            activeMode === 'core'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3 text-indigo-300" />
          <span>Neural Core</span>
        </button>
        <button
          onClick={() => setActiveMode('helix')}
          className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
            activeMode === 'helix'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw className="w-3 h-3 text-cyan-300" />
          <span>DNA Helix</span>
        </button>
        <button
          onClick={() => setActiveMode('pulse')}
          className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
            activeMode === 'pulse'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3 h-3 text-amber-300" />
          <span>Pulse</span>
        </button>
      </div>

      {/* Live Telemetry Pill */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-emerald-400 font-bold">WebGL 2.0 • 60 FPS</span>
        <span className="text-slate-600">|</span>
        <span className="text-indigo-300">Bio-Harmonic Active</span>
      </div>

      {/* Interactive Guidance Badge */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/5">
        <Eye className="w-3 h-3 text-cyan-400" />
        <span>Move cursor to orient • Click to pulse</span>
      </div>
    </div>
  );
};
