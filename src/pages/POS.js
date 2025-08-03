import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import products from "../data/products";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./POS.css";
import Header from "../components/Header";
// const attendantData = JSON.parse(localStorage.getItem("attendant"));
// const attendantName = attendantData?.username || "Attendant";

const attendantData = JSON.parse(localStorage.getItem("attendant"));
const attendantName = attendantData?.username || "Attendant";

function POS() {
  const [cart, setCart] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceCounter, setInvoiceCounter] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [scrollDirection, setScrollDirection] = useState("down");
  const cartEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(savedInvoices);
    const savedCounter = parseInt(localStorage.getItem("invoiceCounter")) || 0;
    setInvoiceCounter(savedCounter);
  }, []);

  // ✅ Scroll Button Toggle Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollDirection("up");
      } else {
        setScrollDirection("down");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollButton = () => {
    if (scrollDirection === "up") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setScrollDirection("down");
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setScrollDirection("up");
    }
  };

  // ✅ Add to Cart
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    const updatedCart = existing
      ? cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      : [...cart, { ...product, qty: 1 }];
    setCart(updatedCart);
    setTimeout(() => cartEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.qty, 0);

  const generateInvoiceNumber = () => `INV-${String(invoiceCounter + 1).padStart(5, "0")}`;

  const handlePrint = () => {
    if (cart.length === 0) return;
    const invoice = {
      id: Date.now(),
      invoiceNo: generateInvoiceNumber(),
      date: new Date().toLocaleString(),
      items: cart,
      total: calculateTotal(),
      attendant: attendantName,
      paymentMethod,
    };
    const updatedInvoices = [...invoices, invoice];
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    localStorage.setItem("invoiceCounter", invoiceCounter + 1);
    setInvoices(updatedInvoices);
    setInvoiceCounter(invoiceCounter + 1);
    printInvoice(invoice);
    setCart([]);
  };

  const printInvoice = (invoice) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${invoice.invoiceNo}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 16px; line-height: 2.0; width: 70mm; margin: auto; }
            h2, h3, p { margin: 0; text-align: center; }
            h2 { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
            h3 { font-size: 16px; margin-bottom: 6px; }
            hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
            .items p { display: flex; justify-content: space-between; margin: 0; }
            .footer { text-align: center; margin-top: 12px; font-size: 14px; }
          </style>
        </head>
        <body>
          <h2>Shukurullah Nig. Ltd</h2>
          <p>Block 390, Talba Estate, Off Bida Road, Minna</p>
          <p>09019286029</p>
          <hr/>
          <p><strong>Invoice No:</strong> ${invoice.invoiceNo}</p>
          <p>Date: ${invoice.date}</p>
          <hr/>
          <div class="items">
          ${invoice.items.map(item => `<p>${item.name} x ${item.qty} <span>₦${(item.price * item.qty).toLocaleString()}</span></p>`).join("")}
          </div>
          <hr/>
          <h3>Total: ₦${invoice.total.toLocaleString()}</h3>
          <p><strong>Payment:</strong> ${invoice.paymentMethod}</p>
          <hr/>
          <p><strong>Attended By:</strong> ${invoice.attendant}</p>
          <div class="footer">
            <p>Thank you for your Patronage!</p>
            <p>See you next time!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="pos-wrapper">
      {/* ✅ Fixed Header */}
       <Header attendantName={attendantName} />
      <div className="receipt-container">
        <div className="products">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.alt} />
              <p className="product-name">{p.name}</p>
              <p className="price-tag">₦{p.price}</p>
              <button onClick={() => addToCart(p)}>Add</button>
            </div>
          ))}
        </div>

        <h3>Cart</h3>
        <div className="cart">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.name}</p>
              <div className="cart-controls">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  <FaTrash />
                </button>
              </div>
              <p>₦{item.price * item.qty}</p>
            </div>
          ))}
          <div ref={cartEndRef}></div>
        </div>
        <h4>Total: ₦{calculateTotal()}</h4>

        <div className="payment-method">
          <label><strong>Payment Method:</strong></label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="POS">POS</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>

        <button onClick={handlePrint} disabled={cart.length === 0}>Print Receipt</button>
      </div>

      {/* ✅ Scroll Arrow */}
      <button className="scroll-btn" onClick={handleScrollButton}>
        {scrollDirection === "up" ? <FaArrowUp /> : <FaArrowDown />}
      </button>
    </div>
  );
}

export default POS;
