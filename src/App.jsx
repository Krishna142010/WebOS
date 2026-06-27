import { useState, useEffect, useCallback } from "react";

// --- System Components ---
import BootScreen from "./components/BootScreen";
import AnimatedBackground from "./components/AnimatedBackground";
import CursorShip from "./components/CursorShip";
import Taskbar from "./components/Taskbar";
import AuraHub from "./components/AuraHub2";
import Window from "./components/Windows";
import ShipStatus from "./components/ShipStatus";
import OrbitalWidget from "./components/OrbitalWidget";
import AlienPet from "./components/AlienPet";
import GettingStarted from "./components/GettingStarted";
import StellarNavigation from "./apps/StellarNavigation";
import gameIcon from "./icons/game.svg";
function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsMinimized, setSettingsMinimized] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const [sleeping, setSleeping] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const [commandMinimized, setCommandMinimized] = useState(false);
  const [notesMinimized, setNotesMinimized] = useState(false);
  const [explorerMinimized, setExplorerMinimized] = useState(false);
  const [calcMinimized, setCalcMinimized] = useState(false);
  const [auraOpen, setAuraOpen] = useState(false);
  const [auraMinimized, setAuraMinimized] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [musicMinimized, setMusicMinimized] = useState(false);
  const [stellarOpen, setStellarOpen] = useState(false);
  const [stellarMinimized, setStellarMinimized] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((title, message) => {
    const audio = new Audio(notificationSound);
    audio.volume = 0.5;
    audio.play().catch(() => {});
    setToast({ title, message });
  }, []);

  /* ----- Desktop right-click context menu ----- */
  const [contextMenu, setContextMenu] = useState({ open: false, x: 0, y: 0 });
  const desktopRef = useRef(null);
  const contextMenuRef = useRef(null);
  const [contextMenuOffset, setContextMenuOffset] = useState({ x: 0, y: 0 });

  /* Reposition menu near screen edges to avoid overflow (after layout) */
  useLayoutEffect(() => {
    if (!contextMenu.open || !contextMenuRef.current) {
      setContextMenuOffset({ x: 0, y: 0 });
      return;
    }

    const appDef = APP_REGISTRY[appId];
    if (!appDef) return;

    const newZ = highestZ + 1;
    setHighestZ(newZ);

    setOpenWindows(prev => [
      ...prev,
      {
        ...appDef,
        zIndex: newZ,
        isMinimized: false,
        x: Math.random() * 100 + 100, // Slight random offset
        y: Math.random() * 50 + 50
      }
    ]);
    setActiveWindowId(appId);
  }, [openWindows, highestZ, playClick]);

  const closeWindow = useCallback((appId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== appId));
    if (activeWindowId === appId) setActiveWindowId(null);
  }, [activeWindowId]);

  const focusWindow = useCallback((appId) => {
    if (activeWindowId === appId) return;
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    
    setOpenWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, zIndex: newZ, isMinimized: false } : w
    ));
    setActiveWindowId(appId);
  }, [activeWindowId, highestZ]);

  const toggleMinimize = useCallback((appId) => {
    setOpenWindows(prev => prev.map(w => {
      if (w.id === appId) {
        const minimizing = !w.isMinimized;
        if (minimizing && activeWindowId === appId) setActiveWindowId(null);
        return { ...w, isMinimized: minimizing };
      }
      return w;
    }));
  }, [activeWindowId]);

  // --- Render Logic ---
  if (systemState === "booting") {
    return <BootScreen onComplete={() => setSystemState("running")} />;
  }

  if (systemState === "emergency") {
    return <EmergencyScreen exitEmergency={() => setSystemState("running")} />;
  }

  // Convert object to array for the Hub
  const registeredAppsList = Object.values(APP_REGISTRY).map(app => ({
    ...app,
    action: () => launchApp(app.id)
  }));

  return (
    <div className="desktop-environment" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Background Layers */}
      <AnimatedBackground />
      <CursorShip />

      {/* Desktop Widgets */}
      <ShipStatus />
      <OrbitalWidget />
      <AlienPet />

      {/* Window Manager */}
      {openWindows.map(app => {
        if (app.isMinimized) return null;
        const Component = app.component;
        const isActive = activeWindowId === app.id;

        return (
          <Window
            key={app.id}
            id={app.id}
            title={app.name}
            icon={app.icon}
            defaultX={app.x}
            defaultY={app.y}
            width={app.width}
            height={app.height}
            zIndex={app.zIndex}
            isActive={isActive}
            onFocus={() => focusWindow(app.id)}
            onClose={() => closeWindow(app.id)}
            onMinimize={() => toggleMinimize(app.id)}
          >
            <Component />
          </Window>
        );
      })}

      {/* Central Hub Overlay */}
      {hubOpen && (
        <AuraHub 
          apps={registeredAppsList} 
          onClose={() => setHubOpen(false)}
          onEmergency={() => setSystemState("emergency")}
        />
      )}

      {/* Taskbar Dock */}
      <Taskbar 
        hubOpen={hubOpen}
        setHubOpen={setHubOpen}
        openApps={openWindows}
        activeAppId={activeWindowId}
        onAppClick={(id) => {
          const app = openWindows.find(w => w.id === id);
          if (app.isMinimized || activeWindowId !== id) focusWindow(id);
          else toggleMinimize(id);
        }}
      />
    </div>
  );
}

export default App;


