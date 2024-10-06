"use client";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { TextGeometry } from "three-stdlib";
import * as THREE from "three";
import FullscreenContext from "./FullScreenContext";

// Extend R3F to include TextGeometry
extend({ TextGeometry });

// Function to load and display the GLB model
const Model = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath); // Load the GLB file
  const modelRef = useRef(); // Create a ref for the model

  // Ensure the model uses its original materials and textures
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Rotate the model continuously
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002; // Adjusted rotation speed on Y-axis
      modelRef.current.rotation.x += 0.001; // Adjusted rotation speed on X-axis
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={[0.1, 0.1, 0.1]}
      position={[0, 0, 0]}
    />
  );
};

const PlanetDetail = ({ planetName }) => {
  const { canvasRef, zoomLevel } = useContext(FullscreenContext); // Access the canvasRef from context
  const cameraRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    // Set initial camera position
    camera.position.z = 5;
    cameraRef.current = camera; // Store the camera reference

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up on unmount
      renderer.dispose();
    };
  }, [canvasRef]);

  // Effect to update camera zoom whenever zoomLevel changes
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.zoom = zoomLevel; // Update camera zoom
      cameraRef.current.updateProjectionMatrix(); // Update camera projection
    }
  }, [zoomLevel]);

  const modelPath = `/assets/${planetName}.glb`; // Assuming models are stored in public/models/

  // Memoize the geometry to avoid unnecessary recalculations
  const textOptions = useMemo(
    () => ({
      size: 1,
      height: 0.5,
    }),
    []
  );

  const GalaxyBackground = () => {
    const size = 500;
    const [texture, setTexture] = useState();

    useEffect(() => {
      const loader = new THREE.TextureLoader();
      loader.load("/bg.jpg", (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }, []);

    return (
      texture && (
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
      )
    );
  };

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 20, 50], fov: 75 }}
      style={{ height: "100vh", width: "100vw" }}
      shadows // Enable shadows on the canvas
    >
      <ambientLight intensity={1} /> {/* Stronger ambient light */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={4}
        color="white"
        castShadow
      />{" "}
      {/* Directional light simulating sunlight */}
      <hemisphereLight color="white" groundColor="black" intensity={0.8} />
      <GalaxyBackground /> {/* Same parallax galaxy background */}
      <Environment preset="sunset" />{" "}
      {/* Add environment map for global lighting */}
      <OrbitControls minDistance={90} maxDistance={500} />{" "}
      {/* Set minimum and maximum zoom distances */}
      {/* Load and display the 3D model */}
      <Model modelPath={modelPath} />
    </Canvas>
  );
};

export default PlanetDetail;
