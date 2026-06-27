import { useCallback } from "react";
import clickFile from "../assets/audio/click.wav";
import notificationFile from "../assets/audio/notification.mp3";

export function useSystemAudio() {
    const playSound = useCallback((type) => {
        try {
            const audio = new Audio(type === "click" ? clickFile : notificationFile);
            audio.volume = type === "click" ? 0.2 : 0.6;
            audio.play().catch((err) => console.warn("Audio play blocked by browser:", err));
        } catch (error) {
            console.error("Failed to play system sound", error);
        }
    }, []);

    return {
        playClick: () => playSound("click"),
        playNotification: () => playSound("notification"),
    };
}
