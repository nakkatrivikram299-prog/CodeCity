import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import * as THREE from 'three';

import CityTerrain from './CityTerrain.jsx';
import AnimatedTraffic from './AnimatedTraffic.jsx';
import InteractiveBuilding from './InteractiveBuilding.jsx';

function CameraController({ targetBuilding }) {
  const controlsRef = useRef();

  useFrame((state, delta) => {
    if (controlsRef.current && targetBuilding) {
      const [tx, ty, tz] = [targetBuilding.gridPos[0], 0, targetBuilding.gridPos[1]];
      controlsRef.current.target.lerp(new THREE.Vector3(tx, ty, tz), delta * 4);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minDistance={8}
      maxDistance={120}
      target={[0, 8, -5]}
    />
  );
}

export default function SmartCityCanvas({ buildings, selectedBuilding, onSelectBuilding, isNight }) {
  return (
    <div className="relative h-full w-full bg-[#0F172A]">
      <Canvas shadows gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        
        {/* Photorealistic Eye-Level Cinematic Perspective Camera */}
        <PerspectiveCamera makeDefault position={[0, 16, 52]} fov={45} />
        
        <CameraController targetBuilding={selectedBuilding} />

        {/* Photorealistic Physical Sky with Atmospheric Sun Scattering */}
        <Sky
          distance={450000}
          sunPosition={isNight ? [0, -10, -100] : [100, 40, 100]}
          inclination={isNight ? 0.95 : 0.48}
          azimuth={0.25}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
          rayleigh={isNight ? 0.5 : 2.5}
          turbidity={10}
        />

        {/* Photorealistic Sun & Sky Environment Lighting with Soft Shadows */}
        <ambientLight intensity={isNight ? 0.35 : 0.9} color={isNight ? '#93C5FD' : '#F1F5F9'} />
        <directionalLight
          position={[60, 80, 40]}
          intensity={isNight ? 0.6 : 2.2}
          color={isNight ? '#60A5FA' : '#FFFBEB'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />

        {/* Secondary Soft Environmental Fill Light */}
        <directionalLight position={[-40, 30, -30]} intensity={0.5} color="#BAE6FD" />

        {/* Atmospheric Haze Horizon Fog */}
        <fog attach="fog" args={[isNight ? '#0F172A' : '#CBD5E1', 30, 150]} />

        {/* Realistic Asphalt Roads & Sidewalk Infrastructure */}
        <CityTerrain />

        {/* Realistic Vehicles & LED Lights */}
        <AnimatedTraffic />

        {/* Iconic Corporate Glass Headquarters Skyscraper Buildings */}
        {buildings.map((b) => (
          <InteractiveBuilding
            key={b.id}
            b={b}
            isSelected={selectedBuilding?.id === b.id}
            isNight={isNight}
            onClick={onSelectBuilding}
          />
        ))}
      </Canvas>
    </div>
  );
}
