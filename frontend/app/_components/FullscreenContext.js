'use client'
import  { createContext, useState, useRef, useEffect } from "react";

const FullscreenContext = createContext(null);

export const FullscreenProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // New state for zoom level
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level

  const toggleFullscreen = () => {
    if (canvasRef.current) {
      if (!isFullscreen) {
        canvasRef.current
          .requestFullscreen()
          .catch((err) => console.error(err));
      } else {
        document.exitFullscreen().catch((err) => console.error(err));
      }
    }
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.1, 10)); // Max zoom level
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.1, 1)); // Min zoom level
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <FullscreenContext.Provider
      value={{
        canvasRef,
        isFullscreen,
        toggleFullscreen,
        zoomLevel,
        zoomIn,
        zoomOut,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
};

export default FullscreenContext;
