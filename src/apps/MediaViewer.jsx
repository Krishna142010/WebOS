import { useEffect, useState } from "react";

function MediaViewer({ file }) {
  const [selectedFile, setSelectedFile] = useState(file || null);

  useEffect(() => {
    setSelectedFile(file);
  }, [file]);

  if (!selectedFile) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyTitle}>No media selected.</div>
        <div>Open images or video files through File Explorer.</div>
      </div>
    );
  }

  return (
    <div style={styles.viewerShell}>
      <header style={styles.header}>
        <div>
          <div style={styles.title}>{selectedFile.name}</div>
          <div style={styles.subtitle}>{selectedFile.type.toUpperCase()} • {selectedFile.size} bytes</div>
        </div>
        <div style={styles.meta}>Opened from {selectedFile.parent}</div>
      </header>

      <main style={styles.mediaArea}>
        {selectedFile.type === "image" ? (
          <img src={selectedFile.content} alt={selectedFile.name} style={styles.media} />
        ) : selectedFile.type === "video" ? (
          <video controls style={styles.media}>
            <source src={selectedFile.content} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        ) : (
          <div style={styles.emptyState}>Unsupported media type.</div>
        )}
      </main>

      <footer style={styles.footer}>
        <button style={styles.actionBtn} onClick={() => navigator.clipboard.writeText(selectedFile.name)}>
          Copy filename
        </button>
        <a href={selectedFile.content} download={selectedFile.name} style={styles.downloadLink}>
          Download
        </a>
      </footer>
    </div>
  );
}

const styles = {
  viewerShell: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(6, 10, 22, 0.95)", color: "#e8eef8", fontFamily: "Inter, system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", gap: "14px" },
  title: { fontSize: "16px", fontWeight: 700 },
  subtitle: { fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" },
  meta: { fontSize: "11px", color: "rgba(255,255,255,0.45)" },
  mediaArea: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
  media: { maxWidth: "100%", maxHeight: "100%", borderRadius: "14px", boxShadow: "0 16px 40px rgba(0,0,0,0.45)" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" },
  actionBtn: { padding: "10px 16px", borderRadius: "10px", border: "none", background: "#4f46e5", color: "white", cursor: "pointer" },
  downloadLink: { padding: "10px 16px", borderRadius: "10px", textDecoration: "none", background: "rgba(255,255,255,0.1)", color: "#fff" },
  emptyState: { display: "flex", flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "8px", color: "rgba(255,255,255,0.65)" },
  emptyTitle: { fontSize: "18px", fontWeight: 700 },
};

export default MediaViewer;
