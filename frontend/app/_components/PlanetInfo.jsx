// /app/components/PlanetInfo.jsx
import { motion } from "framer-motion";
import React from "react";

const PlanetInfo = ({ name, description, distance, index }) => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }} // Start off-screen to the left
      animate={{ x: 0, opacity: 1 }} // Animate into view
      whileHover={{ scale: 1.05 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.1, // Add delay to stagger animations for each planet
      }}
      className="fixed top-20 left-0 w-64 p-4 bg-gray-600 bg-opacity-50 text-white shadow-lg rounded-r-lg mt-4 h-[40vh]" // Tailwind styles with margin-top to space out each planet info box
      style={{ top: `${index * 12 + 20}vh` }} // Adjusting top position based on index
    >
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm mb-4">{description}</p>
      <p className="text-sm font-semibold">
        Distance from Earth: {distance} million km
      </p>
    </motion.div>
  );
};

export default PlanetInfo;
