import { useState, useEffect } from "react";

export default function EmergencyScreen({ exitEmergency }) {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOverride = () => {
    if (code === "AURA-77" || code.toLowerCase() === "override") {
      exitEmergency();
    } else {
      setCode(""); // Flash error visually in a real app
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.scanlines} />
      <div style={styles.pulseVignette} />
      
      <div style={styles.alertBox}>
        <h1 style={styles.title}>⚠ CRITICAL ALERT</h1>
        <p style={styles.warning}>UNAUTHORIZED SECTOR BREACH DETECTED.</p>
        
        <div style={styles.countdown}>
          IMPACT IN: 00:{String(timeLeft).padStart(2, '0')}
        </div>

        <div style={styles.inputArea}>
          <input 
            autoFocus
            style={styles.input}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleOverride()}
            placeholder="ENTER OVERRIDE CODE"
          />
          <button style={styles.btn} onClick={handleOverride}>AUTHORIZE</button>
        </div>
      </div>

      <style>{`
        @keyframes pulseRed {
          0% { box-shadow: inset 0 0 0px rgba(239, 68, 68, 0); }
          50% { box-shadow: inset 0 0 120px rgba(239, 68, 68, 0.4); }
          100% { box-shadow: inset 0 0 0px rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { position: "fixed", inset: 0, backgroundColor: "#050000", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"SF Mono", monospace', color: "#f87171" },
  scanlines: { position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)", pointerEvents: "none" },
  pulseVignette: { position: "absolute", inset: 0, animation: "pulseRed 2s infinite", pointerEvents: "none" },
  alertBox: { zIndex: 2, textAlign: "center", border: "2px solid #ef4444", backgroundColor: "rgba(20, 0, 0, 0.8)", padding: "40px 60px", backdropFilter: "blur(10px)" },
  title: { fontSize: "48px", margin: "0 0 10px 0", letterSpacing: "0.1em", textShadow: "0 0 20px #ef4444" },
  warning: { fontSize: "16px", color: "#fca5a5", letterSpacing: "0.2em", marginBottom: "30px" },
  countdown: { fontSize: "32px", color: "#fff", marginBottom: "40px" },
  inputArea: { display: "flex", gap: "10px", justifyContent: "center" },
  input: { padding: "12px 20px", fontSize: "16px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#fff", outline: "none", textAlign: "center", letterSpacing: "0.1em" },
  btn: { padding: "12px 24px", fontSize: "16px", backgroundColor: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", letterSpacing: "0.1em" }
};