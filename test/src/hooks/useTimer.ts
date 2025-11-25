// src/hooks/useTimer.ts
import { useState, useEffect, useCallback } from "react";

type Mode = "pomodoro" | "shortBreak" | "longBreak";

// Time in seconds for each mode
const MODE_TIMES: Record<Mode, number> = {
  pomodoro: 25 * 60,     // 25 minutes
  shortBreak: 5 * 60,    // 5 minutes
  longBreak: 15 * 60,    // 15 minutes
};

const MODE_LABELS: Record<Mode, string> = {
  pomodoro: "Time to focus!",
  shortBreak: "Time for a break!",
  longBreak: "Time for a break!",
};

const MODE_COLORS: Record<Mode, string> = {
  pomodoro: "#ba4949",
  shortBreak: "#38858a",
  longBreak: "#397097",
};

// Helper to format seconds as MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateFavicon(color: string) {
  // Create an SVG circle icon
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="${color}" />
      <polyline points="16,8 16,16 22,16" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" />
    </svg>
  `;
  
  // Convert to data URL
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  
  // Find or create favicon link
  let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  
  favicon.href = dataUrl;
}

export function useTimer() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES[mode]);
  const [isRunning, setIsRunning] = useState(false);

  // Countdown effect - runs every second when timer is active
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup: clear interval when component unmounts or isRunning changes
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${MODE_LABELS[mode]}`;
  }, [timeLeft, mode]);

  useEffect(() => {
    const color = isRunning ? MODE_COLORS[mode] : "#888888";
    updateFavicon(color);
  }, [mode, isRunning]);

  // Reset timer when mode changes
  const changeMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
    setIsRunning(false);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(MODE_TIMES[mode]);
    setIsRunning(false);
  }, [mode]);

  return {
    mode,
    timeLeft,
    isRunning,
    changeMode,
    toggleTimer,
    resetTimer,
  };
}