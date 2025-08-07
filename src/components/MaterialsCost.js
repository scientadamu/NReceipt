// src/components/MaterialsCost.js
import React, { useState } from "react";

const MaterialsCost = ({ prices }) => {
  const containerMudus = 30; // 1 container = 30 mudus

  const [inputMode, setInputMode] = useState("bag");
  const [bagType, setBagType] = useState("local");
  const [mudus, setMudus] = useState(60);
  const [customMudus, setCustomMudus] = useState(60);

  // ✅ Default ratios
  const defaultRatios = {
    Pepper: 10, // mudus ÷ 10
    Ginja: 30,  // mudus ÷ 30
    Salt: 15,   // mudus ÷ 15
    Sugar: 3.25, // (mudus/30) * 3.25
    Onions: 1,  // (mudus/30) * 1
    Lather: 2,  // (mudus/30) * 2
    Gas: 4 / 3, // (mudus/30) * (4/3)
    Sack: 1     // (mudus/30) * 1
  };

  const [ratios, setRatios] = useState({ ...defaultRatios });

  // ✅ Reset to default ratios
  const resetRatios = () => {
    setRatios({ ...defaultRatios });
  };

  const handleRatioChange = (item, value) => {
    setRatios((prev) => ({ ...prev, [item]: Number(value) }));
  };

  const handleBagChange = (e) => {
    const selected = e.target.value;
    setBagType(selected);

    if (selected === "local") setMudus(60);
    else if (selected === "yawuri") setMudus(90);
    else if (selected === "others") setMudus(customMudus);
  };

  const handleCustomMudus = (e) => {
    const value = Number(e.target.value);
    setCustomMudus(value);
    if (bagType === "others") setMudus(value);
  };

  const handleMuduInput = (e) => {
    setMudus(Number(e.target.value));
  };

  // ✅ Calculate materials based on formulas
  const scaledQuantities = {
    Groundnut: mudus,
    Pepper: mudus / ratios.Pepper,
    Ginja: mudus / ratios.Ginja,
    Salt: mudus / ratios.Salt,
    Sugar: (mudus / 30) * ratios.Sugar,
    Onions: (mudus / 30) * ratios.Onions,
    Lather: (mudus / 30) * ratios.Lather,
    Gas: (mudus / 30) * ratios.Gas,
    Sack: (mudus / 30) * ratios.Sack,
  };

  // ✅ Calculate container count
  const containerCount = mudus / containerMudus;

  // ✅ Total cost calculation
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

      {/* Bag Selection */}
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

      {/* Direct Mudus Input */}
      {inputMode === "mudu" && (
        <div className="mb-4">
          <label className="font-semibold">Enter Mudus: </label>
          <input
            type="number"
            value={mudus}
            min={10}
            onChange={handleMuduInput}
            className="border p-2 ml-2"
          />
        </div>
      )}

      {/* Editable Ratios */}
      <h4 className="mt-4 font-semibold text-blue-600">Adjust Material Ratios</h4>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.keys(ratios).map((item) => (
          <div key={item} className="flex items-center">
            <label className="w-24">{item}:</label>
            <input
              type="number"
              value={ratios[item]}
              onChange={(e) => handleRatioChange(item, e.target.value)}
              className="border p-2 w-24 ml-2"
            />
          </div>
        ))}
      </div>
      <button
        onClick={resetRatios}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Reset to Default
      </button>

      {/* Results */}
      <p><strong>Mudus Entered:</strong> {mudus}</p>
      <p><strong>Containers (30 mudus each):</strong> {containerCount.toFixed(2)}</p>
      <p><strong>Cost per Mudu:</strong> ₦{costPerMudu.toLocaleString()}</p>
      <p><strong>Cost per Container (30 mudus):</strong> ₦{costPerContainer.toLocaleString()}</p>
      <p><strong>Total Cost:</strong> ₦{totalCost.toLocaleString()}</p>

      {/* Materials Required */}
      <h4 className="mt-6 font-semibold text-green-600">
        Materials Required for {mudus} Mudus of Groundnut
      </h4>
      <table className="w-full border mt-2 mb-6">
        <thead>
          <tr className="bg-green-100">
            <th className="border p-2">Item</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Unit</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scaledQuantities).map(([item, qty]) => (
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
