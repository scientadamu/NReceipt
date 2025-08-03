// src/pages/Products.js
import React, { useState, useEffect } from "react";
import { categories as initialCategories } from "../data/products";
import "./Products.css";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "", stock: "", category: "" });
  const [editing, setEditing] = useState(false);

  // ✅ Load products from localStorage or default data
  useEffect(() => {
    const saved = localStorage.getItem("productsData");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(initialCategories);
    }
  }, []);

  // ✅ Save products to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("productsData", JSON.stringify(categories));
    }
  }, [categories]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or edit product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return;

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.title === form.category) {
          if (editing) {
            return {
              ...cat,
              products: cat.products.map((p) =>
                p.id === form.id ? { ...p, ...form, price: parseFloat(form.price), stock: parseInt(form.stock) } : p
              ),
            };
          } else {
            return {
              ...cat,
              products: [
                ...cat.products,
                {
                  id: Date.now(),
                  name: form.name,
                  price: parseFloat(form.price),
                  stock: parseInt(form.stock),
                  img: "", // Default placeholder image
                  inStock: true,
                  isAvailable: true,
                  description: form.description || "",
                },
              ],
            };
          }
        }
        return cat;
      })
    );

    setEditing(false);
    setForm({ id: null, name: "", price: "", stock: "", category: "" });
  };

  // Edit product
  const handleEdit = (product, category) => {
    setForm({ ...product, category });
    setEditing(true);
  };

  // Hide/unhide product
  const toggleHide = (catTitle, id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.title === catTitle
          ? {
              ...cat,
              products: cat.products.map((p) =>
                p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
              ),
            }
          : cat
      )
    );
  };

  // Delete product
  const handleDelete = (catTitle, id) => {
    if (window.confirm("Delete this product?")) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.title === catTitle
            ? { ...cat, products: cat.products.filter((p) => p.id !== id) }
            : cat
        )
      );
    }
  };

  return (
    <div className="products-container">
      <h2>📦 Manage Products</h2>

      {/* Form */}
      <form className="product-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price (₦)" value={form.price} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock Qty" value={form.stock} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c.title} value={c.title}>{c.title}</option>
          ))}
        </select>
        <button type="submit">{editing ? "Update" : "Add"} Product</button>
      </form>

      {/* Product Table by Category */}
      {categories.map((cat) => (
        <div key={cat.title} className="category-section">
          <h3 style={{ color: cat.color }}>{cat.title}</h3>
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price (₦)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cat.products.map((p) => (
                <tr key={p.id} className={!p.isAvailable ? "hidden-product" : ""}>
                  <td>{p.name}</td>
                  <td>₦{p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>{p.isAvailable ? "Available" : "Hidden"}</td>
                  <td>
                    <button onClick={() => handleEdit(p, cat.title)}>✏ Edit</button>
                    <button onClick={() => toggleHide(cat.title, p.id)}>{p.isAvailable ? "🙈 Hide" : "👁 Unhide"}</button>
                    <button onClick={() => handleDelete(cat.title, p.id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
