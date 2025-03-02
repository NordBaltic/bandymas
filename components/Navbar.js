import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* ✅ Logotipas */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo.svg" alt="NordBalticum" className="logo" />
        </Link>
      </div>

      {/* ✅ Meniu */}
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/stake" className={location.pathname === "/stake" ? "active" : ""}>
            Staking
          </Link>
        </li>
        <li>
          <Link to="/swap" className={location.pathname === "/swap" ? "active" : ""}>
            Swap
          </Link>
        </li>
        <li>
          <Link to="/donate" className={location.pathname === "/donate" ? "active" : ""}>
            Donations
          </Link>
        </li>
      </ul>

      {/* ✅ Prisijungimo ir Logout mygtukai */}
      <div className="auth-buttons">
        {!user ? (
          <>
            <Link to="/login" className="login-btn">Email Login</Link>
            <button className="wallet-login-btn">Wallet Login</button>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}
      </div>

      {/* ✅ Šviesi / Tamsi tema */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? "🌞" : "🌙"}
      </button>

      {/* ✅ Mobiliam meniu */}
      <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <img src="/menu-icon.svg" alt="Menu" />
      </button>
    </nav>
  );
}
