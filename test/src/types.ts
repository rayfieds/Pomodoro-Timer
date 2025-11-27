// src/types.ts

// Timer modes
export type Mode = "pomodoro" | "shortBreak" | "longBreak";

// Color theme options
export type ColorTheme = "red" | "teal" | "purple" | "blue";

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
  pomodoroTime: number;      // in minutes
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
  alarmVolume: number;       // 0-100
  alarmRepeat: number;
  tickingSound: TickingSound;
  tickingVolume: number;     // 0-100

  // Theme
  colorTheme: ColorTheme;
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