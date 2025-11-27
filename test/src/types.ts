// src/types.ts

// Timer modes
export type Mode = "pomodoro" | "shortBreak" | "longBreak";

// Sound options
export type AlarmSound = "kitchen" | "bell" | "digital" | "none";
export type TickingSound = "ticking" | "none";

// Hour format
export type HourFormat = "12-hour" | "24-hour";

// Task type
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// All settings
export interface Settings {
  // Timer
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;

  // Task
  autoCheckTasks: boolean;
  checkToBottom: boolean;

  // Sound
  alarmSound: AlarmSound;
  alarmVolume: number;
  alarmRepeat: number;
  tickingSound: TickingSound;
  tickingVolume: number;

  // Theme - NEW: individual colors instead of preset themes
  pomodoroColor: string;
  shortBreakColor: string;
  longBreakColor: string;
  hourFormat: HourFormat;
  darkModeWhenRunning: boolean;
}

// What useTimer returns
export interface TimerState {
  mode: Mode;
  timeLeft: number;
  isRunning: boolean;
  changeMode: (mode: Mode) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
}