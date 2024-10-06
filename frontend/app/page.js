import SolarSystem from "./_components/SolarSystem.js";
// import { FullscreenProvider } from "../app/_components/FullScreenContext.js"; 
export default function Home() {
  return (
    // <FullscreenProvider>
      <div className="relative h-screen overflow-hidden">
        <SolarSystem />
      </div>
    // </FullscreenProvider>
  );
}
