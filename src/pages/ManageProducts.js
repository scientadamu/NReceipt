// src/pages/ManageProducts.js
import React, { useState, useEffect } from "react";
import "./ManageProducts.css";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, []);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const addProduct = () => {
    if (!name || !price || !image) return alert("Fill all fields!");
    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      image,
      hidden: false,
    };
    saveProducts([...products, newProduct]);
    setName("");
    setPrice("");
    setImage("");
  };

  const toggleHide = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, hidden: !p.hidden } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  return (
    <div className="manage-products-container">
      <h2>Manage Products</h2>

      {/* Add Product Form */}
      <div className="product-form">
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Price (₦)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Product List */}
      <table>
        <thead>
          <tr>
            <th>Image</th><th>Name</th><th>Price</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className={p.hidden ? "hidden-product" : ""}>
              <td><img src={p.image} alt={p.name} width="50" /></td>
              <td>{p.name}</td>
              <td>₦{p.price}</td>
              <td>{p.hidden ? "Hidden" : "Visible"}</td>
              <td>
                <button onClick={() => toggleHide(p.id)}>
                  {p.hidden ? "Show" : "Hide"}
                </button>
                <button onClick={() => deleteProduct(p.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProducts;
