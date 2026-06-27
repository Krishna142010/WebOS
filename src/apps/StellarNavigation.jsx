import { useEffect, useState } from "react";
import { useSystemAudio } from "../hooks/useSystemAudio";
import "./StellarNavigation.css";

function StellarNavigation() {
  const { playClick, playNotification } = useSystemAudio();
  const [sector, setSector] = useState({ x: 0, y: 0 });
  const [hull, setHull] = useState(100);
  const [fuel, setFuel] = useState(100);
  const [shields, setShields] = useState(100);
  const [oxygen, setOxygen] = useState(100);
  const [reactor, setReactor] = useState(92);
  const [navStatus, setNavStatus] = useState("STANDBY");
  const [autopilot, setAutopilot] = useState(false);
  const [logEntries, setLogEntries] = useState([
    { time: "00:00:00", message: "Bridge computer ready.", level: "info" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (navStatus === "ACTIVE") {
        setFuel((value) => Math.max(0, value - 0.28));
        setHull((value) => Math.max(0, value - 0.04));
        setOxygen((value) => Math.max(0, value - 0.15));
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [navStatus]);

  const addLog = (message, level = "info") => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setLogEntries((prev) => [
      ...prev.slice(-28),
      { time, message, level },
    ]);
  };

  const engageAutopilot = () => {
    playClick();
    setAutopilot((previous) => {
      const next = !previous;
      addLog(next ? "Autopilot engaged." : "Autopilot disengaged.", "info");
      return next;
    });
  };

  const executeJump = () => {
    if (fuel < 18) {
      addLog("Jump aborted: insufficient fuel.", "warn");
      playNotification();
      return;
    }

    if (hull < 40) {
      addLog("Jump aborted: hull integrity critical.", "warn");
      playNotification();
      return;
    }

    playClick();
    setNavStatus("ACTIVE");
    setFuel((value) => Math.max(0, value - 18));
    setSector((coords) => ({ x: coords.x + 1, y: coords.y }));
    addLog("Hyperspace jump complete. Sector advanced.", "info");
  };

  const resetSystems = () => {
    playClick();
    setHull(100);
    setFuel(100);
    setShields(100);
    setOxygen(100);
    setReactor(92);
    setNavStatus("STANDBY");
    setAutopilot(false);
    addLog("Systems reset to nominal parameters.", "info");
  };

  const statusFor = (value) => (value > 70 ? "ok" : value > 35 ? "warn" : "danger");

  return (
    <div className="stellar-navigation">
      <header className="sn-hud-top">
        <div className="sn-hud-left">
          <div className="sn-hud-block">
            <span className="sn-hud-label">Sector</span>
            <span className="sn-hud-value">{sector.x},{sector.y}</span>
          </div>
          <div className="sn-hud-block">
            <span className="sn-hud-label">Nav</span>
            <span className="sn-hud-value">{navStatus}</span>
          </div>
        </div>
        <div className="sn-hud-right">
          <div className={`sn-hud-block sn-status-${statusFor(hull)}`}>
            <span className="sn-hud-label">Hull</span>
            <span className="sn-hud-value">{Math.round(hull)}%</span>
          </div>
          <div className={`sn-hud-block sn-status-${statusFor(fuel)}`}>
            <span className="sn-hud-label">Fuel</span>
            <span className="sn-hud-value">{Math.round(fuel)}%</span>
          </div>
          <div className={`sn-hud-block sn-status-${statusFor(shields)}`}>
            <span className="sn-hud-label">Shields</span>
            <span className="sn-hud-value">{Math.round(shields)}%</span>
          </div>
        </div>
      </header>

      <main className="sn-main-panel">
        <section className="sn-panel sn-panel-controls">
          <div className="sn-panel-header">
            <span>Flight Controls</span>
            <span className="sn-ai-comm">{autopilot ? "Autopilot engaged" : "Manual helm"}</span>
          </div>
          <div className="sn-control-grid">
            <button className="sn-button" onClick={engageAutopilot}>
              {autopilot ? "Disable Autopilot" : "Engage Autopilot"}
            </button>
            <button className="sn-button sn-button-primary" onClick={executeJump}>
              Execute Jump
            </button>
            <button className="sn-button" onClick={resetSystems}>
              Reset Systems
            </button>
          </div>
        </section>

        <section className="sn-panel sn-panel-log">
          <div className="sn-panel-header">
            <span>Bridge Log</span>
            <span>{new Date().toLocaleTimeString([], { hour12: false })}</span>
          </div>
          <div className="sn-log-list">
            {logEntries.map((item) => (
              <div key={`${item.time}-${item.message}`} className={`sn-log-entry sn-log-${item.level}`}>
                <span>{item.time}</span>
                <span>{item.message}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StellarNavigation;
