// src/components/Header.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

function Header({ attendantName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("attendant");
    navigate("/login"); // ✅ Redirect to login after logout
  };

  const navigateTo = (path) => {
    if (location.pathname !== path) navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="pos-header">
      <div className="header-left">
        <h2 className="brand-name">Shukurullah Nig. Ltd</h2>
        <span className="attendant-name">Attendant: {attendantName}</span>
      </div>

      {/* Desktop Navigation */}
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <button 
          className={location.pathname === "/dashboard" ? "active" : ""} 
          onClick={() => navigateTo("/dashboard")}
        >
          Dashboard
        </button>
        <button 
          className={location.pathname === "/pos" ? "active" : ""} 
          onClick={() => navigateTo("/pos")}
        >
          POS
        </button>
        <button 
          className={location.pathname === "/manage-products" ? "active" : ""} 
          onClick={() => navigateTo("/manage-products")}
        >
          Products
        </button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
}

export default Header;
