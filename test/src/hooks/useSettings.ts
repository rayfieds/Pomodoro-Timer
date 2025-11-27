// src/hooks/useSettings.ts
import { useState, useEffect } from "react";
import type { Settings } from "../types";

const DEFAULT_SETTINGS: Settings = {
  // Timer
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,

  // Task
  autoCheckTasks: false,
  checkToBottom: true,

  // Sound
  alarmSound: "kitchen",
  alarmVolume: 50,
  alarmRepeat: 1,
  tickingSound: "none",
  tickingVolume: 50,

  // Theme - NEW
  pomodoroColor: "#ba4949",
  shortBreakColor: "#38858a",
  longBreakColor: "#397097",
  hourFormat: "24-hour",
  darkModeWhenRunning: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem("pomodoro-settings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
  }, [settings]);

  // Update a single setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Update multiple settings at once
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
}