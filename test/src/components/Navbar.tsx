// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">౨ৎ Pomofocus</Link>
        <div className="nav-links">
          <Link 
            to="/analytics" 
            className={`nav-link ${location.pathname === "/analytics" ? "active" : ""}`}
          >
            📊 Analytics
          </Link>
          <Link 
            to="/settings" 
            className={`nav-link ${location.pathname === "/settings" ? "active" : ""}`}
          >
            ⚙️ Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}