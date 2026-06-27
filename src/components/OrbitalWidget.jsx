import { useEffect, useRef } from "react";

export default function OrbitalWidget() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let angle = 0;
    
    // Generate random radar contacts
    const contacts = Array.from({ length: 4 }, () => ({
      r: Math.random() * 60 + 20,
      theta: Math.random() * Math.PI * 2,
      fade: 0
    }));

    const draw = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Clear canvas with trail effect
      ctx.fillStyle = "rgba(10, 12, 16, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Rings
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.lineWidth = 1;
      [30, 60, 90].forEach(r => {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      });

      // Draw Radar Sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 95, 0, -0.2, true);
      ctx.closePath();
      ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
      ctx.fill();
      ctx.restore();

      // Draw Contacts
      contacts.forEach(c => {
        const diff = Math.abs(angle - c.theta);
        if (diff < 0.1 || diff > Math.PI * 2 - 0.1) c.fade = 1.0; // Light up when swept
        
        if (c.fade > 0) {
          ctx.beginPath();
          ctx.arc(cx + Math.cos(c.theta) * c.r, cy + Math.sin(c.theta) * c.r, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74, 222, 128, ${c.fade})`;
          ctx.fill();
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#4ade80";
          c.fade -= 0.02; // Fade out
          ctx.shadowBlur = 0;
        }
      });

      angle = (angle + 0.03) % (Math.PI * 2);
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.label}>PROXIMITY RADAR</div>
      <canvas ref={canvasRef} width={200} height={200} style={styles.canvas} />
    </div>
  );
}

const styles = {
  container: { position: "fixed", right: "24px", top: "270px", width: "260px", background: "rgba(15, 18, 25, 0.65)", backdropFilter: "blur(24px)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", zIndex: 49 },
  label: { width: "100%", fontSize: "11px", letterSpacing: "0.2em", color: "#6366F1", fontWeight: "700", marginBottom: "12px", fontFamily: '"SF Mono", monospace' },
  canvas: { borderRadius: "50%", border: "1px solid rgba(99, 102, 241, 0.3)", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(0,0,0,0) 70%)" }
};