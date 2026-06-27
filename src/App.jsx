import { useState, useCallback } from "react";

import BootScreen from "./components/BootScreen";
import Taskbar from "./components/Taskbar";
import Window from "./components/Windows";
import StartMenu from "./components/StartMenu";
import GettingStarted from "./components/GettingStarted";
import VideoBackground from "./components/VideoBackground";
import Toast from "./components/Toast";
import Explorer from "./apps/Explorer";
import Notes from "./apps/Notes";
import Calculator from "./apps/Calculator";
import Settings from "./apps/Settings";
import AuraAI from "./apps/AuraAI";
import AuraCommand from "./apps/AuraCommand";
import AuraMusic from "./apps/AuraMusic";
import StellarNavigation from "./apps/StellarNavigation";

const DESKTOP_APPS = [
  { id: "explorer", title: "File Explorer", icon: "📁", component: Explorer, width: 820, height: 520 },
  { id: "notepad", title: "Notepad", icon: "📝", component: Notes, width: 740, height: 520 },
  { id: "calculator", title: "Calculator", icon: "🧮", component: Calculator, width: 420, height: 520 },
  { id: "settings", title: "Settings", icon: "⚙️", component: Settings, width: 780, height: 540 },
  { id: "auraai", title: "Aura AI", icon: "🧠", component: AuraAI, width: 780, height: 540 },
  { id: "aura-command", title: "Bridge Console", icon: "🛰️", component: AuraCommand, width: 980, height: 620 },
  { id: "aura-music", title: "Media Player", icon: "🎵", component: AuraMusic, width: 680, height: 520 },
  { id: "stellar-nav", title: "Stellar Navigation", icon: "🌌", component: StellarNavigation, width: 980, height: 620 },
];

function App() {
  const [booting, setBooting] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [wallpaper, setWallpaper] = useState("default");
  const [toasts, setToasts] = useState([]);

  const handleBootComplete = useCallback(() => {
    setBooting(false);
  }, []);

  const showToast = useCallback((title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message }]);
  }, []);

  const openApp = useCallback((app) => {
    if (!app) return;

    setOpenWindows((prev) => {
      const highestZ = prev.reduce((max, w) => Math.max(max, w.zIndex || 100), 100);
      const existing = prev.find((window) => window.id === app.id);
      const appProps = app.id === "settings" ? { wallpaper, setWallpaper, showToast } : app.props || {};
      if (existing) {
        return prev.map((window) =>
          window.id === app.id
            ? { ...window, isMinimized: false, zIndex: highestZ + 1, props: appProps }
            : window
        );
      }

      return [
        ...prev,
        {
          ...app,
          width: app.width || 560,
          height: app.height || 360,
          zIndex: highestZ + 1,
          isMinimized: false,
          component: app.component,
          props: appProps,
        },
      ];
    });
    setActiveWindowId(app.id);
    setStartMenuOpen(false);
  }, [showToast, wallpaper, setWallpaper]);

  const closeWindow = useCallback((id) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const focusWindow = useCallback((id) => {
    setActiveWindowId(id);
    setOpenWindows((prev) => prev.map((window) => (window.id === id ? { ...window, isMinimized: false } : window)));
  }, []);

  const toggleMinimize = useCallback((id) => {
    setOpenWindows((prev) => prev.map((window) => (window.id === id ? { ...window, isMinimized: !window.isMinimized } : window)));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  if (booting) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="desktop-environment" style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #0f6ad8 0%, #0b1120 100%)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top left, rgba(255,255,255,0.25), transparent 35%)" }} />

      <VideoBackground wallpaperName={wallpaper} />
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          message={toast.message}
          onClose={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
        />
      ))}

      <div style={styles.desktopIcons}>
        {DESKTOP_APPS.map((app) => (
          <button key={app.id} style={styles.desktopIcon} onClick={() => openApp(app)}>
            <span style={styles.desktopIconGlyph}>{app.icon}</span>
            <span style={styles.desktopIconLabel}>{app.title}</span>
          </button>
        ))}
      </div>

      {openWindows.map((app) => {
        if (app.isMinimized) return null;
        const Component = app.component;
        return (
          <Window
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            width={app.width}
            height={app.height}
            zIndex={app.zIndex}
            isActive={activeWindowId === app.id}
            onFocus={() => focusWindow(app.id)}
            onClose={() => closeWindow(app.id)}
            onMinimize={() => toggleMinimize(app.id)}
          >
            <Component {...app.props} />
          </Window>
        );
      })}

      {showWelcome && <GettingStarted onContinue={() => setShowWelcome(false)} />}
      {startMenuOpen && (
        <StartMenu
          openExplorer={() => openApp(DESKTOP_APPS.find((app) => app.id === "explorer"))}
          openNotes={() => openApp(DESKTOP_APPS.find((app) => app.id === "notepad"))}
          openCalculator={() => openApp(DESKTOP_APPS.find((app) => app.id === "calculator"))}
          openSettings={() => openApp(DESKTOP_APPS.find((app) => app.id === "settings"))}
          openAuraAI={() => openApp(DESKTOP_APPS.find((app) => app.id === "auraai"))}
          openBridge={() => openApp(DESKTOP_APPS.find((app) => app.id === "aura-command"))}
          openMusic={() => openApp(DESKTOP_APPS.find((app) => app.id === "aura-music"))}
          openStellar={() => openApp(DESKTOP_APPS.find((app) => app.id === "stellar-nav"))}
          onClose={() => setStartMenuOpen(false)}
        />
      )}

      <Taskbar
        hubOpen={startMenuOpen}
        setHubOpen={setStartMenuOpen}
        openApps={openWindows}
        activeAppId={activeWindowId}
        onAppClick={(id) => {
          const window = openWindows.find((item) => item.id === id);
          if (!window) return;

          if (activeWindowId === id && !window.isMinimized) {
            toggleMinimize(id);
          } else {
            focusWindow(id);
            setOpenWindows((prev) => prev.map((item) => (item.id === id ? { ...item, isMinimized: false } : item)));
          }
        }}
      />
    </div>
  );
}

const styles = {
  desktopIcons: { position: "absolute", top: "24px", left: "24px", display: "flex", flexDirection: "column", gap: "16px", zIndex: 2 },
  desktopIcon: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "8px 10px", border: "none", background: "transparent", color: "#fff", cursor: "pointer", borderRadius: "8px" },
  desktopIconGlyph: { fontSize: "28px", filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))" },
  desktopIconLabel: { fontSize: "12px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" },
  windowContent: { padding: "24px", display: "flex", flexDirection: "column", gap: "12px", height: "100%", background: "linear-gradient(180deg, #f5f7fb 0%, #eef2f8 100%)", color: "#102033" },
  windowTitle: { fontSize: "20px", fontWeight: 700 },
  windowText: { fontSize: "14px", lineHeight: 1.6, color: "#4b5563" },
};

export default App;


