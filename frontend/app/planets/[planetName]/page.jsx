"use client";
import { useEffect, useState } from "react";
import PlanetDetail from "../../_components/PlanetDetails";
import { notFound, useParams } from "next/navigation";
import Animation from "@/app/_components/Animation";
import PlanetInfo from "@/app/_components/PlanetInfo";

const PlanetModel = () => {
  const { planetName } = useParams();
  const [loading, setLoading] = useState(true);

  const planetsData = {
    sun: {
      name: "Sun",
      description: "The center of the Solar System, a hot, dense gas.",
      distance: 150,
    },
    mercury: {
      name: "Mercury",
      description:
        "The smallest and closest planet to the Sun in the Solar System.",
      distance: 91,
    },
    venus: {
      name: "Venus",
      description:
        "The second planet from the Sun, often referred to as Earth’s twin.",
      distance: 41,
    },
    earth: {
      name: "Earth",
      description:
        "Our home planet, the third from the Sun and the only astronomical object known to harbor life.",
      distance: 0,
    },
    mars: {
      name: "Mars",
      description:
        "The fourth planet from the Sun, known as the Red Planet due to iron oxide on its surface.",
      distance: 78,
    },
    jupiter: {
      name: "Jupiter",
      description:
        "The largest planet in the Solar System, known for its Great Red Spot.",
      distance: 628,
    },
    saturn: {
      name: "Saturn",
      description: "The sixth planet from the Sun, famous for its ring system.",
      distance: 1275,
    },
    uranus: {
      name: "Uranus",
      description:
        "The seventh planet, known for its axial tilt and faint ring system.",
      distance: 2723,
    },
    neptune: {
      name: "Neptune",
      description:
        "The eighth and farthest planet from the Sun, known for its deep blue color.",
      distance: 4347,
    },
  };

  const planet = planetsData[planetName.toLowerCase()]; // Match the planet name from the data

  // If the planet is not found, show a 404 or a custom not found page
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 1 second
    }, 1000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div>
      <PlanetDetail planetName={planetName} />
      <PlanetInfo
        name={planet.name}
        description={planet.description}
        distance={planet.distance}
      />
    </div>
  );
};

export default PlanetModel;
