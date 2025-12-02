// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

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
          {user ? (
            <>
              <span className="nav-link user-email">{user.email}</span>
              <button onClick={logout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}