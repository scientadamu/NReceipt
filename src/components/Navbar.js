// src/components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">🏪 Shukrullah Shop</div>
      <ul className="navbar-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">🏠 Home</Link>
        </li>
        <li className={location.pathname === "/manage-products" ? "active" : ""}>
          <Link to="/manage-products">📦 Manage Products</Link>
        </li>
        <li className={location.pathname === "/pos" ? "active" : ""}>
          <Link to="/pos">🛒 POS</Link>
        </li>
        <li className={location.pathname === "/stock" ? "active" : ""}>
          <Link to="/stock">📊 Stock</Link>
        </li>
      </ul>
    </nav>
  );
}
