import React, { useState } from "react";
import { FaCog, FaUsersCog, FaFileInvoiceDollar, FaPlusCircle, FaBoxOpen, FaChartBar } from "react-icons/fa";
import "./KulikuliProduction.css";
import Header from "../components/Header";
import Parameter from "../components/Parameter";
import ProductionCost from "../components/ProductionCost";

const KulikuliProduction = () => {
  const [view, setView] = useState("dashboard");

  const stats = {
    todayProductions: 3,
    totalContainers: 12,
    pendingCosts: 2,
  };

  return (
    <div className="kulikuli-container">
      <Header />
      <h1 className="kulikuli-title">🍪 Kulikuli Production Dashboard</h1>

      {/* ✅ Quick Stats */}
      {view === "dashboard" && (
        <div className="stats-grid">
          <div className="stat-card">
            <FaBoxOpen className="stat-icon" />
            <div>
              <h4>Today's Productions</h4>
              <p>{stats.todayProductions}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaChartBar className="stat-icon" />
            <div>
              <h4>Total Containers</h4>
              <p>{stats.totalContainers}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaFileInvoiceDollar className="stat-icon" />
            <div>
              <h4>Pending Costs</h4>
              <p>{stats.pendingCosts}</p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Dashboard View */}
      {view === "dashboard" && (
        <div className="cards-grid">
          <div className="card" onClick={() => setView("raw-material")}>
            <FaCog size={40} className="card-icon" />
            <h3>Manage Raw Material Cost</h3>
            <p>View and update raw material prices.</p>
          </div>
          <div className="card" onClick={() => setView("labour-cost")}>
            <FaUsersCog size={40} className="card-icon" />
            <h3>Manage Labour Cost</h3>
            <p>Set and manage labour expenses.</p>
          </div>
          <div className="card" onClick={() => setView("production-cost")}>
            <FaFileInvoiceDollar size={40} className="card-icon" />
            <h3>Manage Production Cost</h3>
            <p>Analyze cost per container, mudu, or bag.</p>
          </div>
          <div className="card" onClick={() => setView("create-production")}>
            <FaPlusCircle size={40} className="card-icon" />
            <h3>Create Production</h3>
            <p>Start new batch production and track costs.</p>
          </div>
        </div>
      )}

      {/* 🔹 Manage Raw Material Cost */}
      {view === "raw-material" && (
        <div className="section">
          <h2>📦 Manage Raw Material Cost</h2>
          <p>Edit and save raw material prices used for Kulikuli production.</p>
          <Parameter />
          <button className="back-btn" onClick={() => setView("dashboard")}>⬅ Back</button>
        </div>
      )}

      {/* 🔹 Manage Labour Cost */}
      {view === "labour-cost" && (
        <div className="section">
          <h2>👨‍🔧 Manage Labour Cost</h2>
          <p>Set and save labour costs for production batches.</p>
          <p className="warning">⚠ Labour cost setup coming soon.</p>
          <button className="back-btn" onClick={() => setView("dashboard")}>⬅ Back</button>
        </div>
      )}

      {/* 🔹 Manage Production Cost */}
      {view === "production-cost" && (
        <div className="section">
          <h2>💰 Manage Production Cost</h2>
          <p>Enter groundnut quantity and calculate raw material, labour, and processing costs.</p>
          <ProductionCost onSetView={setView} />
          <button className="back-btn" onClick={() => setView("dashboard")}>⬅ Back</button>
        </div>
      )}

      {/* 🔹 Create Production */}
      {view === "create-production" && (
        <div className="section">
          <h2>⚙️ Create Production</h2>
          <p>Define batch size, calculate materials needed, and track production details.</p>
          <p className="warning">⚠ This feature is under development.</p>
          <button className="back-btn" onClick={() => setView("dashboard")}>⬅ Back</button>
        </div>
      )}
    </div>
  );
};

export default KulikuliProduction;
