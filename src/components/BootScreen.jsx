import { useState, useEffect } from "react";

const BOOT_SEQUENCE = [
  "AuraOS Microkernel v4.1.0-deep-space initializing...",
  "Running Power-On Self-Test (POST)... OK",
  "Checking memory allocation... 64TB Quantum RAM Verified",
  "Mounting Virtual File System (VFS)... OK",
  "Initializing cryptographic security protocols... SECURE",
  "Establishing telemetry uplink to central relay... ESTABLISHED",
  "Loading neural pathways for Aura AI Copilot...",
  "Calibrating navigation thrusters... NOMINAL",
  "Boot sequence complete. Transitioning to graphical interface."
];

function BootScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [showLogo, setShowLogo] = useState(false);
  const [fade, setFade] = useState(false);

  // Phase 1: Terminal Boot Sequence
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_SEQUENCE.length) {
        setLogs(prev => [...prev, BOOT_SEQUENCE[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowLogo(true), 800);
      }
    }, 350); // Speed of the terminal typing

    return () => clearInterval(interval);
  }, []);

  // Phase 2: Graphical Logo Transition
  useEffect(() => {
    if (showLogo) {
      const timer = setTimeout(() => {
        setFade(true); // Trigger fade out
        setTimeout(onComplete, 1200); // Unmount after fade
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showLogo, onComplete]);

  return (
    <div style={{...styles.container, opacity: fade ? 0 : 1}}>
      <div className="scanlines" style={styles.scanlines} />
      
      {!showLogo ? (
        <div style={styles.terminal}>
          {logs.map((log, i) => (
            <div key={i} style={styles.logLine}>
              <span style={styles.timestamp}>[{String(i * 0.43).padEnd(4, '0')}]</span> {log}
            </div>
          ))}
          <div style={styles.cursor}>_</div>
        </div>
      ) : (
        <div style={styles.logoContainer}>
          <div style={styles.ring} />
          <h1 style={styles.title}>AURA OS</h1>
          <p style={styles.subtitle}>SYSTEMS ONLINE</p>
        </div>
      )}

      {/* Embedded CSS for hardware-accelerated animations */}
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes floatIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: { position: "fixed", inset: 0, backgroundColor: "#05070a", color: "#e8eef8", zIndex: 9999, transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: '"JetBrains Mono", "SF Mono", monospace' },
  scanlines: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))", backgroundSize: "100% 4px", pointerEvents: "none", zIndex: 10 },
  terminal: { position: "absolute", top: "40px", left: "40px", width: "100%", fontSize: "13px", color: "#6b9e78" },
  logLine: { marginBottom: "6px", textShadow: "0 0 4px rgba(107, 158, 120, 0.4)" },
  timestamp: { color: "#4b6e56", marginRight: "12px" },
  cursor: { display: "inline-block", width: "8px", height: "14px", backgroundColor: "#6b9e78", animation: "blink 1s step-end infinite" },
  logoContainer: { display: "flex", flexDirection: "column", alignItems: "center", animation: "floatIn 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards" },
  ring: { width: "80px", height: "80px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#6366F1", borderRightColor: "#6366F1", animation: "spin 2s linear infinite", marginBottom: "24px" },
  title: { fontSize: "32px", fontWeight: "300", letterSpacing: "0.4em", margin: "0 0 8px 0", textShadow: "0 0 20px rgba(255,255,255,0.2)" },
  subtitle: { fontSize: "11px", color: "#6366F1", letterSpacing: "0.3em", fontWeight: "600" }
};

export default BootScreen;