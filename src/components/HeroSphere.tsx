"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, OrbitControls } from "@react-three/drei";

function AnimatedSphere() {
  const sphereRef = useRef<any>();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (sphereRef.current) {
        sphereRef.current.rotation.x = t * 0.4; // Increased speed slightly
        sphereRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <Sphere visible args={[1, 100, 200]} scale={2.4} ref={sphereRef}>
      <MeshDistortMaterial
        color="#8b5cf6"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.4}
      />
    </Sphere>
  );
}

export default function HeroSphere() {
  return (
    // Explicit height is CRITICAL here. If this div is 0px, the canvas is 0px.
    <div className="h-[500px] w-full relative flex items-center justify-center">
      <Canvas 
        className="absolute inset-0 z-10"
        // FIX: Force the camera to look from a distance of 5 units back
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#c084fc" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        
        <AnimatedSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {/* Background glow to ensure it's not just pitch black */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-[120px] -z-10" />
    </div>
  );
}