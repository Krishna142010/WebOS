import { useEffect, useState } from "react";

function Taskbar({ setHubOpen, hubOpen, openApps = [], activeAppId, onAppClick }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString([], { month: "short", day: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.taskbarContainer}>
      <div style={styles.sideSection}>
        <button style={{ ...styles.startBtn, ...(hubOpen ? styles.startBtnActive : {}) }} onClick={() => setHubOpen(!hubOpen)}>
          ⊞
        </button>
        <span style={styles.envText}>Windows-style AuraOS</span>
      </div>

      <div style={styles.dock}>
        {openApps.map((app) => {
          const isActive = activeAppId === app.id;
          return (
            <button
              key={app.id}
              style={{ ...styles.appIconBtn, ...(isActive ? styles.appIconBtnActive : {}) }}
              onClick={() => onAppClick(app.id)}
              title={app.title}
            >
              <span style={styles.appIconEmoji}>{app.icon}</span>
            </button>
          );
        })}
      </div>

      <div style={{ ...styles.sideSection, justifyContent: "flex-end" }}>
        <div style={styles.sysTray}>
          <span>📶</span>
          <span>🔋 98%</span>
          <div style={styles.clockContainer}>
            <span style={{ fontSize: "12px", fontWeight: "600" }}>{time}</span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  taskbarContainer: { position: "fixed", bottom: 0, left: 0, right: 0, height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: "linear-gradient(180deg, rgba(16,24,40,0.95) 0%, rgba(8,12,20,0.97) 100%)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.13)", zIndex: 9999, userSelect: "none", fontFamily: '"Inter", sans-serif', color: "#f8fafc" },
  sideSection: { flex: 1, display: "flex", alignItems: "center", gap: "12px" },
  envText: { fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.72)", textTransform: "uppercase" },
  startBtn: { width: "42px", height: "42px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", cursor: "pointer", fontSize: "20px", boxShadow: "0 8px 16px rgba(37, 99, 235, 0.35)" },
  startBtnActive: { background: "linear-gradient(135deg, #1d4ed8, #1e40af)" },
  dock: { display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", padding: "6px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" },
  appIconBtn: { position: "relative", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s", background: "rgba(255,255,255,0.06)", color: "#fff" },
  appIconBtnActive: { background: "rgba(255,255,255,0.16)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)" },
  appIconEmoji: { fontSize: "22px" },
  sysTray: { display: "flex", alignItems: "center", gap: "14px", padding: "8px 12px", background: "rgba(255,255,255,0.08)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px" },
  clockContainer: { display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: "1.2" },
};

export default Taskbar;