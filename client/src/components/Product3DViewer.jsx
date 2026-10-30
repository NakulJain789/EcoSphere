import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D model representing sustainable goods (Flask / Tumbler)
const ProceduralBottle = () => {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Bottle Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 2.2, 32]} />
        <meshStandardMaterial
          color="#28584B"
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* Shoulder */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.35, 0.7, 0.5, 32]} />
        <meshStandardMaterial
          color="#28584B"
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* Cap - Bamboo wood look */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.4, 32]} />
        <meshStandardMaterial
          color="#CCA971"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Metal loop ring */}
      <mesh position={[0, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.04, 16, 32]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

const Product3DViewer = ({ productName = 'Eco Product', category = '' }) => {
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
      <div className="w-full h-80 rounded-2xl bg-sage-100 dark:bg-charcoal-800 flex items-center justify-center p-6 text-center">
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
          3D preview unavailable on this device. Displaying photo gallery.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-sage-100 to-cream-200 dark:from-charcoal-800 dark:to-charcoal-900 overflow-hidden relative border border-sage-200 dark:border-charcoal-700">
      <div className="absolute top-3 left-3 z-10 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-semibold text-charcoal-700 dark:text-cream-50 shadow-sm pointer-events-none">
        Drag to rotate 360°
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 1.5]}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, -2, -2]} intensity={0.4} color="#829177" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <ProceduralBottle />
          </Float>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
};

export default Product3DViewer;
