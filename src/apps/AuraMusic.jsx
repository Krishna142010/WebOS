import { useState, useRef, useEffect, useCallback } from "react";

// Importing the assets you just uploaded
import song1 from "../assets/music/song1.mp3";
import song2 from "../assets/music/song2.mp3";
import song3 from "../assets/music/song3.mp3";
import cover1 from "../assets/cover/song1.jpeg";
import cover2 from "../assets/cover/song2.jpeg";
import cover3 from "../assets/cover/song3.webp";

const PLAYLIST = [
  { id: 1, title: "Deep Space Telemetry", artist: "Aura Systems", file: song1, cover: cover1 },
  { id: 2, title: "Orbital Mechanics", artist: "Aura Systems", file: song2, cover: cover2 },
  { id: 3, title: "Hyperspace Jump", artist: "Aura Systems", file: song3, cover: cover3 },
];

function AuraMusic() {
  const audioRef = useRef(null);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [visualizerBars, setVisualizerBars] = useState(Array(32).fill(10));

  const track = PLAYLIST[currentTrackIdx];

  // --- Audio Lifecycle Management ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(e => {
        console.warn("Autoplay blocked. Waiting for user interaction.", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIdx]);

  // --- Visualizer Animation ---
  useEffect(() => {
    if (!isPlaying) {
      setVisualizerBars(Array(32).fill(5)); // Flatline when paused
      return;
    }
    const interval = setInterval(() => {
      setVisualizerBars(Array.from({ length: 32 }, () => 10 + Math.random() * 50));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // --- Controls ---
  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = useCallback(() => {
    setCurrentTrackIdx((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentTrackIdx((prev) => (prev === 0 ? PLAYLIST.length - 1 : prev - 1));
  }, []);

  const handleTimeUpdate = (e) => setProgress(e.target.currentTime);
  const handleLoadedMetadata = (e) => setDuration(e.target.duration);

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={styles.container}>
      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* Top Header / Visualizer */}
      <div style={styles.header}>
        <div style={styles.visualizer}>
          {visualizerBars.map((height, i) => (
            <div key={i} style={{ ...styles.bar, height: `${height}px`, opacity: isPlaying ? 1 : 0.4 }} />
          ))}
        </div>
      </div>

      {/* Main Track Info */}
      <div style={styles.nowPlaying}>
        <div style={styles.albumArtContainer}>
          <img 
            src={track.cover} 
            alt={track.title} 
            style={{ ...styles.albumArt, transform: isPlaying ? "scale(1.02)" : "scale(1)" }} 
          />
        </div>
        <div style={styles.trackDetails}>
          <h2 style={styles.title}>{track.title}</h2>
          <p style={styles.artist}>{track.artist}</p>
        </div>
      </div>

      {/* Scrubber & Timers */}
      <div style={styles.scrubberContainer}>
        <span style={styles.timeText}>{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          style={styles.scrubber}
        />
        <span style={styles.timeText}>{formatTime(duration)}</span>
      </div>

      {/* Transport Controls */}
      <div style={styles.controls}>
        <button style={styles.iconBtn} onClick={handlePrev}>⏮</button>
        <button style={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button style={styles.iconBtn} onClick={handleNext}>⏭</button>
      </div>

      {/* Volume Control */}
      <div style={styles.volumeContainer}>
        <span style={{ fontSize: "12px" }}>🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          style={styles.volumeSlider}
        />
      </div>
    </div>
  );
}

// Inline styles for high-fidelity web-desktop appearance
const styles = {
  container: { display: "flex", flexDirection: "column", height: "100%", background: "rgba(10, 12, 16, 0.95)", color: "#e8eef8", padding: "20px", fontFamily: '"Inter", sans-serif', boxSizing: "border-box", userSelect: "none" },
  header: { flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", minHeight: "60px", marginBottom: "20px" },
  visualizer: { display: "flex", gap: "3px", alignItems: "flex-end", height: "60px" },
  bar: { width: "6px", backgroundColor: "#6366F1", borderRadius: "3px", transition: "height 0.1s ease" },
  nowPlaying: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" },
  albumArtContainer: { width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" },
  albumArt: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" },
  trackDetails: { flex: 1, overflow: "hidden" },
  title: { margin: "0 0 6px 0", fontSize: "18px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  artist: { margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.6)" },
  scrubberContainer: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  scrubber: { flex: 1, cursor: "pointer", accentColor: "#6366F1" },
  timeText: { fontSize: "11px", color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums", width: "32px", textAlign: "center" },
  controls: { display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", marginBottom: "24px" },
  iconBtn: { background: "none", border: "none", color: "#e8eef8", fontSize: "20px", cursor: "pointer", opacity: 0.8, transition: "opacity 0.2s" },
  playBtn: { width: "48px", height: "48px", borderRadius: "50%", background: "#6366F1", color: "#fff", border: "none", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" },
  volumeContainer: { display: "flex", alignItems: "center", gap: "10px", marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" },
  volumeSlider: { flex: 1, cursor: "pointer", accentColor: "#e8eef8" }
};

export default AuraMusic;