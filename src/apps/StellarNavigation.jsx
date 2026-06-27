import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSystemAudio } from "../hooks/useSystemAudio"; // Ensure this matches your hook's path
import "./StellarNavigation.css";

// ... [Keep WORLD constants, helpers, and procedural generation exactly as they are] ...

export default function StellarNavigation() {
  const { playClick, playNotification } = useSystemAudio(); // Hook integration
  
  const shipRef = useRef({
    x: 0, y: 0, vx: 0, vy: 0, heading: 0, thrusting: false, boosting: false
  });
  const sceneRef = useRef(null);
  const zoomRef = useRef(1.0);
  const particlesRef = useRef([]);
  const aiMessageTimerRef = useRef(null);
  const lastAiMessageRef = useRef("");
  const lastHudUpdateRef = useRef(0);

  const [sector, setSector] = useState({ x: 0, y: 0 });
  const [systems, setSystems] = useState({
    hull: 100, shield: 100, fuel: 100, oxygen: 100, reactor: 100, navStatus: "STANDBY",
  });
  const systemsRef = useRef(systems);
  
  useEffect(() => { systemsRef.current = systems; }, [systems]);
  
  const [logEntries, setLogEntries] = useState([]);
  const [inventory, setInventory] = useState({});
  const [autopilot, setAutopilot] = useState(false);
  const [alert, setAlert] = useState(null);
  const [aiMessage, setAiMessage] = useState("");
  const [started, setStarted] = useState(false);
  const [hudShip, setHudShip] = useState({ vx: 0, vy: 0, heading: 0 });

  const inputRef = useInput(started);

  const addLog = useCallback((text, kind = "info") => {
    setLogEntries((prev) => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const next = [...prev, { id: `${Date.now()}_${Math.random()}`, time, text, kind }];
      return next.length > 50 ? next.slice(next.length - 50) : next;
    });
  }, []);

  const speakAi = useCallback((category) => {
    const lines = AI_LINES[category];
    if (!lines || lines.length === 0) return;
    const line = pick(lines);
    if (line === lastAiMessageRef.current) return;
    lastAiMessageRef.current = line;
    setAiMessage(line);
    
    // Audio feedback for AI messages
    playNotification(); 

    if (aiMessageTimerRef.current) clearTimeout(aiMessageTimerRef.current);
    aiMessageTimerRef.current = setTimeout(() => setAiMessage(""), 5000);
    addLog(`[AI] ${line}`, "ai");
  }, [addLog, playNotification]);

  const showAlert = useCallback((text, level = "warning", duration = 4000) => {
    setAlert({ text, level });
    if (level === "danger") playNotification(); // Critical sound for danger
    setTimeout(() => {
      setAlert((cur) => (cur && cur.text === text ? null : cur));
    }, duration);
  }, [playNotification]);

  const loadSector = useCallback((sx, sy) => {
    const scene = generateSector(sx, sy);
    sceneRef.current = scene;
    setSector({ x: sx, y: sy });
    addLog(`Entered sector ${sx},${sy}.`, "sector");
    speakAi("sector");
  }, [addLog, speakAi]);

  const startMission = useCallback(() => {
    playClick(); // Button feedback
    setStarted(true);
    loadSector(0, 0);
    addLog("Mission start. Bridge online.", "info");
    speakAi("startup");
    setSystems((s) => ({ ...s, navStatus: "ACTIVE" }));
  }, [loadSector, addLog, speakAi, playClick]);

  // Enhanced Particle Spawner for Hyper-Drive feel
  const spawnTrailParticle = useCallback((ship) => {
    if (!ship.thrusting) return;
    const back = ship.heading + Math.PI;
    const px = ship.x + Math.cos(back) * 18;
    const py = ship.y + Math.sin(back) * 18;
    
    // Elongated particles during boost for 'warp' visual
    const speedMult = ship.boosting ? 1.8 : 1.0; 
    
    if (particlesRef.current.length > 150) particlesRef.current.shift();
    particlesRef.current.push({
      x: px + rand(-3, 3),
      y: py + rand(-3, 3),
      vx: (Math.cos(back) * rand(30, 80) + ship.vx * 0.1) * speedMult,
      vy: (Math.sin(back) * rand(30, 80) + ship.vy * 0.1) * speedMult,
      r: ship.boosting ? rand(2, 5) : rand(1.5, 3),
      life: 1.0,
      maxLife: rand(0.3, 0.6) * (ship.boosting ? 1.5 : 1),
      color: ship.boosting ? "#b8caff" : (Math.random() > 0.5 ? "#7ad4ff" : "#a0e4ff"),
      age: 0,
    });
  }, []);

  useGameLoop((dt) => {
    if (!started || !sceneRef.current) return;
    const ship = shipRef.current;
    const scene = sceneRef.current;
    const input = inputRef.current;
    const sys = systemsRef.current;

    const boosting = input.keys.space && sys.fuel > 0;
    ship.boosting = boosting; // Track for particles
    
    // ... [Keep the rest of the physical loop exactly the same until the collision logic] ...

    /* --- Collisions: asteroids --- */
    let damageThisFrame = 0;
    for (const a of scene.asteroids || []) {
      const rr = a.r + 14;
      if (dist2(ship.x, ship.y, a.x, a.y) < rr * rr) {
        // Bounce physics
        const dx = ship.x - a.x;
        const dy = ship.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / d;
        const ny = dy / d;
        ship.x = a.x + nx * rr;
        ship.y = a.y + ny * rr;
        
        const vdotn = ship.vx * nx + ship.vy * ny;
        ship.vx -= 1.6 * vdotn * nx;
        ship.vy -= 1.6 * vdotn * ny;
        damageThisFrame += WORLD.collisionDamage;
        
        playNotification(); // Audio feedback on hull strike
        
        for (let i = 0; i < 12; i++) {
          particlesRef.current.push({
            x: a.x + rand(-a.r, a.r),
            y: a.y + rand(-a.r, a.r),
            vx: rand(-120, 120),
            vy: rand(-120, 120),
            r: rand(1, 4),
            life: 1,
            maxLife: rand(0.5, 1.0),
            age: 0,
            color: "#1612eb", // Spark color for collision
          });
        }
      }
    }

    // ... [Keep the rest of the logic intact down to the return statement] ...