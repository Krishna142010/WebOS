import { useEffect, useState } from "react";
import auraLogo from "../icons/aura-logo.svg";

function Taskbar({ setHubOpen, hubOpen, openApps = [], activeAppId, onAppClick }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.taskbarContainer}>
      {/* Left: Environment Info */}
      <div style={styles.sideSection}>
        <span style={styles.envText}>AuraOS v1.0.2</span>
      </div>

      {/* Center: The Dock */}
      <div style={styles.dock}>
        {/* Start / Hub Button */}
        <button 
          style={{...styles.appIconBtn, background: hubOpen ? "rgba(255,255,255,0.1)" : "transparent"}} 
          onClick={() => setHubOpen(!hubOpen)}
        >
          <img src={auraLogo} alt="Aura Hub" style={styles.logo} />
        </button>

        <div style={styles.divider} />

        {/* Open Applications */}
        {openApps.map((app) => {
          const isActive = activeAppId === app.id;
          return (
            <button
              key={app.id}
              style={{...styles.appIconBtn, background: isActive ? "rgba(255,255,255,0.08)" : "transparent"}}
              onClick={() => onAppClick(app.id)}
              title={app.name}
            >
              <span style={styles.appIconEmoji}>{app.icon}</span>
              {/* Active Indicator Dot */}
              <div style={{...styles.activeIndicator, opacity: isActive ? 1 : 0.4, width: isActive ? "16px" : "4px"}} />
            </button>
          );
        })}
      </div>

      {/* Right: System Tray */}
      <div style={{...styles.sideSection, justifyContent: "flex-end"}}>
        <div style={styles.sysTray}>
          <span>📶</span>
          <span>🔋 98%</span>
          <div style={styles.clockContainer}>
            <span style={{fontSize: "12px", fontWeight: "600"}}>{time}</span>
            <span style={{fontSize: "10px", color: "rgba(255,255,255,0.5)"}}>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  taskbarContainer: { position: "fixed", bottom: 0, left: 0, right: 0, height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "linear-gradient(to top, rgba(5,7,10,0.9), rgba(5,7,10,0.4))", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.06)", zIndex: 9999, userSelect: "none", fontFamily: '"Inter", sans-serif', color: "#e8eef8" },
  sideSection: { flex: 1, display: "flex", alignItems: "center" },
  envText: { fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" },
  dock: { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "6px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" },
  appIconBtn: { position: "relative", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s" },
  logo: { width: "24px", height: "24px", filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))" },
  appIconEmoji: { fontSize: "24px" },
  divider: { width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 4px" },
  activeIndicator: { position: "absolute", bottom: "2px", height: "3px", backgroundColor: "#6366F1", borderRadius: "2px", transition: "all 0.3s" },
  sysTray: { display: "flex", alignItems: "center", gap: "16px", padding: "6px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" },
  clockContainer: { display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: "1.2" }
};

export default Taskbar;