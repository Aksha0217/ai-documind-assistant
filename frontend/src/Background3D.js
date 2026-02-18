import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars(props) {
  const ref = useRef();
  
  // Generate random positions for stars
  const [sphere] = React.useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      const x = Math.cos(theta) * Math.cos(phi) * THREE.MathUtils.randFloat(1, 3);
      const y = Math.sin(theta) * Math.cos(phi) * THREE.MathUtils.randFloat(1, 3);
      const z = Math.sin(phi) * THREE.MathUtils.randFloat(1, 3);
      positions.set([x, y, z], i * 3);
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#667eea"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingCube({ position, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial
        color="#764ba2"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function FloatingTorus({ position, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.z += 0.005 * speed;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[0.15, 0.05, 16, 100]} />
      <meshStandardMaterial
        color="#667eea"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <FloatingCube position={[-1, 0.5, 0]} speed={0.8} />
        <FloatingCube position={[1, -0.3, -0.5]} speed={1.2} />
        <FloatingTorus position={[0.5, 0.8, -0.3]} speed={0.6} />
        <FloatingTorus position={[-0.7, -0.5, -0.2]} speed={1} />
      </Canvas>
    </div>
  );
}
