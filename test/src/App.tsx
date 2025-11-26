// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { useTimer } from "./hooks/useTimer"
import "./App.css";

function App() {
  const timer = useTimer();
  
  return (
    <BrowserRouter>
      <div className={`app ${timer.mode}`}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home timer={timer} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;