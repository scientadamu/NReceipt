import React, { useState, useEffect } from "react";
import "./ProductionCocs.css";

const BAG_SIZES = { local: 60, yawuri: 90 };

const ProductionCost = ({ onSetView }) => {
  const [unitType, setUnitType] = useState("mudu");
  const [quantity, setQuantity] = useState("");
  const [prices, setPrices] = useState({});
  const [labourCost, setLabourCost] = useState(0);
  const [processingCost, setProcessingCost] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedPrices = JSON.parse(localStorage.getItem("rawMaterialPrices")) || {};
    const savedLabour = JSON.parse(localStorage.getItem("labourCost")) || 0;
    const savedProcessing = JSON.parse(localStorage.getItem("processingCost")) || 0;

    setPrices(savedPrices);
    setLabourCost(savedLabour);
    setProcessingCost(savedProcessing);
  }, []);

  const calculateCost = () => {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert("❌ Please enter a valid quantity.");
      return;
    }

    // Convert to mudus if unit is bag
    const mudus = unitType === "bag" ? qty * BAG_SIZES.local : qty;

    if (mudus < 20) {
      alert("❌ Minimum production is 20 mudus.");
      return;
    }

    const containerCount = Math.ceil(mudus / 20);

    // ✅ Calculate raw materials dynamically
    const materials = [
      { name: "Groundnut", qty: mudus, price: prices.Groundnut?.price || 0 },
      { name: "Pepper", qty: containerCount * 2, price: prices.Pepper?.price || 0 },
      { name: "Ginja", qty: containerCount * 1, price: prices.Ginja?.price || 0 },
      { name: "Salt", qty: containerCount * 2, price: prices.Salt?.price || 0 },
      { name: "Sugar", qty: containerCount * 2, price: prices.Sugar?.price || 0 },
      { name: "Onions", qty: containerCount * 1, price: prices.Onions?.price || 0 },
      { name: "Lather", qty: containerCount * 2, price: prices.Lather?.price || 0 },
      { name: "Gas", qty: (containerCount * 4) / 3, price: prices.Gas?.price || 0 },
      { name: "Sack", qty: containerCount * 1, price: prices.Sack?.price || 0 },
    ];

    const rawMaterialCost = materials.map((item) => ({
      ...item,
      total: item.qty * item.price,
    }));

    const totalRawCost = rawMaterialCost.reduce((sum, i) => sum + i.total, 0);
    const grandTotal = totalRawCost + labourCost + processingCost;

    setResult({
      mudus,
      containerCount,
      rawMaterialCost,
      totalRawCost,
      totalLabour: labourCost,
      totalProcessing: processingCost,
      grandTotal,
    });
  };

  return (
    <div className="production-cost">
      <div className="input-group">
        <label>Enter Production Quantity:</label>
        <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
          <option value="mudu">Mudus</option>
          <option value="bag">Bags (Local)</option>
        </select>
        <input
          type="number"
          placeholder={`Enter number of ${unitType}`}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={calculateCost}>Calculate Cost</button>
      </div>

      {/* Raw Material Section */}
      <div className="cost-section">
        <h3>📦 Raw Material Cost</h3>
        {!Object.keys(prices).length ? (
          <p className="warning">
            ⚠ Please set raw material prices first!{" "}
            <button className="link-btn" onClick={() => onSetView("raw-material")}>
              Go to Raw Material Setup
            </button>
          </p>
        ) : result && (
          <div className="cost-responsive">
            {/* Desktop Table */}
            <table className="desktop-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price (₦)</th>
                  <th>Total (₦)</th>
                </tr>
              </thead>
              <tbody>
                {result.rawMaterialCost.map(({ name, qty, price, total }) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{qty}</td>
                    <td>₦{price.toLocaleString()}</td>
                    <td>₦{total.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan="3">Total Raw Material</td>
                  <td>₦{result.totalRawCost.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="mobile-cards">
              {result.rawMaterialCost.map(({ name, qty, price, total }) => (
                <div key={name} className="cost-card">
                  <h4>{name}</h4>
                  <p><strong>Qty:</strong> {qty}</p>
                  <p><strong>Unit Price:</strong> ₦{price.toLocaleString()}</p>
                  <p className="total"><strong>Total:</strong> ₦{total.toLocaleString()}</p>
                </div>
              ))}
              <div className="cost-card total-summary">
                <h4>Total Raw Material</h4>
                <p>₦{result.totalRawCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Labour Section */}
      <div className="cost-section">
        <h3>👨‍🔧 Labour Cost</h3>
        {!labourCost ? (
          <p className="warning">
            ⚠ Please set labour cost!{" "}
            <button className="link-btn" onClick={() => onSetView("labour-cost")}>
              Go to Labour Setup
            </button>
          </p>
        ) : (
          <p>Total Labour Cost: ₦{labourCost.toLocaleString()}</p>
        )}
      </div>

      {/* Processing Section */}
      <div className="cost-section">
        <h3>⚙ Processing Cost</h3>
        {!processingCost ? (
          <p className="warning">⚠ Please set processing cost!</p>
        ) : (
          <p>Total Processing Cost: ₦{processingCost.toLocaleString()}</p>
        )}
      </div>

      {/* Grand Total */}
      {result && (
        <div className="cost-summary">
          <h3>💰 Grand Total: ₦{result.grandTotal.toLocaleString()}</h3>
          <p>
            For <strong>{result.mudus}</strong> mudus (
            <strong>{result.containerCount}</strong> containers).
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductionCost;
