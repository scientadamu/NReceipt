import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./Dashboard.js";
import ManageSales from "./pages/ManageSales.js";
import ManageProducts from "./pages/ManageProducts";
import KulikuliProduction from "./pages/KulikuliProduction"; // ✅ Import added
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
        path="/manage-sales" // ✅ FIXED: Corrected path
        element={
          <ProtectedRoute>
            <ManageSales />
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
      <Route
        path="/kulikuli-production"
        element={
          <ProtectedRoute>
            <KulikuliProduction />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
