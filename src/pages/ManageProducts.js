import React, { useEffect, useState, useRef } from "react";
import "./ManageProducts.css";
import data from "../data/productData.json";
import Header from "../components/Header"; // adjust the path if different
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaSave, FaSync } from "react-icons/fa";

const ACCESS_CODE = "23411";

const ManageProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stockHistory, setStockHistory] = useState(() => {
  const savedHistory = localStorage.getItem("stockHistory");
  return savedHistory ? JSON.parse(savedHistory) : [];
});
  const [activeTab, setActiveTab] = useState("categories");
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", image: "" });
  const [toast, setToast] = useState("");

  /** ✅ Access Code Modal */
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessDigits, setAccessDigits] = useState(["", "", "", "", ""]);
  const digitRefs = useRef([]);

  /** ✅ Pending action storage */
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingProductEdits, setPendingProductEdits] = useState({});
  const [pendingStockQty, setPendingStockQty] = useState({});

  const [showFullHistory, setShowFullHistory] = useState(false);

  // Load from localStorage or defaults
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("shopData"));
    if (savedData) {
      setCategories(savedData.categories || []);
      setProducts(savedData.products || []);
      setStocks(savedData.stocks || []);
    } else {
      resetAllData();
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    const shopData = { categories, products, stocks };
    localStorage.setItem("shopData", JSON.stringify(shopData));
  }, [categories, products, stocks]);
  useEffect(() => {
  localStorage.setItem("stockHistory", JSON.stringify(stockHistory));
}, [stockHistory]);

  /** ✅ Toast Notification */
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  /** ✅ Reset All Data */
const resetAllData = () => {
  const accessCode = prompt("🔐 Enter Access Code to reset all data:");
  if (accessCode !== "1234") {
    showToast("❌ Invalid Access Code. Reset cancelled.");
    return;
  }

  if (window.confirm("⚠ Are you sure you want to reset all data?")) {
    setCategories(data.categories);
    setProducts(data.products);
    setStocks(data.stocks);
    setStockHistory([]); // ✅ Clear stock history

    localStorage.removeItem("shopData");
    localStorage.removeItem("stockHistory"); // ✅ Also remove persisted history

    showToast("🔄 All data reset to default!");
  }
};




  /** ✅ Toggle category visibility */
  const toggleCategoryVisibility = (index) => {
    const updated = [...categories];
    updated[index].hidden = !updated[index].hidden;
    setCategories(updated);
    showToast(`Category "${updated[index].name}" is now ${updated[index].hidden ? "hidden" : "visible"}`);
  };

  /** ✅ Toggle product visibility */
  const toggleProductVisibility = (index) => {
    const updated = [...products];
    updated[index].hidden = !updated[index].hidden;
    setProducts(updated);
    showToast(`Product "${updated[index].name}" is now ${updated[index].hidden ? "hidden" : "visible"}`);
  };

  /** ✅ Add category */
  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, { name: newCategory, hidden: false }]);
    setNewCategory("");
    showToast(`Category "${newCategory}" added successfully!`);
  };

  /** ✅ Add product */
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;
    setProducts([...products, { ...newProduct, hidden: false }]);
    setNewProduct({ name: "", price: "", category: "", image: "" });
    showToast(`Product "${newProduct.name}" added successfully!`);
  };

  /** ✅ Handle product field edits (without applying yet) */
  const handleProductChange = (index, field, value) => {
    setPendingProductEdits((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value }
    }));
  };

  /** ✅ Request Product Update (with Access Code) */
  const requestProductUpdate = (index) => {
    setPendingAction({ type: "product", index });
    setShowAccessModal(true);
  };

  const confirmProductUpdate = () => {
    const { index } = pendingAction;
    const updated = [...products];
    updated[index] = { ...updated[index], ...pendingProductEdits[index] };
    setProducts(updated);
    setPendingProductEdits((prev) => {
      const newEdits = { ...prev };
      delete newEdits[index];
      return newEdits;
    });
    showToast(`✅ Product "${updated[index].name}" updated successfully!`);
    setPendingAction(null);
  };

  /** ✅ Handle stock input (without applying yet) */
  const handleStockChange = (index, value) => {
    if (!isNaN(value)) {
      setPendingStockQty((prev) => ({ ...prev, [index]: Number(value) }));
    }
  };

  /** ✅ Request Stock Update (with Access Code) */
  const requestStockUpdate = (index) => {
    setPendingAction({ type: "stock", index });
    setShowAccessModal(true);
  };

  const confirmStockUpdate = () => {
    const { index } = pendingAction;
    const updated = [...stocks];
    updated[index].quantity += pendingStockQty[index] || 0;
    setStocks(updated);

    // Add to stock history
    const newHistory = {
      product: updated[index].product,
      change: `+${pendingStockQty[index]}`,
      date: new Date().toLocaleString(),
    };
    setStockHistory([newHistory, ...stockHistory]);

    // Clear input after update
    setPendingStockQty((prev) => {
      const newQty = { ...prev };
      delete newQty[index];
      return newQty;
    });

    showToast(`📦 Stock for "${updated[index].product}" updated successfully!`);
    setPendingAction(null);
  };

  /** ✅ Access Code Handlers */
  const handleDigitChange = (i, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...accessDigits];
      newDigits[i] = value;
      setAccessDigits(newDigits);
      if (value && i < 4) digitRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !accessDigits[i] && i > 0) digitRefs.current[i - 1].focus();
    if (e.key === "ArrowLeft" && i > 0) digitRefs.current[i - 1].focus();
    if (e.key === "ArrowRight" && i < 4) digitRefs.current[i + 1].focus();
    if (e.key === "Enter") verifyAccessCode();
  };

  const verifyAccessCode = () => {
    if (accessDigits.join("") === ACCESS_CODE) {
      setShowAccessModal(false);
      setAccessDigits(["", "", "", "", ""]);
      if (pendingAction.type === "product") confirmProductUpdate();
      else if (pendingAction.type === "stock") confirmStockUpdate();
    } else {
      showToast("❌ Incorrect Access Code!");
    }
  };

  /** ✅ Stock Level Class */
  const getStockLevelClass = (qty) => {
    if (qty <= 10) return "low-stock";
    if (qty <= 30) return "medium-stock";
    return "high-stock";
  };

  return (
    <div className="manage-products-container">
      <Header />
      <h2>📦 Manage Products & Categories</h2>
      {toast && <div className="toast-notice show">{toast}</div>}

      {/* ✅ Tabs */}
      <div className="tabs">
        <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}>Manage Categories</button>
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Manage Products</button>
        <button className={activeTab === "stock" ? "active" : ""} onClick={() => setActiveTab("stock")}>Stock Records</button>
        <button className="reset-btn" onClick={resetAllData}><FaSync /> Reset All Data</button>
      </div>

      {/* ✅ Categories */}
      {activeTab === "categories" && (
        <div className="section">
          <h3>📂 All Categories</h3>
          <div className="category-list">
            {categories.map((cat, idx) => (
              <div key={idx} className={`category-card ${cat.hidden ? "hidden" : ""}`}>
                <h4>{cat.name}</h4>
                <div className="actions">
                  <button onClick={() => toggleCategoryVisibility(idx)}>
                    {cat.hidden ? <FaEye /> : <FaEyeSlash />} {cat.hidden ? "Show" : "Hide"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="add-category">
            <input type="text" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <button onClick={addCategory}><FaPlus /> Add Category</button>
          </div>
        </div>
      )}

      {/* ✅ Products */}
      {activeTab === "products" && (
        <div className="section">
          <h3>🛒 All Products</h3>
          {categories.map((cat) => (
            <div key={cat.name} className="category-group">
              <h4>{cat.name}</h4>
              <div className="product-list">
                {products.filter((p) => p.category === cat.name).map((prod, idx) => {
                  const edit = pendingProductEdits[idx] || {};
                  const isEdited =
                    (edit.name !== undefined && edit.name !== prod.name) ||
                    (edit.price !== undefined && Number(edit.price) !== Number(prod.price));

                  return (
                    <div 
  key={idx} 
  className={`product-card ${prod.hidden ? "hidden" : ""}`}
  style={{
    backgroundImage: `url(${prod.image ? `/images/${prod.image}` : '/images/default-bg.jpg'})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
  <div className="overlay">
    <h4>{prod.name}</h4>
    <p>₦{prod.price}</p>
    <div className="actions">
      <input 
        type="text" 
        value={edit.name ?? prod.name} 
        onChange={(e) => handleProductChange(idx, "name", e.target.value)} 
      />
      <input 
        type="number" 
        value={edit.price ?? prod.price} 
        onChange={(e) => handleProductChange(idx, "price", e.target.value)} 
      />
      <button onClick={() => requestProductUpdate(idx)} disabled={!isEdited}>
        <FaSave /> Save
      </button>
      <button onClick={() => toggleProductVisibility(idx)}>
        {prod.hidden ? <FaEye /> : <FaEyeSlash />} {prod.hidden ? "Show" : "Hide"}
      </button>
    </div>
  </div>
</div>

                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Stock Records */}
      {activeTab === "stock" && (
        <div className="section">
          <h3>📦 Stock Records</h3>
          {stocks.map((stock, idx) => (
            <div key={idx} className="stock-row">
              <span>{stock.product}</span>
              <span className={getStockLevelClass(stock.quantity)}>{stock.quantity}</span>
              <input type="number" placeholder="+Qty" value={pendingStockQty[idx] ?? ""} onChange={(e) => handleStockChange(idx, e.target.value)} />
              <button onClick={() => requestStockUpdate(idx)} disabled={!pendingStockQty[idx] || pendingStockQty[idx] === 0}>
                <FaSave /> Update
              </button>
            </div>
          ))}

          {/* ✅ Stock History */}
          <div className="stock-history">
            <h4>📜 Stock Update History</h4>
            <ul>
              {(showFullHistory ? stockHistory : stockHistory.slice(0, 5)).map((entry, idx) => (
                <li key={idx}>{entry.date} ➝ <strong>{entry.product}</strong> updated {entry.change}</li>
              ))}
            </ul>
            {stockHistory.length > 5 && (
              <button onClick={() => setShowFullHistory(!showFullHistory)}>
                {showFullHistory ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ✅ Access Code Modal */}
      {showAccessModal && (
        <div className="access-modal">
          <div className="modal-content animate">
            <h3>🔑 Enter Access Code</h3>
            <div className="digit-inputs">
              {accessDigits.map((digit, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (digitRefs.current[i] = el)}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>
            <button onClick={verifyAccessCode}>Submit</button>
            <button className="cancel-btn" onClick={() => setShowAccessModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
