// src/pages/Home.tsx
import { ModeSelector } from "../components/ModeSelector";
import { Timer } from "../components/Timer";
import { TaskList } from "../components/TaskList";
import type { TimerState, Settings } from "../types";

interface HomeProps {
  timer: TimerState;
  settings: Settings;
}

export function Home({ timer , settings}: HomeProps) {
  const { mode, timeLeft, isRunning, changeMode, toggleTimer, resetTimer } = timer;

  const currentColor = 
    mode === "pomodoro" ? settings.pomodoroColor :
    mode === "shortBreak" ? settings.shortBreakColor :
    settings.longBreakColor;

  return (
    <div className="page">
      <ModeSelector currentMode={mode} onModeChange={changeMode} />

      <div className="timer-container">
        <Timer
          timeLeft={timeLeft}
          isRunning={isRunning}
          onToggle={toggleTimer}
          onReset={resetTimer}
          currentColor={currentColor}
        />
      </div>

      <TaskList/>
    </div>
  );
}