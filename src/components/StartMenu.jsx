function StartMenu({ openNotes, openExplorer, openCalculator, openSettings, openAuraAI, openBridge, openMusic, openStellar, onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.menu} onClick={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.logo}>⊞</div>
          <div>
            <div style={styles.title}>Windows-style AuraOS</div>
            <div style={styles.subtitle}>Start menu</div>
          </div>
        </div>

        <div style={styles.grid}>
          <button style={styles.tile} onClick={() => { openExplorer(); onClose(); }}>
            <span style={styles.tileIcon}>📁</span>
            <span>Explorer</span>
          </button>
          <button style={styles.tile} onClick={() => { openNotes(); onClose(); }}>
            <span style={styles.tileIcon}>📝</span>
            <span>Notepad</span>
          </button>
          <button style={styles.tile} onClick={() => { openCalculator(); onClose(); }}>
            <span style={styles.tileIcon}>🧮</span>
            <span>Calculator</span>
          </button>
          <button style={styles.tile} onClick={() => { openSettings(); onClose(); }}>
            <span style={styles.tileIcon}>⚙️</span>
            <span>Settings</span>
          </button>
          <button style={styles.tile} onClick={() => { openAuraAI(); onClose(); }}>
            <span style={styles.tileIcon}>🧠</span>
            <span>Aura AI</span>
          </button>
          <button style={styles.tile} onClick={() => { openBridge(); onClose(); }}>
            <span style={styles.tileIcon}>🛰️</span>
            <span>Bridge Console</span>
          </button>
          <button style={styles.tile} onClick={() => { openMusic(); onClose(); }}>
            <span style={styles.tileIcon}>🎵</span>
            <span>Media Player</span>
          </button>
          <button style={styles.tile} onClick={() => { openStellar(); onClose(); }}>
            <span style={styles.tileIcon}>🌌</span>
            <span>Stellar Nav</span>
          </button>
        </div>

        <div style={styles.footer}>
          <button style={styles.powerBtn} onClick={onClose}>Power</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "flex-end", justifyContent: "flex-start", padding: "0 0 80px 20px" },
  menu: { width: "340px", background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", padding: "18px", color: "#fff" },
  header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
  logo: { width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", fontSize: "20px" },
  title: { fontSize: "15px", fontWeight: 700 },
  subtitle: { fontSize: "12px", color: "rgba(255,255,255,0.65)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" },
  tile: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", cursor: "pointer" },
  tileIcon: { fontSize: "18px" },
  footer: { marginTop: "14px", display: "flex", justifyContent: "flex-end" },
  powerBtn: { padding: "8px 12px", borderRadius: "10px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" },
};

export default StartMenu;