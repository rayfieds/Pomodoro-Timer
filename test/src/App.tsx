// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { useTimer } from "./hooks/useTimer";
import { useSettings } from "./hooks/useSettings";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Login } from './pages/Login'

import "./App.css";

function AppContent() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const timer = useTimer(settings);

  const backgroundColor = 
    timer.mode === "pomodoro" ? settings.pomodoroColor :
    timer.mode === "shortBreak" ? settings.shortBreakColor :
    settings.longBreakColor;

  return (
    <div className="app" style={{ backgroundColor }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;