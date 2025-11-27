// src/hooks/useTimer.ts
import { useState, useEffect, useCallback } from "react";
import type { Mode, Settings } from "../types";

const MODE_LABELS: Record<Mode, string> = {
  pomodoro: "Time to focus!",
  shortBreak: "Time for a break!",
  longBreak: "Time for a break!",
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateFavicon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="${color}" />
      <polyline points="16,8 16,16 22,16" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" />
    </svg>
  `;

  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }

  favicon.href = dataUrl;
}

export function useTimer(settings: Settings) {
  // Get times from settings (convert minutes to seconds)
  const getTimeForMode = useCallback((mode: Mode): number => {
    switch (mode) {
      case "pomodoro":
        return settings.pomodoroTime * 60;
      case "shortBreak":
        return settings.shortBreakTime * 60;
      case "longBreak":
        return settings.longBreakTime * 60;
    }
  }, [settings.pomodoroTime, settings.shortBreakTime, settings.longBreakTime]);

  const [mode, setMode] = useState<Mode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(getTimeForMode("pomodoro"));
  const [isRunning, setIsRunning] = useState(false);

//   // Update time when settings change
//   useEffect(() => {
//   if (!isRunning) {
//     const getTime = (m: Mode): number => {
//       switch (m) {
//         case "pomodoro":
//           return settings.pomodoroTime * 60;
//         case "shortBreak":
//           return settings.shortBreakTime * 60;
//         case "longBreak":
//           return settings.longBreakTime * 60;
//       }
//     };
//     setTimeLeft(getTime(mode));
//   }
// }, [settings.pomodoroTime, settings.shortBreakTime, settings.longBreakTime, mode, isRunning]);

  // Countdown effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          // TODO: Play alarm sound here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Update browser tab title
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${MODE_LABELS[mode]}`;
  }, [timeLeft, mode]);

  // Update favicon color based on theme
  useEffect(() => {
  const color = isRunning 
    ? (mode === "pomodoro" ? settings.pomodoroColor :
       mode === "shortBreak" ? settings.shortBreakColor :
       settings.longBreakColor)
    : "#888888";
  updateFavicon(color);
}, [mode, isRunning, settings.pomodoroColor, settings.shortBreakColor, settings.longBreakColor]);

  // const changeMode = useCallback((newMode: Mode) => {
  //   setMode(newMode);
  //   setTimeLeft(getTimeForMode(newMode));
  //   setIsRunning(false);
  // }, [getTimeForMode]);

  const changeMode = useCallback((newMode: Mode) => {
  setMode(newMode);
  const newTime = newMode === "pomodoro" ? settings.pomodoroTime * 60
    : newMode === "shortBreak" ? settings.shortBreakTime * 60
    : settings.longBreakTime * 60;
  setTimeLeft(newTime);
  setIsRunning(false);
}, [settings.pomodoroTime, settings.shortBreakTime, settings.longBreakTime]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(getTimeForMode(mode));
    setIsRunning(false);
  }, [mode, getTimeForMode]);

  return {
    mode,
    timeLeft,
    isRunning,
    changeMode,
    toggleTimer,
    resetTimer,
  };
}