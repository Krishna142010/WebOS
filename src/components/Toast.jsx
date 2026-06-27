import { useEffect, useState } from "react";

export default function Toast({ title, message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in
    requestAnimationFrame(() => setIsVisible(true));
    
    // Auto-dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for slide-out animation to finish
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      ...styles.toast,
      transform: isVisible ? "translateX(0)" : "translateX(120%)",
      opacity: isVisible ? 1 : 0
    }}>
      <div style={styles.icon}>ℹ</div>
      <div>
        <div style={styles.title}>{title}</div>
        <div style={styles.message}>{message}</div>
      </div>
      <div style={styles.progressBar} />
    </div>
  );
}

const styles = {
  toast: { position: "fixed", top: "24px", right: "24px", width: "300px", background: "rgba(15, 18, 25, 0.9)", border: "1px solid rgba(99, 102, 241, 0.4)", borderRadius: "8px", padding: "16px", display: "flex", gap: "12px", color: "#e8eef8", fontFamily: '"Inter", sans-serif', boxShadow: "0 12px 24px rgba(0,0,0,0.4)", transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", zIndex: 100000, overflow: "hidden" },
  icon: { color: "#0d2fee", fontSize: "20px" },
  title: { fontSize: "13px", fontWeight: "600", marginBottom: "4px" },
  message: { fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.4" },
  progressBar: { position: "absolute", bottom: 0, left: 0, height: "3px", background: "#1189fa", animation: "shrink 4s linear forwards" }
};