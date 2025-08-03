import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./Dashboard.js";
import POS from "./pages/POS";
import ManageProducts from "./pages/ManageProducts";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POS />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-products"
        element={
          <ProtectedRoute>
            <ManageProducts />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
