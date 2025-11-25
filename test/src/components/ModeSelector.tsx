// src/components/ModeSelector.tsx
type Mode = "pomodoro" | "shortBreak" | "longBreak";

interface ModeSelectorProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes: { key: Mode; label: string }[] = [
    { key: "pomodoro", label: "Pomodoro" },
    { key: "shortBreak", label: "Short Break" },
    { key: "longBreak", label: "Long Break" },
  ];

  return (
    <div className="mode-selector">
      {modes.map(({ key, label }) => (
        <button
          key={key}
          className={`mode-button ${currentMode === key ? "active" : ""}`}
          onClick={() => onModeChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}