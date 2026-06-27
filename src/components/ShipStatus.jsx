import { useEffect, useState } from "react";

export default function ShipStatus() {
  const [uptime, setUptime] = useState(0);
  const [systems, setSystems] = useState({ eng: 65, shd: 82, com: 91 });

  // Uptime Counter
  useEffect(() => {
    const timer = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live System Fluctuation Simulation
  useEffect(() => {
    const fluctuate = setInterval(() => {
      setSystems({
        eng: 60 + Math.floor(Math.random() * 30),
        shd: 75 + Math.floor(Math.random() * 20),
        com: 85 + Math.floor(Math.random() * 15)
      });
    }, 1500);
    return () => clearInterval(fluctuate);
  }, []);

  const formatTime = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={styles.widget}>
      <div style={styles.header}>LIVE TELEMETRY</div>
      
      <div style={styles.systemContainer}>
        <SystemBar label="ENG" value={systems.eng} color="#ef4444" />
        <SystemBar label="SHD" value={systems.shd} color="#3b82f6" />
        <SystemBar label="COM" value={systems.com} color="#10b981" />
      </div>

      <div style={styles.divider} />

      <div style={styles.uptimeContainer}>
        <span style={styles.uptimeLabel}>SYS UPTIME</span>
        <span style={styles.uptimeValue}>{formatTime(uptime)}</span>
      </div>
    </div>
  );
}

function SystemBar({ label, value, color }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${value}%`, backgroundColor: color }} />
      </div>
      <span style={styles.valueText}>{value}%</span>
    </div>
  );
}

const styles = {
  widget: { position: "fixed", right: "24px", top: "80px", width: "260px", padding: "20px", borderRadius: "16px", background: "rgba(15, 18, 25, 0.65)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8eef8", fontFamily: '"SF Mono", monospace', userSelect: "none", zIndex: 50 },
  header: { fontSize: "11px", letterSpacing: "0.2em", fontWeight: "700", color: "#6366F1", marginBottom: "16px" },
  systemContainer: { display: "flex", flexDirection: "column", gap: "12px" },
  row: { display: "flex", alignItems: "center", gap: "12px" },
  label: { fontSize: "11px", width: "24px", opacity: 0.7 },
  barTrack: { flex: 1, height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" },
  barFill: { height: "100%", transition: "width 0.5s ease" },
  valueText: { fontSize: "11px", width: "30px", textAlign: "right" },
  divider: { height: "1px", background: "rgba(255,255,255,0.08)", margin: "16px 0" },
  uptimeContainer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  uptimeLabel: { fontSize: "10px", opacity: 0.5, letterSpacing: "0.1em" },
  uptimeValue: { fontSize: "12px", color: "#4ade80", textShadow: "0 0 8px rgba(74, 222, 128, 0.4)" }
};