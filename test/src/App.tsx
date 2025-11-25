// src/App.tsx
import { useTimer } from "./hooks/useTimer";
import { ModeSelector } from "./components/ModeSelector";
import { Timer } from "./components/Timer";
import { TaskList } from "./components/TaskList";
import "./App.css";

function App() {
  const { mode, timeLeft, isRunning, changeMode, toggleTimer, resetTimer } = useTimer();

  return (
    <div className={`app ${mode}`}>
      <div className="container">
        <h1>Pomodoro Timer</h1>
        <ModeSelector currentMode={mode} onModeChange={changeMode} />
        <Timer timeLeft={timeLeft} isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />
        <TaskList />
      </div>
    </div>
  );
}

export default App;