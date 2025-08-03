// src/pages/Stock.js
import React, { useState, useEffect } from "react";
import "./Stock.css";

export default function Stock() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("productsData");
    if (saved) {
      setCategories(JSON.parse(saved));
    }
  }, []);

  const totalValue = categories.reduce(
    (sum, cat) =>
      sum +
      cat.products.reduce((pSum, p) => pSum + p.price * p.stock, 0),
    0
  );

  return (
    <div className="stock-container">
      <h2>📦 Stock Report</h2>
      <h4>Total Inventory Value: ₦{totalValue.toLocaleString()}</h4>

      {categories.map((cat) => (
        <div key={cat.title} className="stock-category">
          <h3>{cat.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {cat.products.map((p) => (
                <tr key={p.id} className={p.stock === 0 ? "out-of-stock" : ""}>
                  <td>{p.name}</td>
                  <td>{p.stock}</td>
                  <td>₦{p.price.toLocaleString()}</td>
                  <td>₦{(p.stock * p.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
