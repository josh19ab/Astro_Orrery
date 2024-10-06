import Link from "next/link";

const planets = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "sun"
];

const PlanetsList = () => {
  return (
    <div>
      <h1>Planets List</h1>
      <ul>
        {planets.map((planet) => (
          <li key={planet}>
            <Link href={`/planets/${planet}`}>{planet}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanetsList;
