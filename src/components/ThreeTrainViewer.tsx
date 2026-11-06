/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Layers,
  Sun,
  Sunset,
  Moon,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Camera,
  Maximize2,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { createVandeBharatModel, createRailwayTrack, TrainModelParts } from './three/proceduralTrain';

export type LightingPreset = 'DAY' | 'GOLDEN' | 'NIGHT';
export type CameraPreset = 'HERO' | 'CAB' | 'SIDE' | 'WHEEL' | 'DRONE';

export const ThreeTrainViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [explodedAmount, setExplodedAmount] = useState(0); // 0 to 1
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('DAY');
  const [isAnimated, setIsAnimated] = useState(true);
  const [activeCamPreset, setActiveCamPreset] = useState<CameraPreset>('HERO');

  // Mutable refs for Three.js render loop
  const partsRef = useRef<TrainModelParts | null>(null);
  const trackRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetExplodeRef = useRef(0);
  const currentExplodeRef = useRef(0);
  const isAnimatedRef = useRef(true);
  const lightingRef = useRef<LightingPreset>('DAY');
  const lightsGroupRef = useRef<{
    dirLight: THREE.DirectionalLight;
    hemiLight: THREE.HemisphereLight;
    scene: THREE.Scene;
  } | null>(null);

  // Sync state to refs
  useEffect(() => {
    targetExplodeRef.current = explodedAmount;
  }, [explodedAmount]);

  useEffect(() => {
    isAnimatedRef.current = isAnimated;
  }, [isAnimated]);

  useEffect(() => {
    lightingRef.current = lightingPreset;
    applyLightingPreset(lightingPreset);
  }, [lightingPreset]);

  // Lighting Preset Switcher
  const applyLightingPreset = (preset: LightingPreset) => {
    if (!lightsGroupRef.current) return;
    const { dirLight, hemiLight, scene } = lightsGroupRef.current;

    if (preset === 'DAY') {
      scene.background = new THREE.Color(0xdbeafe); // Soft sky blue
      if (scene.fog) (scene.fog as THREE.FogExp2).color.setHex(0xdbeafe);
      dirLight.color.setHex(0xfff7ed); // Warm daylight
      dirLight.intensity = 2.2;
      dirLight.position.set(15, 25, 20);
      hemiLight.color.setHex(0xffffff);
      hemiLight.groundColor.setHex(0x334155);
      hemiLight.intensity = 0.9;
      // Headlights low glow
      partsRef.current?.frontLights.forEach((l) => {
        (l.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
      });
    } else if (preset === 'GOLDEN') {
      scene.background = new THREE.Color(0xffedd5); // Warm sunset peach
      if (scene.fog) (scene.fog as THREE.FogExp2).color.setHex(0xffedd5);
      dirLight.color.setHex(0xf97316); // Amber sunset
      dirLight.intensity = 2.6;
      dirLight.position.set(30, 8, 15);
      hemiLight.color.setHex(0xfed7aa);
      hemiLight.groundColor.setHex(0x1e293b);
      hemiLight.intensity = 0.7;
      partsRef.current?.frontLights.forEach((l) => {
        (l.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.6;
      });
    } else {
      // NIGHT
      scene.background = new THREE.Color(0x020617); // Midnight blue/black
      if (scene.fog) (scene.fog as THREE.FogExp2).color.setHex(0x020617);
      dirLight.color.setHex(0x93c5fd); // Moonlit cool
      dirLight.intensity = 0.6;
      dirLight.position.set(-15, 20, -10);
      hemiLight.color.setHex(0x1e293b);
      hemiLight.groundColor.setHex(0x050b14);
      hemiLight.intensity = 0.3;
      // High-beam headlights intense glow!
      partsRef.current?.frontLights.forEach((l) => {
        (l.material as THREE.MeshStandardMaterial).emissiveIntensity = 3.5;
      });
    }
  };

  // Camera presets
  const setCameraView = (preset: CameraPreset) => {
    setActiveCamPreset(preset);
    if (!controlsRef.current || !cameraRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    switch (preset) {
      case 'HERO':
        cam.position.set(14, 5, 12);
        ctrl.target.set(1, 2, 0);
        break;
      case 'CAB':
        cam.position.set(9.5, 2.8, 4.5);
        ctrl.target.set(5.5, 2.0, 0);
        break;
      case 'SIDE':
        cam.position.set(0, 3.2, 16);
        ctrl.target.set(0, 2, 0);
        break;
      case 'WHEEL':
        cam.position.set(4.5, 0.9, 3.6);
        ctrl.target.set(3.5, 0.7, 0);
        break;
      case 'DRONE':
        cam.position.set(0, 22, 14);
        ctrl.target.set(0, 1, 0);
        break;
    }
    ctrl.update();
  };

  // Three.js Mount Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe);
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    camera.position.set(14, 5, 12);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Environment (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
    controls.minDistance = 3.5;
    controls.maxDistance = 60;
    controls.target.set(1, 2, 0);
    controlsRef.current = controls;

    // Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    dirLight.position.set(15, 25, 20);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 70;
    dirLight.shadow.camera.left = -18;
    dirLight.shadow.camera.right = 18;
    dirLight.shadow.camera.top = 18;
    dirLight.shadow.camera.bottom = -18;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    lightsGroupRef.current = { dirLight, hemiLight, scene };

    // Procedural Railway Tracks
    const track = createRailwayTrack(100);
    scene.add(track);
    trackRef.current = track;

    // Procedural Vande Bharat Train Model
    const trainParts = createVandeBharatModel();
    scene.add(trainParts.root);
    partsRef.current = trainParts;

    // Render loop
    let animationFrameId = 0;
    let lastTime = performance.now();
    let wheelAngle = 0;

    const tick = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth exploded view damping: 1 - Math.exp(-k * dt)
      const explodeLambda = 6.0;
      currentExplodeRef.current = THREE.MathUtils.damp(
        currentExplodeRef.current,
        targetExplodeRef.current,
        explodeLambda,
        delta
      );

      // Apply exploded view offsets along Y axis
      if (partsRef.current) {
        const factor = currentExplodeRef.current;
        // Roof moves up
        partsRef.current.roofGroup.position.y = factor * 2.2;
        // Interior moves slightly up
        partsRef.current.interiorGroup.position.y = factor * 0.9;
        // Bogies move slightly down
        partsRef.current.bogieFront.position.y = -factor * 0.4;
        partsRef.current.bogieRear.position.y = -factor * 0.4;
      }

      // Smooth train motion simulation
      if (isAnimatedRef.current && partsRef.current) {
        const trainSpeed = 16.0; // units per second (~160 km/h scale)
        wheelAngle += (trainSpeed / 0.46) * delta;
        partsRef.current.wheels.forEach((wheel) => {
          wheel.rotation.z = wheelAngle;
        });

        // Subtle realistic coach suspension vibration
        const sway = Math.sin(currentTime * 0.006) * 0.015;
        partsRef.current.cab.rotation.z = sway * 0.5;
        partsRef.current.cab.position.y = Math.cos(currentTime * 0.008) * 0.01;
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[720px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl select-none">
      {/* Dedicated Stable WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Minimal Spec Badge */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-slate-900/90 text-white px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white tracking-wider">
              3D PBR
            </span>
            <span className="text-xs font-bold text-slate-100">
              Vande Bharat Express (Train 18)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            160 km/h Broad Gauge · Semi-High Speed Trainset
          </div>
        </div>
      </div>

      {/* Top Right: View Controls Guide */}
      <div className="absolute top-4 right-4 z-20 hidden sm:block pointer-events-none">
        <div className="bg-slate-900/80 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-medium">
          Left-click + Drag: Orbit · Right-click: Pan · Scroll: Zoom
        </div>
      </div>

      {/* Collapsible Ergonomic Bottom Control Dock (§5) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl transition-transform duration-300 ${
          isControlsCollapsed ? 'translate-y-[calc(100%-2.25rem)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Toggle Button on Top Edge */}
        <div className="flex justify-center mb-1">
          <button
            type="button"
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-3 py-1 bg-slate-900/95 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium rounded-t-lg border-t border-x border-slate-700 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Main Dock Container (Solid surface, no backdrop-filter over WebGL) */}
        <div className="bg-slate-900/95 text-slate-200 rounded-xl border border-slate-700/80 shadow-2xl p-3.5 space-y-3">
          {/* Row 1: Camera Presets & Motion Play/Pause */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Camera Presets */}
            <div className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:inline" />
              {(
                [
                  { id: 'HERO', label: 'Perspective' },
                  { id: 'CAB', label: 'Driver Cab' },
                  { id: 'SIDE', label: 'Profile' },
                  { id: 'WHEEL', label: 'Bogie / Track' },
                  { id: 'DRONE', label: 'Aerial' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setCameraView(preset.id)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    activeCamPreset === preset.id
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Right: Motion & Lighting */}
            <div className="flex items-center gap-2">
              {/* Play/Pause Motion */}
              <button
                type="button"
                onClick={() => setIsAnimated(!isAnimated)}
                className={`p-1.5 rounded-md border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  isAnimated
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title={isAnimated ? 'Pause train motion' : 'Start train motion'}
              >
                {isAnimated ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline">{isAnimated ? 'Moving' : 'Stationary'}</span>
              </button>

              {/* Lighting Preset Buttons */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-md border border-slate-700">
                <button
                  type="button"
                  onClick={() => setLightingPreset('DAY')}
                  title="Daylight"
                  className={`p-1.5 rounded transition-colors ${
                    lightingPreset === 'DAY' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightingPreset('GOLDEN')}
                  title="Golden Hour"
                  className={`p-1.5 rounded transition-colors ${
                    lightingPreset === 'GOLDEN' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sunset className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightingPreset('NIGHT')}
                  title="Night Mode"
                  className={`p-1.5 rounded transition-colors ${
                    lightingPreset === 'NIGHT' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Exploded View Slider */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium shrink-0">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Exploded Inspection:</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedAmount}
              onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="font-mono text-[11px] text-blue-400 font-bold w-10 text-right">
              {Math.round(explodedAmount * 100)}%
            </span>
            {explodedAmount > 0 && (
              <button
                type="button"
                onClick={() => setExplodedAmount(0)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-0.5"
                title="Reset exploded view"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
