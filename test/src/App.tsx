// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTimer } from "./hooks/useTimer";
import { useSettings } from "./hooks/useSettings";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import "./App.css";

function App() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const timer = useTimer(settings);

  return (
    <BrowserRouter>
      <div className={`app ${timer.mode}`} data-theme={settings.colorTheme}>
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;