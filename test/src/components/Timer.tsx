// src/components/Timer.tsx
interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  currentColor: string;
}

// Helper function to format seconds as MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function Timer({ timeLeft, isRunning, onToggle, onReset, currentColor }: TimerProps) {
  return (
    <div className="timer">
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-buttons">
        <button className="timer-button" onClick={onToggle} style= {{color:currentColor}}>
            {isRunning ? "PAUSE" : "START"}
        </button>
        {isRunning && (
            <button className="reset-button" onClick={onReset}>
                ⏭
            </button>
        )}
    </div>
    </div>
  );
}