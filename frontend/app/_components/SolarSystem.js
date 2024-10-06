"use client";
import { useRef, useState, useEffect, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import FullscreenContext from "./FullScreenContext";
import { useRouter } from "next/navigation";

// Keplerian elements for planets
const KeplerianElements = {
  Mercury: { a: 0.387, e: 0.2056, speed: 4.74, inclination: -7.0, period: 88 }, // Days to complete one orbit
  Venus: { a: 0.723, e: 0.0068, speed: 3.5, inclination: -3.39, period: 225 },
  Earth: { a: 1.0, e: 0.0167, speed: 2.99, inclination: 0.0, period: 365 },
  Mars: { a: 1.524, e: 0.0934, speed: 2.41, inclination: -1.85, period: 687 },
  Jupiter: {
    a: 5.204,
    e: 0.0489,
    speed: 1.31,
    inclination: 1.31,
    period: 4331,
  },
  Saturn: {
    a: 9.582,
    e: 0.0565,
    speed: 0.97,
    inclination: 2.49,
    period: 10747,
  },
  Uranus: {
    a: 19.218,
    e: 0.0457,
    speed: 0.68,
    inclination: 0.77,
    period: 30687,
  },
  Neptune: {
    a: 30.07,
    e: 0.0086,
    speed: 0.54,
    inclination: 1.77,
    period: 60190,
  },
};

// Scaling factor for the semi-major axes
const scaleFactor = 10; // Adjust this value as needed to fit in the canvas

// Calculate the position in an elliptical orbit
const calculatePosition = (semiMajorAxis, eccentricity, angle, inclination) => {
  const inclinationRadians = (inclination * Math.PI) / 180;

  // Correct elliptical orbit calculation
  const radius =
    (semiMajorAxis * scaleFactor * (1 - eccentricity * eccentricity)) /
    (1 + eccentricity * Math.cos(angle));

  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = radius * Math.sin(inclinationRadians);

  return { x, y, z };
};
// Glow Component for planets
const Glow = ({ position, radius, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius * 1.2, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.7}
        emissive={color}
        emissiveIntensity={1}
      />
    </mesh>
  );
};

const Planet = ({
  name,
  radius,
  color,
  semiMajorAxis,
  eccentricity,
  inclination,
  angle,
  onClick,
}) => {
  const meshRef = useRef();

  const [hovered, setHovered] = useState(false);

  const { x, y, z } = calculatePosition(
    semiMajorAxis,
    eccentricity,
    angle,
    inclination
  );

  // Rotation of planets around their own axis
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Rotation speed
    }
  });

  return (
    <>
      <Glow position={[x, y, z]} radius={radius} color={color} />
      <mesh
        ref={meshRef}
        position={[x, y, z]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        rotation={[inclination * (Math.PI / 180), 0, 0]}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? "hotpink" : color}
          emissive={hovered ? "white" : "black"}
          emissiveIntensity={hovered ? 1 : 0.1}
        />
        <Html
          position={[0, radius * 2, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              color: "#C0C2C9",
              fontWeight: "bold",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            {name}
          </div>
        </Html>
      </mesh>
    </>
  );
};

const Trajectory = ({ semiMajorAxis, eccentricity, inclination, color }) => {
  const points = [];
  const numPoints = 200; // Increased the number of points for smoother orbit

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2; // Go full 360 degrees
    const radius =
      semiMajorAxis * scaleFactor * (1 - eccentricity * Math.cos(angle));
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = radius * Math.sin((inclination * Math.PI) / 180);
    points.push([x, y, z]);
  }

  return <Line points={points} color={color} lineWidth={1} />;
};
const PlanetOrbit = ({ planet, angle, onClick }) => {
  return (
    <>
      <Planet
        name={planet.name}
        radius={planet.radius}
        color={planet.color}
        semiMajorAxis={planet.semiMajorAxis}
        eccentricity={planet.eccentricity}
        inclination={planet.inclination}
        angle={angle}
        onClick={onClick}
      />
      <Trajectory
        semiMajorAxis={planet.semiMajorAxis}
        eccentricity={planet.eccentricity}
        inclination={planet.inclination}
        color={planet.orbitColor}
      />
    </>
  );
};

const PlanetAnimation = ({
  planets,
  setAngles,
  setCurrentDate,
  speedFactor,
}) => {
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime(); // Time in seconds since the last render
    const earthPeriodInSeconds =
      planets.find((planet) => planet.name === "Earth").period * 24 * 60 * 60; // Total seconds for one complete orbit of Earth

    // Update angles based on elapsed time and speed factor
    setAngles((prevAngles) =>
      prevAngles.map((angle, index) => {
        // Calculate the angle increment for this frame
        const angleIncrement =
          planets[index].speed *
          (elapsedTime / earthPeriodInSeconds) *
          speedFactor *
          (Math.PI * 2);
        return (angle + angleIncrement) % (Math.PI * 2); // Keep angle within 0 to 2π
      })
    );

    // Update current date: Increment by daysIncrement directly related to Earth's speed
    const daysIncrement = speedFactor * (elapsedTime / earthPeriodInSeconds); // Increment in days
    setCurrentDate(
      (prevDate) =>
        new Date(prevDate.getTime() + daysIncrement * 24 * 60 * 60 * 1000)
    ); // Add days in milliseconds
  });

  return null;
};

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

const SolarSystem = () => {
  const router = useRouter();
  const { canvasRef, zoomLevel } = useContext(FullscreenContext); // Access the canvasRef from context
  const cameraRef = useRef();

  const [speedFactor, setSpeedFactor] = useState(1); // Move useState here

  // Reference date: January 1, 2020, when we know the positions of planets
  const referenceDate = new Date("2024-10-05");
  const referenceDateEpoch = new Date("2020-01-01").getTime();
  const daysSinceReference = Math.floor(
    (referenceDate.getTime() - referenceDateEpoch) / (1000 * 60 * 60 * 24)
  );

  // const [currentDate, setCurrentDate] = useState(new Date(referenceDateEpoch));
  const [currentDate, setCurrentDate] = useState(new Date());

  const planets = [
    {
      name: "Mercury",
      semiMajorAxis: 0.387,
      color: "gray",
      radius: 0.3,
      speed: KeplerianElements.Mercury.speed,
      inclination: KeplerianElements.Mercury.inclination,
      eccentricity: KeplerianElements.Mercury.e,
      orbitColor: "silver",
      period: KeplerianElements.Mercury.period,
    },
    {
      name: "Venus",
      semiMajorAxis: 0.723,
      color: "orange",
      radius: 0.4,
      speed: KeplerianElements.Venus.speed,
      inclination: KeplerianElements.Venus.inclination,
      eccentricity: KeplerianElements.Venus.e,
      orbitColor: "gold",
      period: KeplerianElements.Venus.period,
    },
    {
      name: "Earth",
      semiMajorAxis: 1.0,
      color: "blue",
      radius: 0.5,
      speed: KeplerianElements.Earth.speed,
      inclination: KeplerianElements.Earth.inclination,
      eccentricity: KeplerianElements.Earth.e,
      orbitColor: "lightblue",
      period: KeplerianElements.Earth.period,
    },
    {
      name: "Mars",
      semiMajorAxis: 1.524,
      color: "red",
      radius: 0.35,
      speed: KeplerianElements.Mars.speed,
      inclination: KeplerianElements.Mars.inclination,
      eccentricity: KeplerianElements.Mars.e,
      orbitColor: "pink",
      period: KeplerianElements.Mars.period,
    },
    {
      name: "Jupiter",
      semiMajorAxis: 5.204,
      color: "brown",
      radius: 0.6,
      speed: KeplerianElements.Jupiter.speed,
      inclination: KeplerianElements.Jupiter.inclination,
      eccentricity: KeplerianElements.Jupiter.e,
      orbitColor: "tan",
      period: KeplerianElements.Jupiter.period,
    },
    {
      name: "Saturn",
      semiMajorAxis: 9.582,
      color: "goldenrod",
      radius: 0.55,
      speed: KeplerianElements.Saturn.speed,
      inclination: KeplerianElements.Saturn.inclination,
      eccentricity: KeplerianElements.Saturn.e,
      orbitColor: "yellow",
      period: KeplerianElements.Saturn.period,
    },
    {
      name: "Uranus",
      semiMajorAxis: 19.218,
      color: "lightblue",
      radius: 0.45,
      speed: KeplerianElements.Uranus.speed,
      inclination: KeplerianElements.Uranus.inclination,
      eccentricity: KeplerianElements.Uranus.e,
      orbitColor: "skyblue",
      period: KeplerianElements.Uranus.period,
    },
    {
      name: "Neptune",
      semiMajorAxis: 30.07,
      color: "darkblue",
      radius: 0.45,
      speed: KeplerianElements.Neptune.speed,
      inclination: KeplerianElements.Neptune.inclination,
      eccentricity: KeplerianElements.Neptune.e,
      orbitColor: "navy",
      period: KeplerianElements.Neptune.period,
    },
  ];

  const [angles, setAngles] = useState(
    planets.map((planet) => {
      // Calculate initial angles based on days since reference
      const angle = (daysSinceReference / planet.period) * (Math.PI * 2); // 2π radians for one complete orbit
      return angle % (Math.PI * 2); // Ensure angle is between 0 and 2π
    })
  );

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

  // Click handler for planets
  const handlePlanetClick = (planetName) => {
    router.push(`/planets/${planetName}`);
  };

  // new code
  const toggleSpeed = (i) => {
    if (i === 0.1) {
      setSpeedFactor(1);
    }
    if (i === 0) {
      // Reset angles to initial positions based on the reference date
      const initialAngles = planets.map((planet) => {
        const angle = (daysSinceReference / planet.period) * (Math.PI * 2);
        return angle % (Math.PI * 2);
      });
      setAngles(initialAngles); // Reset angles to initial positions
      setSpeedFactor(1); // Reset speed factor
      setCurrentDate(new Date());
    } else {
      setSpeedFactor(i); // Set speed factor for other speed options
    }
  };
  const [handleValue, setHandleValue] = useState();
  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    const newSpeedFactor = Math.pow(10, value); // Exponential adjustment
    setHandleValue(newSpeedFactor);
    // setSpeedFactor(newSpeedFactor);
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // Full month name (e.g., October)
    day: "numeric", // Day of the month (1-31)
  });

  return (
    <>
      {/* <div>
        <label
          for="minmax-range"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Min-max range
        </label>
        <input
          id="minmax-range"
          type="range"
          min="0"
          max="10"
          value="5"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div> */}

      <div className="flex justify-center gap-8 absolute bottom-[10px] z-50  w-full">
        <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white bg-opacity-70 shadow-sm">
          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => {
              toggleSpeed(0);
            }}
          >
            Live
          </button>

          <div className=" h-[30px] w-[1px] bg-slate-500"></div>

          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => {
              toggleSpeed(-5000);
            }}
          >
            ⏮️
          </button>

          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => {
              toggleSpeed(0.1);
            }}
          >
            ⏸️
          </button>

          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => {
              toggleSpeed(5000);
            }}
          >
            ⏭️
          </button>
          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => {
              toggleSpeed(1);
            }}
          >
            1x
          </button>
        </span>
      </div>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 10, 30], fov: 75 }}
        className="z-0"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1.5} />

        <GalaxyBackground />
        <OrbitControls minDistance={2} maxDistance={500} />
        <PlanetAnimation
          planets={planets}
          setAngles={setAngles}
          setCurrentDate={setCurrentDate}
          speedFactor={speedFactor}
        />
        {planets.map((planet, index) => (
          <PlanetOrbit
            key={index}
            planet={planet}
            angle={angles[index]}
            onClick={() => handlePlanetClick(planet.name)}
          />
        ))}
        <Planet
          name=""
          radius={0.5}
          color="yellow"
          semiMajorAxis={0}
          eccentricity={0}
          speed={0}
          inclination={0}
          angle={0}
          onClick={() => handlePlanetClick("sun")}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "30px",
          zIndex: 1,
          color: "white",
        }}
      >
        <p>{formattedDate}</p>
      </div>
    </>
  );
};

export default SolarSystem;
