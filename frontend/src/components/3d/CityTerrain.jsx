import { useMemo } from 'react';
import * as THREE from 'three';

export default function CityTerrain() {
  // Realistic tree placement (STRICTLY outside all roads, sidewalks, and roundabout)
  const cityTrees = useMemo(() => {
    const trees = [];

    // Outer sidewalk verges outside roads (X = -8.5 and X = 8.5, Z outside central plaza)
    for (let z = -44; z <= 44; z += 8) {
      if (Math.abs(z) > 17) {
        trees.push({ x: -8.5, z, scale: 0.9 + Math.random() * 0.2, type: 'oak' });
        trees.push({ x: 8.5, z, scale: 0.9 + Math.random() * 0.2, type: 'pine' });
      }
    }

    // Roundabout Central Park Lawn Trees (strictly inside green radius r=6.0)
    const angleStep = (Math.PI * 2) / 8;
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep + Math.PI / 8;
      const r = 5.8;
      trees.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        scale: 0.85,
        type: 'oak',
      });
    }

    // Deep side parks (X = -28, 28)
    const parkCenters = [
      [-28, -32], [-28, -16], [-28, 16], [-28, 32],
      [28, -32], [28, -16], [28, 16], [28, 32]
    ];
    parkCenters.forEach(([px, pz]) => {
      for (let i = 0; i < 3; i++) {
        trees.push({
          x: px + (Math.random() - 0.5) * 5,
          z: pz + (Math.random() - 0.5) * 5,
          scale: 0.8 + Math.random() * 0.3,
          type: i % 2 === 0 ? 'oak' : 'pine',
        });
      }
    });

    return trees;
  }, []);

  // Scatter 3D Grass Tufts across green land plots (STRICTLY outside all roads)
  const grassTufts = useMemo(() => {
    const tufts = [];
    const parkCenters = [
      [-28, -32], [-28, -16], [-28, 16], [-28, 32],
      [28, -32], [28, -16], [28, 16], [28, 32]
    ];
    parkCenters.forEach(([px, pz]) => {
      for (let i = 0; i < 8; i++) {
        tufts.push({
          x: px + (Math.random() - 0.5) * 8,
          z: pz + (Math.random() - 0.5) * 8,
          rot: Math.random() * Math.PI,
          scale: 0.7 + Math.random() * 0.5,
        });
      }
    });
    return tufts;
  }, []);

  return (
    <group position={[0, -0.01, 0]}>
      
      {/* Real-World Terrain Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Realistic Lush Green Park Ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[110, 110]} />
        <meshStandardMaterial color="#15803D" roughness={0.7} />
      </mesh>

      {/* 3D Grass Blades Scattered across Green Land */}
      {grassTufts.map((g, i) => (
        <group key={`grass-${i}`} position={[g.x, 0.02, g.z]} rotation={[0, g.rot, 0]} scale={[g.scale, g.scale, g.scale]}>
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[0.2, 0.3, 5]} />
            <meshStandardMaterial color="#22C55E" roughness={0.6} />
          </mesh>
          <mesh position={[0.1, 0.12, 0.1]} rotation={[0.2, 0, 0.2]}>
            <coneGeometry args={[0.15, 0.25, 5]} />
            <meshStandardMaterial color="#4ADE80" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* CENTRAL GRAND ROUNDABOUT PLAZA */}
      <group position={[0, 0.02, 0]}>
        
        {/* Outer Circular Ring Road (Asphalt Width r=9.5 to r=14.5) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[9.5, 14.5, 64]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Circular Sidewalk Curbs */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[9.0, 9.5, 64]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[14.5, 15.0, 64]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.5} />
        </mesh>

        {/* Inner Geometric Radial Park Lawn */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[9.0, 64]} />
          <meshStandardMaterial color="#166534" roughness={0.7} />
        </mesh>

        {/* 8 Radial Tiled Pathways radiating from center */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`path-${i}`} rotation={[-Math.PI / 2, 0, (i * Math.PI) / 4]} position={[0, 0.03, 0]}>
            <planeGeometry args={[1.4, 17.5]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
          </mesh>
        ))}

        {/* Central Octagonal Fountain Plaza Pool */}
        <group position={[0, 0.04, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.6, 8]} />
            <meshStandardMaterial color="#64748B" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.1, 8]} />
            <meshStandardMaterial color="#06B6D4" roughness={0.1} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.08, 0.25, 1.6, 8]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} />
          </mesh>
        </group>

      </group>

      {/* ALL 4 ROADS ATTACHED SEAMLESSLY TO ROUNDABOUT AT R=14.5 */}
      <group position={[0, 0.02, 0]}>
        
        {/* North Road Segment (Spans z = -45.5 to -14.5) */}
        <mesh position={[0, 0, -30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[7.5, 31]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>

        {/* South Road Segment (Spans z = 14.5 to 45.5) */}
        <mesh position={[0, 0, 30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[7.5, 31]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>

        {/* West Road Segment (Spans x = -45.5 to -14.5) */}
        <mesh position={[-30, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[31, 7.5]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>

        {/* East Road Segment (Spans x = 14.5 to 45.5) */}
        <mesh position={[30, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[31, 7.5]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>

        {/* Sidewalk Curbs */}
        <mesh position={[-4.2, 0.04, -30]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 31]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        <mesh position={[4.2, 0.04, -30]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 31]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        <mesh position={[-4.2, 0.04, 30]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 31]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        <mesh position={[4.2, 0.04, 30]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 31]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
      </group>

      {/* ELEVATED METRO / MONORAIL PILLARS (NO PILLAR AT X = 0!) */}
      <group position={[0, 8.5, 0]}>
        <mesh position={[0, 0, 21]} castShadow>
          <boxGeometry args={[110, 0.6, 1.2]} />
          <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Supporting Metro Pillars placed strictly OUTSIDE roads (X = [-45, -30, -12, 12, 30, 45]) */}
        {[-45, -30, -12, 12, 30, 45].map((px) => (
          <mesh key={`pillar-${px}`} position={[px, -4.25, 21]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 8.5, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Realistic 3D Trees */}
      {cityTrees.map((tree, i) => (
        <group key={i} position={[tree.x, 0, tree.z]} scale={[tree.scale, tree.scale, tree.scale]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 1.2, 8]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>

          {tree.type === 'oak' ? (
            <group position={[0, 1.8, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <sphereGeometry args={[0.85, 12, 12]} />
                <meshStandardMaterial color="#166534" roughness={0.7} />
              </mesh>
              <mesh position={[0.3, 0.3, 0.2]} castShadow>
                <sphereGeometry args={[0.6, 10, 10]} />
                <meshStandardMaterial color="#15803D" roughness={0.7} />
              </mesh>
            </group>
          ) : (
            <group position={[0, 1.6, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <coneGeometry args={[0.8, 1.4, 8]} />
                <meshStandardMaterial color="#14532D" roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.6, 0]} castShadow>
                <coneGeometry args={[0.6, 1.2, 8]} />
                <meshStandardMaterial color="#166534" roughness={0.7} />
              </mesh>
            </group>
          )}
        </group>
      ))}

    </group>
  );
}
