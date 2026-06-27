import { useEffect, useState, useRef } from "react";

export default function CursorShip() {
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [angle, setAngle] = useState(0);
  const [trails, setTrails] = useState([]);
  
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationRef = useRef();

  useEffect(() => {
    const handleMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      const target = targetRef.current;
      const current = posRef.current;

      // Smooth Lerp for position
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      
      current.x += dx * 0.15;
      current.y += dy * 0.15;

      // Calculate Angle
      const moving = Math.abs(dx) > 2 || Math.abs(dy) > 2;
      let newAngle = angle;
      if (moving) {
        newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      }

      // Generate Thruster Trail if moving fast enough
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        setTrails(prev => [
          ...prev.slice(-15), // Keep max 15 particles
          { id: Date.now(), x: current.x, y: current.y, opacity: 1 }
        ]);
      }

      // Fade out trails
      setTrails(prev => prev.map(t => ({ ...t, opacity: t.opacity - 0.08 })).filter(t => t.opacity > 0));

      setPos({ x: current.x, y: current.y });
      setAngle(newAngle);

      animationFrameId = requestAnimationFrame(animate);
    };

    let animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [angle]);

  return (
    <>
      {/* Thruster Trails */}
      {trails.map(t => (
        <div key={t.id} style={{
          position: "fixed",
          left: t.x, top: t.y,
          width: "4px", height: "4px",
          background: "#6366F1",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          opacity: t.opacity,
          pointerEvents: "none",
          zIndex: 9998,
          boxShadow: "0 0 8px #6366F1"
        }}/>
      ))}

      {/* Main Ship Cursor */}
      <div style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "transform 0.05s linear",
        fontSize: "20px",
        filter: "drop-shadow(0 0 6px rgba(99, 102, 241, 0.8))"
      }}>
        🚀
      </div>
    </>
  );
}