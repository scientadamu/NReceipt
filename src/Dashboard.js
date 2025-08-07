import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import products from "./data/products"; // Adjust the path as needed

function Dashboard() {
  const navigate = useNavigate();
  const [attendantName, setAttendantName] = useState("Attendant");
  const [todaySales, setTodaySales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(products.length);

  useEffect(() => {
    try {
      const storedAttendant = localStorage.getItem("attendant");
      if (!storedAttendant) {
        navigate("/login");
        return;
      }
      const parsedAttendant = JSON.parse(storedAttendant);
      setAttendantName(parsedAttendant?.username || "Attendant");
    } catch {
      localStorage.removeItem("attendant");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    try {
      const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
      const today = new Date().toDateString();

      const sales = invoices
        .filter((inv) => new Date(inv.date).toDateString() === today)
        .reduce((sum, inv) => sum + inv.total, 0);

      setTodaySales(sales);
    } catch {
      setTodaySales(0);
      localStorage.removeItem("invoices");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("attendant");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {attendantName}</h2>

      {/* Info Cards */}
      <div className="info-cards">
        <div className="card">
          <h3>Today's Sales</h3>
          <p>₦{todaySales.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button onClick={() => navigate("/manage-sales")}>📊 Manage Sales</button>
        <button onClick={() => navigate("/manage-products")}>📦 Manage Products</button>
        <button onClick={() => navigate("/manage-materials")}>📋 Manage Materials</button>
        <button onClick={() => navigate("/kulikuli-production")}>🏭 Manage Production</button>
        <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
