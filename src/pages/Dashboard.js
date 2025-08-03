import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import products from "../data/products"; // Import product data

function Dashboard() {
  const navigate = useNavigate();
  const attendantData = JSON.parse(localStorage.getItem("attendant"));
  const attendantName = attendantData?.username || "Attendant";

  const [todaySales, setTodaySales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(products.length);

  // Calculate today's sales from invoices stored in localStorage
  useEffect(() => {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const today = new Date().toDateString();

    const sales = invoices
      .filter((inv) => new Date(inv.date).toDateString() === today)
      .reduce((sum, inv) => sum + inv.total, 0);

    setTodaySales(sales);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("attendant");
    navigate("/");
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

      {/* Buttons */}
      <div className="button-group">
        <button onClick={() => navigate("/pos")}>Go to POS</button>
        <button onClick={() => navigate("/manage-products")}>Manage Products</button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
