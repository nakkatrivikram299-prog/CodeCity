import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Building from './Building.jsx';

function FlyingDrones() {
  const dronesRef = useRef();
  
  const dronePositions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      speed: 0.1 + Math.random() * 0.2,
      radius: 15 + Math.random() * 25,
      y: 6 + Math.random() * 12,
      offset: i * ((Math.PI * 2) / 12),
      color: i % 2 === 0 ? '#38bdf8' : '#a78bfa',
    }));
  }, []);

  useFrame((state) => {
    if (dronesRef.current) {
      dronesRef.current.children.forEach((child, i) => {
        const d = dronePositions[i];
        const t = state.clock.elapsedTime * d.speed + d.offset;
        child.position.x = Math.cos(t) * d.radius;
        child.position.z = Math.sin(t) * d.radius;
        child.position.y = d.y + Math.sin(t * 2) * 0.5;
      });
    }
  });

  return (
    <group ref={dronesRef}>
      {dronePositions.map((d, i) => (
        <mesh key={i}>
          <boxGeometry args={[0.3, 0.1, 0.6]} />
          <meshBasicMaterial color={d.color} />
        </mesh>
      ))}
    </group>
  );
}

function GroundMatrix() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Infinite Grid Helper */}
      <gridHelper args={[120, 60, '#38bdf8', '#111827']} />

      {/* Cyber Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#05070D" roughness={0.9} metalness={0.5} />
      </mesh>
    </group>
  );
}

export default function CityScene({ repositories, selectedRepo, onSelectRepo, activeDistrict, theme }) {
  const controlsRef = useRef();
  const [pulsingRepoId, setPulsingRepoId] = useState(null);

  // Filter repos by selected district if active
  const filteredRepos = useMemo(() => {
    if (!activeDistrict || activeDistrict === 'all') return repositories;
    return repositories.filter((r) => r.district === activeDistrict);
  }, [repositories, activeDistrict]);

  // Layout algorithm: Arrange repositories in an organized city grid with avenues
  const repoGridPositions = useMemo(() => {
    const positions = {};
    const cols = Math.ceil(Math.sqrt(filteredRepos.length || 1));
    const spacing = 7.5;

    filteredRepos.forEach((repo, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const posX = (col - cols / 2) * spacing;
      const posZ = (row - cols / 2) * spacing;
      positions[repo.id] = [posX, 0, posZ];
    });

    return positions;
  }, [filteredRepos]);

  return (
    <div className="relative h-full w-full bg-[#05070D]">
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <PerspectiveCamera makeDefault position={[30, 24, 38]} fov={50} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={10}
          maxDistance={90}
        />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[40, 50, 20]}
          intensity={1.2}
          color="#93c5fd"
          castShadow
        />
        <pointLight position={[0, 30, 0]} intensity={1.5} color="#38bdf8" />

        {/* Sky Stars */}
        <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />

        {/* Cyber Ground Grid */}
        <GroundMatrix />

        {/* Flying Traffic Drones */}
        <FlyingDrones />

        {/* Render Skyscraper Buildings */}
        {filteredRepos.map((repo) => {
          const pos = repoGridPositions[repo.id] || [0, 0, 0];
          const isSelected = selectedRepo?.id === repo.id;

          return (
            <Building
              key={repo.id}
              repo={repo}
              position={pos}
              isSelected={isSelected}
              pulsing={pulsingRepoId === repo.id}
              onClick={(selected) => {
                setPulsingRepoId(selected.id);
                onSelectRepo(selected);
              }}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
