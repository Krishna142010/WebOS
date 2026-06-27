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
    children: ["readme.txt"],
  },
  documents: {
    id: "documents",
    name: "Documents",
    type: "folder",
    parent: "root",
    children: [],
  },
  downloads: {
    id: "downloads",
    name: "Downloads",
    type: "folder",
    parent: "root",
    children: [],
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
    children: ["mission_photo.png"],
  },
  videos: {
    id: "videos",
    name: "Media",
    type: "folder",
    parent: "root",
    children: ["launch_clip.mp4"],
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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
  };

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export { SystemContext, SystemProvider };
