import { useEffect, useState, useRef } from "react";
import "./AlienPet.css";

const MESSAGES = [
  "Captain, on duty.", "Ship status nominal.", "Scanning nearby sectors.",
  "No hostiles detected.", "The engines sound happy.", "Orbit looks clear, sir.",
  "Hull integrity: 100%.", "Awaiting orders.", "Fuel cells optimal."
];

export default function AlienPet() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("happy"); // happy, sleepy, alert
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(220); // X-axis position on screen

  // Eye tracking logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mood === "sleepy") return;
      
      // Calculate cursor position relative to bottom-left screen
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      
      const xOffset = ((e.clientX / screenW) - 0.5) * 6; // Max 3px movement
      const yOffset = ((e.clientY / screenH) - 1) * -4; // Look up

      setEyePos({ x: xOffset, y: yOffset - 2 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mood]);

  // Random Patrol & Speech Loop
  useEffect(() => {
    const loop = setInterval(() => {
      const randomAction = Math.random();
      
      if (randomAction > 0.7) {
        // Move randomly along the bottom bar
        const newPos = Math.max(50, Math.min(window.innerWidth - 100, position + (Math.random() * 200 - 100)));
        setPosition(newPos);
      } else if (randomAction > 0.4) {
        // Speak
        setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        setTimeout(() => setMessage(""), 4000);
      } else if (randomAction < 0.1) {
        // Sleep state
        setMood("sleepy");
        setMessage("Zzz...");
        setTimeout(() => setMood("happy"), 8000);
      }
    }, 6000);

    return () => clearInterval(loop);
  }, [position]);

  const petAlien = () => {
    setMood("happy");
    setMessage("Purrr... Systems optimized.");
    setXp(prev => {
      const newXp = prev + 15;
      if (newXp >= 100) {
        setLevel(l => l + 1);
        setMessage("Level Up! Crew rank increased.");
        return 0;
      }
      return newXp;
    });
  };

  return (
    <div className="alien-pet" style={{ left: `${position}px` }}>
      {/* Speech Bubble */}
      {message && (
        <div style={{
          position: "absolute", top: "-40px", left: "20px", width: "120px",
          background: "rgba(255,255,255,0.9)", color: "#000", padding: "6px 10px",
          borderRadius: "12px 12px 12px 0", fontSize: "11px", fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", animation: "bubbleIn 0.3s ease-out"
        }}>
          {message}
        </div>
      )}

      {/* Alien Body */}
      <div 
        className={`alien-body mood-${mood}`} 
        onClick={petAlien}
        style={{ cursor: "pointer", transition: "all 0.2s" }}
      >
        <div className="alien-visor" />
        
        {/* Eyes */}
        <div className="alien-eye-wrap left" style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}>
          <div className="alien-eye"><div className="alien-pupil" /></div>
        </div>
        <div className="alien-eye-wrap right" style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}>
          <div className="alien-eye"><div className="alien-pupil" /></div>
        </div>

        <div className="alien-mouth" />
        <div className="alien-arm left-arm" />
        <div className="alien-arm right-arm" />
        <div className="foot-left" />
        <div className="foot-right" />
      </div>

      {/* Level Indicator */}
      <div style={{
        position: "absolute", bottom: "-18px", left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.6)", padding: "2px 8px", borderRadius: "10px",
        fontSize: "9px", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.3)"
      }}>
        Lv.{level} | XP {xp}%
      </div>
    </div>
  );
}