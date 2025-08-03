// src/components/Header.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

function Header({ attendantName }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("attendant");
    navigate("/");
  };

  return (
    <header className="pos-header">
      <div className="header-left">
        <h2 className="brand-name">Shukurullah Nig. Ltd</h2>
        <span className="attendant-name">Attendant: {attendantName}</span>
      </div>

      {/* Desktop Navigation */}
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <button onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>Dashboard</button>
        <button onClick={() => { navigate("/pos"); setMenuOpen(false); }}>POS</button>
        <button onClick={() => { navigate("/manage-products"); setMenuOpen(false); }}>Products</button>
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
