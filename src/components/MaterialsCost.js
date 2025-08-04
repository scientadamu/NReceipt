// src/components/MaterialsCost.js
import React, { useState } from "react";

const MaterialsCost = ({ prices }) => {
  const containerMudus = 20;

  const [inputMode, setInputMode] = useState("bag"); // 'bag' or 'mudu'
  const [bagType, setBagType] = useState("local"); // 'local', 'yawuri', 'others'
  const [mudus, setMudus] = useState(60); // default local bag (60 mudus)
  const [customMudus, setCustomMudus] = useState(60);

  // Quantities per container (20 mudus)
  const perContainerQuantities = {
    Groundnut: 20,
    Pepper: 2,
    Ginja: 1,
    Salt: 2,
    Sugar: 2,
    Onions: 1,
    Lather: 2,
    Gas: 4 / 3, // 1.33 kg per container
    Sack: 1,
  };

  // Handle bag selection
  const handleBagChange = (e) => {
    const selected = e.target.value;
    setBagType(selected);

    if (selected === "local") setMudus(60);
    else if (selected === "yawuri") setMudus(90);
    else if (selected === "others") setMudus(customMudus);
  };

  // Handle custom mudus entry for "others"
  const handleCustomMudus = (e) => {
    const value = Number(e.target.value);
    setCustomMudus(value);
    if (bagType === "others") setMudus(value);
  };

  // Handle direct mudu input if mode is "mudu"
  const handleMuduInput = (e) => {
    setMudus(Number(e.target.value));
  };

  // Calculate number of containers
  const containerCount = mudus / containerMudus;

  // Scale quantities based on containers
  const scaledQuantities = Object.fromEntries(
    Object.entries(perContainerQuantities).map(([item, qty]) => [
      item,
      qty * containerCount,
    ])
  );

  // Calculate costs
  const totalCost = Object.entries(scaledQuantities).reduce(
    (sum, [item, qty]) => sum + qty * (prices[item]?.price || 0),
    0
  );

  const costPerMudu = totalCost / mudus;
  const costPerContainer = totalCost / containerCount;

  return (
    <div className="p-4 border rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-bold mb-3">Production Cost Analysis</h3>

      {/* Mode Selection */}
      <div className="mb-4">
        <label className="font-semibold mr-4">Select Input Mode:</label>
        <select
          value={inputMode}
          onChange={(e) => setInputMode(e.target.value)}
          className="border p-2"
        >
          <option value="bag">By Bag</option>
          <option value="mudu">By Mudus</option>
        </select>
      </div>

      {/* Bag Selection Mode */}
      {inputMode === "bag" && (
        <div className="mb-4">
          <label className="font-semibold mr-4">Select Bag Type:</label>
          <select
            value={bagType}
            onChange={handleBagChange}
            className="border p-2"
          >
            <option value="local">Local Bag (60 mudus)</option>
            <option value="yawuri">Yawuri Bag (90 mudus)</option>
            <option value="others">Others (Custom mudus)</option>
          </select>

          {bagType === "others" && (
            <input
              type="number"
              value={customMudus}
              min={20}
              onChange={handleCustomMudus}
              className="border p-2 ml-4"
              placeholder="Enter mudus"
            />
          )}
        </div>
      )}

      {/* Direct Mudus Input Mode */}
      {inputMode === "mudu" && (
        <div className="mb-4">
          <label className="font-semibold">Enter Mudus: </label>
          <input
            type="number"
            value={mudus}
            min={20}
            onChange={handleMuduInput}
            className="border p-2 ml-2"
          />
        </div>
      )}

      {/* Display Results */}
      <p><strong>Mudus Entered:</strong> {mudus}</p>
      <p><strong>Containers (20 mudus each):</strong> {containerCount}</p>
      <p><strong>Cost per Mudu:</strong> ₦{costPerMudu.toLocaleString()}</p>
      <p><strong>Cost per Container (20 mudus):</strong> ₦{costPerContainer.toLocaleString()}</p>
      <p><strong>Total Cost:</strong> ₦{totalCost.toLocaleString()}</p>

      {/* Live Preview: Materials per Container */}
      <h4 className="mt-6 font-semibold text-blue-600">Materials Required per Container (20 Mudus)</h4>
      <table className="w-full border mt-2 mb-6">
        <thead>
          <tr className="bg-blue-100">
            <th className="border p-2">Item</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Unit</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(perContainerQuantities).map(([item, qty]) => (
            <tr key={item}>
              <td className="border p-2">{item}</td>
              <td className="border p-2">{qty.toFixed(2)}</td>
              <td className="border p-2 italic">{prices[item]?.unit || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Full Cost Breakdown */}
      <h4 className="mt-4 font-semibold">Full Cost Breakdown</h4>
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item</th>
            <th className="border p-2">Total Quantity</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Unit Price (₦)</th>
            <th className="border p-2">Total (₦)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scaledQuantities).map(([item, qty]) => (
            <tr key={item}>
              <td className="border p-2">{item}</td>
              <td className="border p-2">{qty.toFixed(2)}</td>
              <td className="border p-2 italic">{prices[item]?.unit || "-"}</td>
              <td className="border p-2">
                ₦{prices[item]?.price?.toLocaleString() || 0}
              </td>
              <td className="border p-2">
                ₦{(qty * (prices[item]?.price || 0)).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsCost;
