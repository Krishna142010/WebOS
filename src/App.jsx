import { useState, useCallback } from "react";

import BootScreen from "./components/BootScreen";
import AnimatedBackground from "./components/AnimatedBackground";
import CursorShip from "./components/CursorShip";
import Taskbar from "./components/Taskbar";
import AuraHub from "./components/AuraHub2";
import ShipStatus from "./components/ShipStatus";
import OrbitalWidget from "./components/OrbitalWidget";
import AlienPet from "./components/AlienPet";
import GettingStarted from "./components/GettingStarted";

function App() {
  const [booting, setBooting] = useState(true);
  const [hubOpen, setHubOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
  }, []);

  if (booting) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="desktop-environment" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <AnimatedBackground />
      <CursorShip />
      <ShipStatus />
      <OrbitalWidget />
      <AlienPet />

      {showWelcome && <GettingStarted onContinue={() => setShowWelcome(false)} />}

      {hubOpen && <AuraHub apps={[]} onClose={() => setHubOpen(false)} />}

      <Taskbar
        hubOpen={hubOpen}
        setHubOpen={setHubOpen}
        openApps={[]}
        activeAppId={null}
        onAppClick={() => {}}
      />
    </div>
  );
}

export default App;


