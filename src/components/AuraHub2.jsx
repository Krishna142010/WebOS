import { useState, useMemo } from "react";
import sleepIcon from "../icons/sleep.svg";
import restartIcon from "../icons/Restart.svg";
import auraLogo from "../icons/Aura Logo.svg";

function AuraHub({
  onClose,
  apps // Pass an array of your app functions from the main desktop state
}) {
  const [search, setSearch] = useState("");
  const [powerOpen, setPowerOpen] = useState(false);

  // Hardcoded app list for demonstration; optimally, pass these as props from Desktop
  const DEFAULT_APPS = [
    { id: "explorer", name: "File Explorer", icon: "📁", action: () => console.log("Open Explorer") },
    { id: "terminal", name: "Aura Command", icon: "⌨️", action: () => console.log("Open Terminal") },
    { id: "ai", name: "Aura AI", icon: "🧠", action: () => console.log("Open AI") },
    { id: "nav", name: "Stellar Nav", icon: "🚀", action: () => console.log("Open Nav") },
    { id: "music", name: "Media Player", icon: "🎵", action: () => console.log("Open Music") },
    { id: "notes", name: "Text Editor", icon: "📝", action: () => console.log("Open Notes") },
    { id: "calc", name: "Calculator", icon: "🔢", action: () => console.log("Open Calc") },
    { id: "settings", name: "System Settings", icon: "⚙️", action: () => console.log("Open Settings") },
  ];

  // Map props to our app list if provided, otherwise use defaults
  const appList = apps || DEFAULT_APPS;

  // Real-time search filtering
  const filteredApps = useMemo(() => {
    return appList.filter(app => app.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, appList]);

  const executeApp = (action) => {
    action();
    onClose(); // Close hub after launching an app
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.hub} onClick={(e) => e.stopPropagation()}>
        
        {/* Header & Search */}
        <div style={styles.header}>
          <div style={styles.brand}>
            <img src={auraLogo} alt="AuraOS" style={styles.logo} />
            <div>
              <h2 style={styles.title}>AuraOS</h2>
              <span style={styles.subtitle}>Central Hub</span>
            </div>
          </div>
          <input 
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications or commands..." 
            style={styles.searchInput} 
          />
        </div>

        {/* Application Grid */}
        <div style={styles.appGrid}>
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <button key={app.id} onClick={() => executeApp(app.action)} style={styles.appBtn}>
                <div style={styles.appIcon}>{app.icon}</div>
                <div style={styles.appName}>{app.name}</div>
              </button>
            ))
          ) : (
            <div style={styles.noResults}>No systems match your query.</div>
          )}
        </div>

        {/* Footer Power Controls */}
        <div style={styles.footer}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>CM</div>
            <span>Commander</span>
          </div>

          <div style={{ position: "relative" }}>
            <button style={styles.powerBtn} onClick={() => setPowerOpen(!powerOpen)}>⏻</button>
            
            {powerOpen && (
              <div style={styles.powerMenu}>
                <button style={styles.powerMenuItem}>Sleep</button>
                <button style={styles.powerMenuItem}>Restart</button>
                <button style={{...styles.powerMenuItem, color: "#ef4444"}}>Emergency Halt</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 10000, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "80px" },
  hub: { width: "600px", height: "500px", backgroundColor: "rgba(15, 18, 25, 0.85)", backdropFilter: "blur(20px)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 48px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: '"Inter", sans-serif', color: "#e8eef8", animation: "slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)" },
  header: { padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  brand: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" },
  logo: { width: "40px", height: "40px" },
  title: { margin: 0, fontSize: "20px", fontWeight: "600" },
  subtitle: { fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" },
  searchInput: { width: "100%", padding: "12px 16px", backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  appGrid: { flex: 1, padding: "24px", overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", alignContent: "start" },
  appBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px", backgroundColor: "transparent", border: "1px solid transparent", borderRadius: "12px", cursor: "pointer", color: "#e8eef8", transition: "all 0.2s" },
  appIcon: { fontSize: "32px", marginBottom: "4px" },
  appName: { fontSize: "12px", fontWeight: "500" },
  noResults: { gridColumn: "1 / -1", textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: "40px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", backgroundColor: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.06)" },
  userInfo: { display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: "500" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" },
  powerBtn: { width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "16px", cursor: "pointer" },
  powerMenu: { position: "absolute", bottom: "50px", right: "0", width: "160px", backgroundColor: "rgba(20,24,34,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px", display: "flex", flexDirection: "column", gap: "4px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" },
  powerMenuItem: { padding: "10px 12px", textAlign: "left", backgroundColor: "transparent", border: "none", borderRadius: "4px", color: "#e8eef8", fontSize: "13px", cursor: "pointer" }
};

export default AuraHub;