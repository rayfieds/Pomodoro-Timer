// src/pages/Settings.tsx
import type { Settings as SettingsType, AlarmSound, TickingSound, HourFormat } from "../types";

interface SettingsProps {
  settings: SettingsType;
  updateSetting: <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => void;
  resetSettings: () => void;
}

export function Settings({ settings, updateSetting, resetSettings }: SettingsProps) {
  return (
    <div className="page">
      <div className="settings-container">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="reset-btn" onClick={resetSettings}>Reset</button>
        </div>

        {/* Timer Section */}
        <section className="settings-section">
          <h3>⏱️ Timer</h3>
          
          <div className="setting-group">
            <label>Time (minutes)</label>
            <div className="time-inputs">
              <div className="time-input">
                <span>Pomodoro</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoroTime}
                  onChange={(e) => updateSetting("pomodoroTime", Number(e.target.value))}
                />
              </div>
              <div className="time-input">
                <span>Short Break</span>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakTime}
                  onChange={(e) => updateSetting("shortBreakTime", Number(e.target.value))}
                />
              </div>
              <div className="time-input">
                <span>Long Break</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakTime}
                  onChange={(e) => updateSetting("longBreakTime", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="setting-row">
            <label>Auto Start Breaks</label>
            <Toggle
              checked={settings.autoStartBreaks}
              onChange={(checked) => updateSetting("autoStartBreaks", checked)}
            />
          </div>

          <div className="setting-row">
            <label>Auto Start Pomodoros</label>
            <Toggle
              checked={settings.autoStartPomodoros}
              onChange={(checked) => updateSetting("autoStartPomodoros", checked)}
            />
          </div>

          <div className="setting-row">
            <label>Long Break Interval</label>
            <input
              type="number"
              min="1"
              max="10"
              className="small-input"
              value={settings.longBreakInterval}
              onChange={(e) => updateSetting("longBreakInterval", Number(e.target.value))}
            />
          </div>
        </section>

        {/* Task Section */}
        <section className="settings-section">
          <h3>✅ Task</h3>

          <div className="setting-row">
            <label>Auto Check Tasks</label>
            <Toggle
              checked={settings.autoCheckTasks}
              onChange={(checked) => updateSetting("autoCheckTasks", checked)}
            />
          </div>

          <div className="setting-row">
            <label>Move Checked to Bottom</label>
            <Toggle
              checked={settings.checkToBottom}
              onChange={(checked) => updateSetting("checkToBottom", checked)}
            />
          </div>
        </section>

        {/* Sound Section */}
        <section className="settings-section">
          <h3>🔔 Sound</h3>

          <div className="setting-row">
            <label>Alarm Sound</label>
            <select
              value={settings.alarmSound}
              onChange={(e) => updateSetting("alarmSound", e.target.value as AlarmSound)}
            >
              <option value="kitchen">Kitchen</option>
              <option value="bell">Bell</option>
              <option value="digital">Digital</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="setting-row">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.alarmVolume}
              onChange={(e) => updateSetting("alarmVolume", Number(e.target.value))}
            />
          </div>

          <div className="setting-row">
            <label>Repeat</label>
            <input
              type="number"
              min="1"
              max="10"
              className="small-input"
              value={settings.alarmRepeat}
              onChange={(e) => updateSetting("alarmRepeat", Number(e.target.value))}
            />
          </div>

          <div className="setting-row">
            <label>Ticking Sound</label>
            <select
              value={settings.tickingSound}
              onChange={(e) => updateSetting("tickingSound", e.target.value as TickingSound)}
            >
              <option value="none">None</option>
              <option value="ticking">Ticking</option>
            </select>
          </div>

          <div className="setting-row">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.tickingVolume}
              onChange={(e) => updateSetting("tickingVolume", Number(e.target.value))}
            />
          </div>
        </section>

        {/* Theme Section */}
        <section className="settings-section">
        <h3>🎨 Theme</h3>

        <div className="setting-group">
            <label>Color Themes</label>
            <div className="color-picker-group">
            <div className="color-picker-item">
                <span>Pomodoro</span>
                <input
                type="color"
                value={settings.pomodoroColor}
                onChange={(e) => updateSetting("pomodoroColor", e.target.value)}
                />
            </div>
            <div className="color-picker-item">
                <span>Short Break</span>
                <input
                type="color"
                value={settings.shortBreakColor}
                onChange={(e) => updateSetting("shortBreakColor", e.target.value)}
                />
            </div>
            <div className="color-picker-item">
                <span>Long Break</span>
                <input
                type="color"
                value={settings.longBreakColor}
                onChange={(e) => updateSetting("longBreakColor", e.target.value)}
                />
            </div>
            </div>
        </div>

        <div className="setting-row">
            <label>Hour Format</label>
            <select
            value={settings.hourFormat}
            onChange={(e) => updateSetting("hourFormat", e.target.value as HourFormat)}
            >
            <option value="24-hour">24-hour</option>
            <option value="12-hour">12-hour</option>
            </select>
        </div>

        <div className="setting-row">
            <label>Dark Mode when Running</label>
            <Toggle
            checked={settings.darkModeWhenRunning}
            onChange={(checked) => updateSetting("darkModeWhenRunning", checked)}
            />
        </div>
        </section>
      </div>
    </div>
  );
}

// Toggle component (used within Settings)
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      className={`toggle ${checked ? "active" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-slider" />
    </button>
  );
}