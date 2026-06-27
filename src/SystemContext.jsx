import { createContext, useEffect, useMemo, useState } from "react";
import sampleImage from "./assets/hero.png";
import sampleVideo from "./assets/wallpaper.mp4";

const SystemContext = createContext(null);

const DEFAULT_DISK_IMAGE = {
  root: {
    id: "root",
    name: "Aura Drive (C:)",
    type: "folder",
    parent: null,
    children: ["desktop", "documents", "downloads", "projects", "images", "videos"],
  },
  desktop: {
    id: "desktop",
    name: "Desktop",
    type: "folder",
    parent: "root",
    children: ["readme.txt", "mission_briefing.txt"],
  },
  documents: {
    id: "documents",
    name: "Documents",
    type: "folder",
    parent: "root",
    children: ["starmap.txt", "captain_log.txt", "notes.txt"],
  },
  downloads: {
    id: "downloads",
    name: "Downloads",
    type: "folder",
    parent: "root",
    children: ["beacon_signal.mp4"],
  },
  projects: {
    id: "projects",
    name: "Projects",
    type: "folder",
    parent: "root",
    children: [],
  },
  images: {
    id: "images",
    name: "Images",
    type: "folder",
    parent: "root",
    children: ["mission_photo.png", "nebula_landscape.jpg", "crew_portrait.jpg"],
  },
  videos: {
    id: "videos",
    name: "Media",
    type: "folder",
    parent: "root",
    children: ["launch_clip.mp4", "warp_drive_test.mp4"],
  },
  "readme.txt": {
    id: "readme.txt",
    name: "readme.txt",
    type: "text",
    parent: "desktop",
    content: "Welcome to Aura OS. Deep space telemetry systems operational.",
    size: 58,
    created: Date.now(),
    modified: Date.now(),
  },
  "mission_briefing.txt": {
    id: "mission_briefing.txt",
    name: "mission_briefing.txt",
    type: "text",
    parent: "desktop",
    content: "CLASSIFIED: Operation Aurora\nObjective: Explore deep space and document discoveries.\nStatus: In Progress\nLast Updated: Stardate 2461.3",
    size: 156,
    created: Date.now(),
    modified: Date.now(),
  },
  "starmap.txt": {
    id: "starmap.txt",
    name: "starmap.txt",
    type: "text",
    parent: "documents",
    content: "STAR MAP DATABASE\n================\nProxima Centauri: 4.24 light years\nAlpha Centauri A: 4.37 light years\nBarnard's Star: 5.96 light years",
    size: 127,
    created: Date.now(),
    modified: Date.now(),
  },
  "captain_log.txt": {
    id: "captain_log.txt",
    name: "captain_log.txt",
    type: "text",
    parent: "documents",
    content: "Captain's Personal Log\n======================\nDay 1: Set course for unexplored regions.\nDay 2: Encountered ion storm, shields held.\nDay 3: Detected mysterious signal from nearby star system.",
    size: 204,
    created: Date.now(),
    modified: Date.now(),
  },
  "notes.txt": {
    id: "notes.txt",
    name: "notes.txt",
    type: "text",
    parent: "documents",
    content: "To-Do List:\n- Calibrate sensors\n- Review stellar cartography data\n- Plan next jump coordinates\n- Conduct crew briefing",
    size: 98,
    created: Date.now(),
    modified: Date.now(),
  },
  "beacon_signal.mp4": {
    id: "beacon_signal.mp4",
    name: "beacon_signal.mp4",
    type: "video",
    parent: "downloads",
    size: 2_456_789,
    created: Date.now(),
    modified: Date.now(),
    content: sampleVideo,
  },
  "mission_photo.png": {
    id: "mission_photo.png",
    name: "mission_photo.png",
    type: "image",
    parent: "images",
    size: 154321,
    created: Date.now(),
    modified: Date.now(),
    content: sampleImage,
  },
  "nebula_landscape.jpg": {
    id: "nebula_landscape.jpg",
    name: "nebula_landscape.jpg",
    type: "image",
    parent: "images",
    size: 234567,
    created: Date.now(),
    modified: Date.now(),
    content: sampleImage,
  },
  "crew_portrait.jpg": {
    id: "crew_portrait.jpg",
    name: "crew_portrait.jpg",
    type: "image",
    parent: "images",
    size: 178234,
    created: Date.now(),
    modified: Date.now(),
    content: sampleImage,
  },
  "launch_clip.mp4": {
    id: "launch_clip.mp4",
    name: "launch_clip.mp4",
    type: "video",
    parent: "videos",
    size: 1_234_567,
    created: Date.now(),
    modified: Date.now(),
    content: sampleVideo,
  },
  "warp_drive_test.mp4": {
    id: "warp_drive_test.mp4",
    name: "warp_drive_test.mp4",
    type: "video",
    parent: "videos",
    size: 3_456_789,
    created: Date.now(),
    modified: Date.now(),
    content: sampleVideo,
  },
};

const DEFAULT_NETWORK = {
  online: true,
  provider: "AuraNet Relay",
  signal: 4,
  ip: "192.168.0.12",
  gateway: "192.168.0.1",
  dns: "8.8.8.8",
};

function getStoredOrDefault(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function SystemProvider({ children }) {
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem("aura-wallpaper") || "default";
  });
  const [timeZone, setTimeZone] = useState(() => {
    return localStorage.getItem("aura-timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  });
  const [is24Hour, setIs24Hour] = useState(() => {
    return localStorage.getItem("aura-time-format") === "24";
  });
  const [network, setNetwork] = useState(() => getStoredOrDefault("aura-network", DEFAULT_NETWORK));
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem("aura_vfs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    return DEFAULT_DISK_IMAGE;
  });
  
  // Clock Management
  const [clockMode, setClockMode] = useState(() => {
    return localStorage.getItem("aura-clock-mode") || "realtime"; // "realtime" or "manual"
  });
  const [manualTime, setManualTime] = useState(() => {
    const saved = localStorage.getItem("aura-manual-time");
    return saved ? new Date(JSON.parse(saved)) : new Date();
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock based on mode
  useEffect(() => {
    const interval = setInterval(() => {
      if (clockMode === "realtime") {
        setCurrentTime(new Date());
      } else if (clockMode === "manual") {
        // Increment manual time by 1 second
        setManualTime(prev => {
          const next = new Date(prev.getTime() + 1000);
          return next;
        });
        setCurrentTime(manualTime);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [clockMode, manualTime]);

  // Save manual time to localStorage
  useEffect(() => {
    if (clockMode === "manual") {
      localStorage.setItem("aura-manual-time", JSON.stringify(manualTime));
    }
  }, [manualTime, clockMode]);

  useEffect(() => {
    localStorage.setItem("aura-clock-mode", clockMode);
  }, [clockMode]);

  // Stardate calculation: Stardate = Year (2460-2480) * 1000 + Day of Year
  const calculateStardate = useMemo(() => {
    const baseYear = 2460;
    const year = currentTime.getFullYear();
    const yearOffset = Math.min(Math.max(year - 2020, 0), 20);
    const dayOfYear = Math.floor((currentTime - new Date(currentTime.getFullYear(), 0, 0)) / 86400000);
    return `${baseYear + yearOffset}.${(dayOfYear * 10 / 365).toFixed(1)}`;
  }, [currentTime]);

  useEffect(() => {
    localStorage.setItem("aura-wallpaper", wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem("aura-timezone", timeZone);
  }, [timeZone]);

  useEffect(() => {
    localStorage.setItem("aura-time-format", is24Hour ? "24" : "12");
  }, [is24Hour]);

  useEffect(() => {
    localStorage.setItem("aura-network", JSON.stringify(network));
  }, [network]);

  useEffect(() => {
    localStorage.setItem("aura_vfs", JSON.stringify(fileSystem));
  }, [fileSystem]);

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hour,
      timeZone,
    }).format(currentTime);
  }, [currentTime, is24Hour, timeZone]);

  const formattedTimeShort = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !is24Hour,
      timeZone,
    }).format(currentTime);
  }, [currentTime, is24Hour, timeZone]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone,
    }).format(currentTime);
  }, [currentTime, timeZone]);

  const value = {
    wallpaper,
    setWallpaper,
    timeZone,
    setTimeZone,
    is24Hour,
    setIs24Hour,
    network,
    setNetwork,
    formattedTime,
    formattedTimeShort,
    formattedDate,
    currentTime,
    fileSystem,
    setFileSystem,
    clockMode,
    setClockMode,
    manualTime,
    setManualTime,
    calculateStardate,
  };

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export { SystemContext, SystemProvider };
