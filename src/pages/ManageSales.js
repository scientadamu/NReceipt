import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // ✅ Existing Header
import "./ManageSales.css";

const defaultImage = "https://via.placeholder.com/150"; // ✅ Fallback image

function ManageSales() {
  const navigate = useNavigate();
  const [attendantName, setAttendantName] = useState("Attendant");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const storedAttendant = JSON.parse(localStorage.getItem("attendant"));
      if (!storedAttendant) {
        navigate("/login");
        return;
      }
      setAttendantName(storedAttendant.username || "Attendant");

      const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
      setProducts(storedProducts);
    } catch {
      localStorage.removeItem("attendant");
      navigate("/login");
    }
  }, [navigate]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const invoice = {
      id: Date.now(),
      items: cart,
      total: getTotal(),
      date: new Date(),
      attendant: attendantName,
    };

    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));

    setCart([]);
    alert("Sale recorded successfully!");
  };

  return (
    <div className="manage-sales-wrapper">
      <Header /> {/* ✅ Existing header component */}

      <div className="manage-sales-container">
        <h2>Manage Sales</h2>

        <div className="product-section">
          {products.length === 0 ? (
            <p>No products found. Add some in Manage Products.</p>
          ) : (
            products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image || defaultImage}
                  alt={product.name}
                  className="product-img"
                />
                <h4>{product.name}</h4>
                <p>₦{product.price.toLocaleString()}</p>
                <button onClick={() => addToCart(product)}>Add</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-section">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} (₦{item.price.toLocaleString()}) x {item.quantity}
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {cart.length > 0 && (
            <>
              <h4>Total: ₦{getTotal().toLocaleString()}</h4>
              <button onClick={handleCheckout} className="checkout-btn">
                Complete Sale
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageSales;
