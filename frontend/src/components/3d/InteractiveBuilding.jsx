import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../utils/SoundFX.js';

export default function InteractiveBuilding({ b, isSelected, isNight, onClick }) {
  const meshGroupRef = useRef();

  const [hovered, setHovered] = useState(false);

  const mainHeight = b.height || 22;
  const mainWidth = 4.8;
  const mainDepth = 3.2;

  const wingWidth = 2.2;
  const wingDepth = 2.8;
  const wingHeight = mainHeight * 0.86;

  const podiumWidth = 3.6;
  const podiumDepth = 2.6;
  const podiumHeight = 4.5;

  const numLouvers = 36; // Dense horizontal louver stripes matching reference image

  // Crisp Sapphire/Cyan-Blue Reflective Glass Material matching reference image
  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0284C7'),
      roughness: 0.1,
      metalness: 0.9,
      emissive: new THREE.Color('#0369A1'),
      emissiveIntensity: hovered || isSelected ? 0.4 : 0.18,
      transparent: true,
      opacity: 0.92,
    });
  }, [hovered, isSelected]);

  // Dark Structural Frame / Core Material
  const frameMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1E293B',
      roughness: 0.3,
      metalness: 0.7,
    });
  }, []);

  // Dense Horizontal Louver / Ribbon Stripes Material matching reference image
  const louverMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#E0F2FE',
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  useFrame((state, delta) => {
    // Smooth hover elevation lift
    if (meshGroupRef.current) {
      const targetY = hovered ? 0.8 : 0;
      meshGroupRef.current.position.y = THREE.MathUtils.lerp(
        meshGroupRef.current.position.y,
        targetY,
        delta * 8
      );
    }
  });

  return (
    <group position={[b.gridPos[0], 0, b.gridPos[1]]}>
      
      {/* Base Foundation Glowing Plate */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[mainWidth + wingWidth + 1.2, mainDepth + podiumDepth + 1.2]} />
        <meshStandardMaterial
          color={b.color || '#38BDF8'}
          transparent
          opacity={hovered || isSelected ? 0.6 : 0.2}
        />
      </mesh>

      {/* Main Corporate Glass Skyscraper Group (Matching Reference Image) */}
      <group
        ref={meshGroupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          soundFX.playHover();
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          soundFX.playSelect();
          onClick(b);
        }}
      >
        
        {/* 1. MAIN TOWER SLAB */}
        <group position={[0, mainHeight / 2, 0]}>
          
          {/* Main Glass Body */}
          <mesh material={glassMaterial}>
            <boxGeometry args={[mainWidth, mainHeight, mainDepth]} />
          </mesh>

          {/* Dark Structural Spines */}
          <mesh position={[-mainWidth / 2 - 0.02, 0, 0]} material={frameMaterial}>
            <boxGeometry args={[0.08, mainHeight, mainDepth * 0.95]} />
          </mesh>

          {/* Dense Horizontal Louver Stripes across Front Facade */}
          {Array.from({ length: numLouvers }).map((_, i) => {
            const yPos = -mainHeight / 2 + (i + 0.5) * (mainHeight / numLouvers);
            return (
              <mesh key={`main-louver-${i}`} position={[0, yPos, mainDepth / 2 + 0.01]} material={louverMaterial}>
                <planeGeometry args={[mainWidth * 0.98, 0.1]} />
              </mesh>
            );
          })}

        </group>

        {/* 2. SECONDARY OFFSET WING SLAB */}
        <group position={[-mainWidth / 2 - wingWidth / 2 + 0.2, wingHeight / 2, -0.4]}>
          
          {/* Wing Glass Body */}
          <mesh material={glassMaterial}>
            <boxGeometry args={[wingWidth, wingHeight, wingDepth]} />
          </mesh>

          {/* Dense Horizontal Louver Stripes across Wing Facade */}
          {Array.from({ length: Math.floor(numLouvers * 0.86) }).map((_, i) => {
            const yPos = -wingHeight / 2 + (i + 0.5) * (wingHeight / (numLouvers * 0.86));
            return (
              <mesh key={`wing-louver-${i}`} position={[0, yPos, wingDepth / 2 + 0.01]} material={louverMaterial}>
                <planeGeometry args={[wingWidth * 0.95, 0.08]} />
              </mesh>
            );
          })}

        </group>

        {/* 3. FRONT PODIUM LOBBY ATRIUM */}
        <group position={[mainWidth / 4, podiumHeight / 2, mainDepth / 2 + podiumDepth / 2 - 0.2]}>
          
          {/* Podium Glass Body */}
          <mesh material={glassMaterial}>
            <boxGeometry args={[podiumWidth, podiumHeight, podiumDepth]} />
          </mesh>

          {/* Podium Horizontal Louver Stripes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const yPos = -podiumHeight / 2 + (i + 0.5) * (podiumHeight / 8);
            return (
              <mesh key={`podium-louver-${i}`} position={[0, yPos, podiumDepth / 2 + 0.01]} material={louverMaterial}>
                <planeGeometry args={[podiumWidth * 0.96, 0.12]} />
              </mesh>
            );
          })}

        </group>

        {/* Domain Color Rooftop Beacon Point Light */}
        <pointLight
          position={[0, mainHeight + 2.5, 0]}
          color={b.color || '#38BDF8'}
          distance={12}
          intensity={1.6}
        />

        {/* Floating 3D Project Card Overlay on Hover */}
        {(hovered || isSelected) && (
          <Html position={[0, mainHeight + 4.2, 0]} center distanceFactor={24} style={{ pointerEvents: 'none' }}>
            <div className="flex flex-col items-center rounded-2xl border-2 border-accent/60 bg-base/95 p-3.5 backdrop-blur-xl shadow-2xl transition-all animate-in fade-in zoom-in duration-200 min-w-[210px]">
              
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={b.teamLogo}
                  alt={b.teamName}
                  className="h-7 w-7 rounded-full border-2 border-accent-bright bg-base-200"
                />
                <span className="text-xs font-bold text-white font-display whitespace-nowrap">
                  {b.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-ink-muted font-mono">
                <span className="text-accent-bright font-semibold">{b.teamName}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">★ {b.votes} votes</span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                <span>{b.college}</span>
              </div>
            </div>
          </Html>
        )}

      </group>
    </group>
  );
}
