import { useState, useEffect, useRef } from "react";

function Window({
  id,
  title,
  icon,
  children,
  defaultX = 100,
  defaultY = 100,
  width = "600px",
  height = "400px",
  isActive,
  zIndex,
  onClose,
  onMinimize,
  onFocus,
}) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaxPosition, setPreMaxPosition] = useState({ x: 0, y: 0 });
  
  const windowRef = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle Dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || isMaximized) return;
      
      // Calculate new position
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      // Prevent dragging completely off-screen (Edge boundaries)
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 60;
      newX = Math.max(-window.innerWidth / 2, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "auto"; // Restore text selection
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMaximized]);

  const handleMouseDown = (e) => {
    if (isMaximized) return;
    onFocus();
    isDragging.current = true;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const toggleMaximize = () => {
    if (!isMaximized) {
      setPreMaxPosition(position);
      setIsMaximized(true);
    } else {
      setPosition(preMaxPosition);
      setIsMaximized(false);
    }
  };

  return (
    <div
      ref={windowRef}
      onMouseDownCapture={onFocus}
      style={{
        ...styles.window,
        zIndex: zIndex,
        top: isMaximized ? 0 : position.y,
        left: isMaximized ? 0 : position.x,
        width: isMaximized ? "100vw" : width,
        height: isMaximized ? "calc(100vh - 60px)" : height, // Leave room for taskbar
        borderRadius: isMaximized ? "0px" : "12px",
        border: isActive ? "1px solid rgba(99, 102, 241, 0.5)" : "1px solid rgba(255,255,255,0.1)",
        boxShadow: isActive ? "0 24px 48px rgba(0,0,0,0.6)" : "0 12px 24px rgba(0,0,0,0.4)",
        transition: isDragging.current ? "none" : "width 0.2s, height 0.2s, top 0.2s, left 0.2s, border-color 0.2s, border-radius 0.2s",
      }}
    >
      {/* Title Bar */}
      <div 
        style={{...styles.titleBar, background: isActive ? "rgba(20,24,34,0.9)" : "rgba(10,12,16,0.9)"}}
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <div style={styles.titleInfo}>
          {icon && <span style={{fontSize: "14px"}}>{icon}</span>}
          <span style={{opacity: isActive ? 1 : 0.6}}>{title}</span>
        </div>

        <div style={styles.controls}>
          <button style={styles.controlBtn} onClick={onMinimize}>—</button>
          <button style={styles.controlBtn} onClick={toggleMaximize}>{isMaximized ? "❐" : "◻"}</button>
          <button style={{...styles.controlBtn, ...styles.closeBtn}} onClick={onClose}>✕</button>
        </div>
      </div>

      {/* App Content Area */}
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  window: { position: "fixed", display: "flex", flexDirection: "column", backgroundColor: "rgba(15, 18, 25, 0.85)", backdropFilter: "blur(20px)", overflow: "hidden", fontFamily: '"Inter", sans-serif', color: "#e8eef8" },
  titleBar: { height: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", cursor: "default", borderBottom: "1px solid rgba(255,255,255,0.06)", userSelect: "none" },
  titleInfo: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "500", pointerEvents: "none" },
  controls: { display: "flex", gap: "4px" },
  controlBtn: { width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", borderRadius: "6px", cursor: "pointer", fontSize: "12px", transition: "all 0.15s" },
  closeBtn: { cursor: "pointer" }, // Add hover effects via CSS if desired: hover:bg-red-500 hover:text-white
  content: { flex: 1, position: "relative", overflow: "hidden" }
};

export default Window;