import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../utils/SoundFX.js';

const LANGUAGE_COLOR_MAP = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Rust: '#DEA584',
  Go: '#00ADD8',
  'C++': '#00599C',
  C: '#A8B9CC',
  'C#': '#239120',
  Java: '#B07219',
  Solidity: '#AA6746',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Vue: '#4FC08D',
  Shell: '#89E051',
  Dockerfile: '#384D54',
};

const DISTRICT_COLOR_MAP = {
  ai: '#A78BFA',
  backend: '#38BDF8',
  frontend: '#3B82F6',
  blockchain: '#FBBF24',
  security: '#F87171',
  tools: '#34D399',
};

export default function Building({ repo, position, isSelected, onClick, pulsing }) {
  const meshRef = useRef();
  const roofLightRef = useRef();
  const [hovered, setHovered] = useState(false);

  const primaryColor = LANGUAGE_COLOR_MAP[repo.language] || DISTRICT_COLOR_MAP[repo.district] || '#3B82F6';
  const districtColor = DISTRICT_COLOR_MAP[repo.district] || '#3B82F6';

  // Building geometry dimensions derived from repository size & star count
  const height = Math.min(18, Math.max(3.5, Math.log2((repo.size || 100) + 10) * 1.5));
  const width = Math.min(3.2, Math.max(1.6, Math.log10((repo.starsCount || 10) + 10) * 0.9));
  const depth = width;

  // Window grid pattern material
  const buildingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0A0F1D'),
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color(primaryColor),
      emissiveIntensity: hovered || isSelected ? 0.6 : 0.25,
    });
  }, [primaryColor, hovered, isSelected]);

  // Animate light pulse or hover hover movement
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetY = hovered ? height / 2 + 0.4 : height / 2;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 8);
    }
    if (roofLightRef.current) {
      roofLightRef.current.intensity = (pulsing ? 2.5 : 1.0) + Math.sin(state.clock.elapsedTime * 4) * 0.4;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Base Foundation Glow Grid */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 0.8, depth + 0.8]} />
        <meshBasicMaterial
          color={districtColor}
          transparent
          opacity={hovered || isSelected ? 0.6 : 0.2}
        />
      </mesh>

      {/* Main Building Pillar */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        material={buildingMaterial}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          soundFX.playHover();
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          soundFX.playSelect();
          onClick(repo);
        }}
      >
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Glowing Vertical Language Strip */}
      <mesh position={[0, height / 2, depth / 2 + 0.02]}>
        <planeGeometry args={[width * 0.3, height * 0.9]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.8} />
      </mesh>

      {/* Rooftop Antenna & Beacon Light */}
      <mesh position={[0, height + 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      <pointLight
        ref={roofLightRef}
        position={[0, height + 1.6, 0]}
        color={primaryColor}
        distance={8}
        intensity={1.2}
      />

      {/* Rooftop Beacon Sphere */}
      <mesh position={[0, height + 1.6, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={primaryColor} />
      </mesh>

      {/* Floating 3D Label overlay above building */}
      {(hovered || isSelected) && (
        <Html
          position={[0, height + 2.4, 0]}
          center
          distanceFactor={20}
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex flex-col items-center rounded-lg border border-accent/40 bg-base/90 px-3 py-1.5 backdrop-blur-md shadow-glow-sm transition-all animate-in fade-in zoom-in duration-200">
            <span className="font-mono text-xs font-bold text-white whitespace-nowrap">
              {repo.name}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-ink-muted mt-0.5">
              <span className="font-semibold text-accent-bright">{repo.language}</span>
              <span>•</span>
              <span className="text-amber-400">★ {repo.starsCount}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
