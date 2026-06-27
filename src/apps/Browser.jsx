import { useContext, useState } from "react";
import { SystemContext } from "../SystemContext.jsx";

const QUICK_SITES = [
  { label: "Google", value: "https://www.google.com" },
  { label: "Bing", value: "https://www.bing.com" },
  { label: "AuraNet Status", value: "https://example.com" },
];

function Browser() {
  const { network, currentTime, formattedTimeShort } = useContext(SystemContext);
  const [address, setAddress] = useState("https://www.google.com");
  const [url, setUrl] = useState(address);
  const [statusMessage, setStatusMessage] = useState("Ready to browse.");
  const [hasFrameError, setHasFrameError] = useState(false);

  const goTo = (value) => {
    if (!network.online) {
      setStatusMessage("Offline. Reconnect AuraNet to browse.");
      return;
    }
    const destination = value.startsWith("http") ? value : `https://${value}`;
    setAddress(destination);
    setUrl(destination);
    setHasFrameError(false);
    setStatusMessage(`Loaded ${destination}`);
  };

  const handleSearch = (engine) => {
    if (!network.online) {
      setStatusMessage("Offline. Unable to search.");
      return;
    }
    const query = encodeURIComponent(address.trim());
    if (!query) return;
    goTo(engine === "bing" ? `https://www.bing.com/search?q=${query}` : `https://www.google.com/search?q=${query}`);
  };

  return (
    <div style={styles.browserShell}>
      <div style={styles.navigationBar}>
        <div style={styles.browserBrand}>
          <span style={styles.browserIcon}>🌐</span>
          <div>
            <div style={styles.browserTitle}>Aura Web</div>
            <div style={styles.browserSubtitle}>{formattedTimeShort} · {network.online ? network.provider : "Offline"}</div>
          </div>
        </div>

        <div style={styles.addressRow}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter URL or query"
            style={styles.addressInput}
          />
          <button onClick={() => goTo(address)} style={styles.actionBtn}>Navigate</button>
          <button onClick={() => handleSearch("google")} style={styles.actionBtn}>Google</button>
          <button onClick={() => handleSearch("bing")} style={styles.actionBtn}>Bing</button>
        </div>

        <div style={styles.quickLinks}>
          {QUICK_SITES.map((site) => (
            <button key={site.label} onClick={() => goTo(site.value)} style={styles.linkBtn}>
              {site.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.browserBody}>
        {network.online ? (
          <iframe
            title="Aura Browser"
            key={url}
            src={url}
            style={styles.browserFrame}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onError={() => setHasFrameError(true)}
          />
        ) : (
          <div style={styles.offlinePanel}>
            <div style={styles.offlineTitle}>Offline Mode</div>
            <div>Connect to AuraNet to browse the web.</div>
          </div>
        )}
      </div>

      <div style={styles.statusBar}>
        <span>{statusMessage}</span>
        <span>{network.online ? `Signal ${network.signal}/5 · ${network.ip}` : "No connection"}</span>
      </div>
    </div>
  );
}

const styles = {
  browserShell: { display: "flex", flexDirection: "column", height: "100%", backgroundColor: "rgba(4, 9, 22, 0.9)", borderRadius: "0 0 12px 12px", overflow: "hidden", color: "#e8eef8", fontFamily: 'Inter, system-ui, sans-serif' },
  navigationBar: { padding: "18px 20px", background: "rgba(15, 23, 42, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  browserBrand: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" },
  browserIcon: { fontSize: "24px" },
  browserTitle: { fontSize: "15px", fontWeight: 700 },
  browserSubtitle: { fontSize: "11px", color: "rgba(255,255,255,0.65)" },
  addressRow: { display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "10px", alignItems: "center" },
  addressInput: { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" },
  actionBtn: { padding: "10px 14px", borderRadius: "10px", border: "none", background: "#4f46e5", color: "white", cursor: "pointer", fontWeight: 600 },
  quickLinks: { marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" },
  linkBtn: { padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#fff", cursor: "pointer" },
  browserBody: { flex: 1, position: "relative", minHeight: "0" },
  browserFrame: { width: "100%", height: "100%", border: "none", background: "#0c111e" },
  offlinePanel: { height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.8)", fontSize: "14px" },
  offlineTitle: { fontSize: "18px", fontWeight: 700 },
  statusBar: { display: "flex", justifyContent: "space-between", padding: "12px 18px", background: "rgba(8, 13, 26, 0.9)", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", color: "rgba(255,255,255,0.75)" },
};

export default Browser;
