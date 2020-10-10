import * as THREE from "three";
import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import "./LiquidMaterial";

function LiquidGradientComponent() {
  const ref = useRef();

  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
  return (
    <mesh>
      <planeBufferGeometry attach="geometry" />
      <liquidMaterial ref={ref} attach="material" />
    </mesh>
  );
}

export default function LiquidGradient() {
  return (
    <Canvas>
      <ambientLight intensity={0.85} />
      <LiquidGradientComponent />
    </Canvas>
  );
}
