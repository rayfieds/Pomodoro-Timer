// src/pages/Home.tsx
import { ModeSelector } from "../components/ModeSelector";
import { Timer } from "../components/Timer";
import { TaskList } from "../components/TaskList";

interface TimerState {
  mode: "pomodoro" | "shortBreak" | "longBreak";
  timeLeft: number;
  isRunning: boolean;
  changeMode: (mode: "pomodoro" | "shortBreak" | "longBreak") => void;
  toggleTimer: () => void;
  resetTimer: () => void;
}

interface HomeProps {
  timer: TimerState;
}

export function Home({ timer }: HomeProps) {
  const { mode, timeLeft, isRunning, changeMode, toggleTimer, resetTimer } = timer;

  return (
    <div className="page">
      <ModeSelector currentMode={mode} onModeChange={changeMode} />
      
      <div className="timer-container">
        <Timer
          timeLeft={timeLeft}
          isRunning={isRunning}
          onToggle={toggleTimer}
          onReset={resetTimer}
        />
      </div>

      {/* <div className="status">
        <span className="pomodoro-count">#1</span>
        <p>Time to focus!</p>
      </div> */}

      <TaskList />
    </div>
  );
}