import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import ManageProducts from "./pages/ManageProducts";

function App() {
  const isLoggedIn = !!localStorage.getItem("attendant");

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/pos" element={isLoggedIn ? <POS /> : <Navigate to="/" />} />
      <Route path="/manage-products" element={isLoggedIn ? <ManageProducts /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
