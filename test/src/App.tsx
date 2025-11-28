// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTimer } from "./hooks/useTimer";
import { useSettings } from "./hooks/useSettings";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Login } from './pages/Login'

import "./App.css";

function App() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const timer = useTimer(settings);

  // Determine current background color based on mode
  const backgroundColor = 
    timer.mode === "pomodoro" ? settings.pomodoroColor :
    timer.mode === "shortBreak" ? settings.shortBreakColor :
    settings.longBreakColor;

  return (
    <BrowserRouter>
      <div className="app" style={{ backgroundColor }}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home timer={timer} settings={settings} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/settings"
              element={
                <Settings
                  settings={settings}
                  updateSetting={updateSetting}
                  resetSettings={resetSettings}
                />
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;