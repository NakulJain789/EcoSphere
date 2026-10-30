import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural EcoSphere with atmosphere and orbiting particles
const EcoGlobe = () => {
  const globeRef = useRef();
  const ringRef = useRef();

  // Create subtle procedural wireframe / dots texture
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = elapsed * 0.12;
      globeRef.current.rotation.x = Math.sin(elapsed * 0.05) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -elapsed * 0.08;
      ringRef.current.rotation.x = 1.1 + Math.sin(elapsed * 0.04) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central stylized Earth sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial
          color="#1E3F36"
          roughness={0.4}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Outer atmosphere halo */}
      <mesh scale={[1.58, 1.58, 1.58]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#819379"
          wireframe={true}
          transparent={true}
          opacity={0.25}
        />
      </mesh>

      {/* Orbiting ring of circular items */}
      <group ref={ringRef}>
        <mesh>
          <ringGeometry args={[2.3, 2.38, 64]} />
          <meshBasicMaterial
            color="#CCA971"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.4}
          />
        </mesh>
      </group>
    </group>
  );
};

const Hero3DCanvas = () => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-forest-800 to-sage-500 opacity-60 blur-2xl" />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="pointer-events-none"
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 4]} intensity={1.5} color="#FAF8F5" />
      <directionalLight position={[-4, -3, -2]} intensity={0.6} color="#819379" />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <EcoGlobe />
      </Float>
    </Canvas>
  );
};

export default Hero3DCanvas;
