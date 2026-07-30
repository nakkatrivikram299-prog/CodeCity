import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AnimatedTraffic() {
  const northCarsRef = useRef();
  const southCarsRef = useRef();
  const eastWestCarsRef = useRef();
  const roundaboutCarsRef = useRef();
  const metroTrainRef = useRef();

  // 1. North Highway Cars (Z: -45 to -15, driving along Z axis)
  const northCars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      x: i % 2 === 0 ? -1.8 : 1.8,
      z: -45 + i * 6.0,
      dir: i % 2 === 0 ? 1 : -1, // +1 heading south, -1 heading north
      speed: (0.14 + (i % 2) * 0.03),
      color: ['#0284C7', '#DC2626', '#111827', '#F8FAFC', '#D97706'][i],
    }));
  }, []);

  // 2. South Highway Cars (Z: 15 to 45, driving along Z axis)
  const southCars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      x: i % 2 === 0 ? -1.8 : 1.8,
      z: 15 + i * 6.0,
      dir: i % 2 === 0 ? 1 : -1,
      speed: (0.14 + (i % 2) * 0.03),
      color: ['#F59E0B', '#3B82F6', '#EF4444', '#F8FAFC', '#6366F1'][i],
    }));
  }, []);

  // 3. East-West Cross Avenue Cars (X: -45 to 45, driving along X axis)
  const eastWestCars = useMemo(() => {
    const cars = [];
    for (let i = 0; i < 4; i++) {
      cars.push({
        x: -44 + i * 7.5,
        z: i % 2 === 0 ? -1.8 : 1.8,
        dir: i % 2 === 0 ? 1 : -1,
        speed: 0.15,
        color: ['#0284C7', '#EF4444', '#F59E0B', '#10B981'][i],
      });
      cars.push({
        x: 15 + i * 7.5,
        z: i % 2 === 0 ? -1.8 : 1.8,
        dir: i % 2 === 0 ? 1 : -1,
        speed: 0.15,
        color: ['#F8FAFC', '#8B5CF6', '#3B82F6', '#EC4899'][i],
      });
    }
    return cars;
  }, []);

  // 4. Roundabout Circle Cars (Driving along r = 12.0 centerline)
  const roundaboutCars = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i * Math.PI * 2) / 6,
      radius: 12.0,
      speed: 0.4, // Angular velocity
      color: ['#FACC15', '#3B82F6', '#EF4444', '#10B981', '#F8FAFC', '#F97316'][i],
    }));
  }, []);

  useFrame((state, delta) => {
    // 1. North Highway Animation
    if (northCarsRef.current) {
      northCarsRef.current.children.forEach((car, i) => {
        const c = northCars[i];
        car.position.z += c.speed * c.dir;
        car.position.y = 0.25;
        if (car.position.z > -15) car.position.z = -45;
        if (car.position.z < -45) car.position.z = -15;
        // Headlights facing exact direction of travel (+Z => 0, -Z => Math.PI)
        car.rotation.y = c.dir === 1 ? 0 : Math.PI;
      });
    }

    // 2. South Highway Animation
    if (southCarsRef.current) {
      southCarsRef.current.children.forEach((car, i) => {
        const c = southCars[i];
        car.position.z += c.speed * c.dir;
        car.position.y = 0.25;
        if (car.position.z > 45) car.position.z = 15;
        if (car.position.z < 15) car.position.z = 45;
        car.rotation.y = c.dir === 1 ? 0 : Math.PI;
      });
    }

    // 3. East-West Cross Avenue Animation
    if (eastWestCarsRef.current) {
      eastWestCarsRef.current.children.forEach((car, i) => {
        const c = eastWestCars[i];
        car.position.x += c.speed * c.dir;
        car.position.y = 0.25;

        // Wrap around West road segment
        if (car.position.x > -14.5 && c.dir > 0) car.position.x = -45;
        if (car.position.x < -45 && c.dir < 0) car.position.x = -14.5;

        // Wrap around East road segment
        if (car.position.x > 45 && c.dir > 0) car.position.x = 14.5;
        if (car.position.x < 14.5 && c.dir < 0) car.position.x = 45;

        // Headlights facing exact direction of travel (+X => Math.PI / 2, -X => -Math.PI / 2)
        car.rotation.y = c.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      });
    }

    // 4. Roundabout Circle Cars Animation
    if (roundaboutCarsRef.current) {
      roundaboutCarsRef.current.children.forEach((car, i) => {
        const c = roundaboutCars[i];
        c.angle += delta * c.speed;
        car.position.x = Math.cos(c.angle) * c.radius;
        car.position.z = Math.sin(c.angle) * c.radius;
        car.position.y = 0.25;

        // Tangent heading angle along circle:
        // Position P = (cos(a), sin(a)) -> Tangent direction T = (-sin(a), cos(a))
        // Angle of T relative to +Z forward car mesh = -a
        car.rotation.y = -c.angle;
      });
    }

    // 5. Elevated Metro Train Animation
    if (metroTrainRef.current) {
      metroTrainRef.current.position.x += 0.35;
      if (metroTrainRef.current.position.x > 55) {
        metroTrainRef.current.position.x = -55;
      }
    }
  });

  return (
    <group>
      
      {/* North Highway Cars */}
      <group ref={northCarsRef}>
        {northCars.map((c, i) => (
          <group key={`north-car-${i}`}>
            <mesh castShadow>
              <boxGeometry args={[0.85, 0.42, 1.7]} />
              <meshStandardMaterial color={c.color} roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Windshield */}
            <mesh position={[0, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.75, 0.3, 0.9]} />
              <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* White Front Headlights (+Z direction) */}
            <mesh position={[-0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            {/* Red Rear Taillights (-Z direction) */}
            <mesh position={[-0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        ))}
      </group>

      {/* South Highway Cars */}
      <group ref={southCarsRef}>
        {southCars.map((c, i) => (
          <group key={`south-car-${i}`}>
            <mesh castShadow>
              <boxGeometry args={[0.85, 0.42, 1.7]} />
              <meshStandardMaterial color={c.color} roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.75, 0.3, 0.9]} />
              <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[-0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[-0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        ))}
      </group>

      {/* East-West Cross Avenue Cars */}
      <group ref={eastWestCarsRef}>
        {eastWestCars.map((c, i) => (
          <group key={`ew-car-${i}`}>
            <mesh castShadow>
              <boxGeometry args={[0.85, 0.42, 1.7]} />
              <meshStandardMaterial color={c.color} roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.75, 0.3, 0.9]} />
              <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[-0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[-0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Roundabout Ring Road Cars */}
      <group ref={roundaboutCarsRef}>
        {roundaboutCars.map((c, i) => (
          <group key={`roundabout-car-${i}`}>
            <mesh castShadow>
              <boxGeometry args={[0.85, 0.42, 1.7]} />
              <meshStandardMaterial color={c.color} roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.25, 0.05]} castShadow>
              <boxGeometry args={[0.75, 0.3, 0.9]} />
              <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={[-0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[0.3, 0.05, 0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[-0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0.3, 0.05, -0.86]}>
              <boxGeometry args={[0.15, 0.1, 0.04]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Elevated Futuristic Metro Train */}
      <group ref={metroTrainRef} position={[-40, 8.9, 21]}>
        {[-4.5, 0, 4.5].map((cx, i) => (
          <group key={`metro-car-${i}`} position={[cx, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[4.2, 0.95, 1.1]} />
              <meshStandardMaterial color="#38BDF8" roughness={0.15} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[4.0, 0.35, 1.12]} />
              <meshBasicMaterial color="#BAE6FD" transparent opacity={0.85} />
            </mesh>
          </group>
        ))}
      </group>

    </group>
  );
}
