// ✅ Edited POS.js to load products from stock records (localStorage)

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAttendantName } from "../utils/getAttendant";
import Header from "../components/Header";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./POS.css";

function POS() {
  const attendantName = getAttendantName();
  const [cart, setCart] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceCounter, setInvoiceCounter] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [products, setProducts] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const cartEndRef = useRef(null);

  // ✅ Load products, invoices, counter on mount
  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(savedInvoices);

    const savedCounter = parseInt(localStorage.getItem("invoiceCounter")) || 0;
    setInvoiceCounter(savedCounter);

    // ✅ Load products from localStorage (stock data)
    const storedData = JSON.parse(localStorage.getItem("shopData"));
    if (storedData && storedData.products) {
      const activeProducts = storedData.products.filter(p => !p.hidden);
      const productsWithId = activeProducts.map((p, index) => ({
        ...p,
        id: index + 1,
        image: p.image ? `/images/${p.image}` : null,
        alt: p.name
      }));
      setProducts(productsWithId);
    }

    const handleScroll = () => setShowScrollButton(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = useCallback(
    (product) => {
      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.id === product.id);
        if (existing) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          return [...prevCart, { ...product, qty: 1 }];
        }
      });

      setTimeout(() => {
        cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && products.length > 0) addToCart(products[0]);
      if (e.key === "Delete" && cart.length > 0) removeFromCart(cart[cart.length - 1].id);
      if (e.key === "ArrowUp" && cart.length > 0) updateQuantity(cart[cart.length - 1].id, 1);
      if (e.key === "ArrowDown" && cart.length > 0) updateQuantity(cart[cart.length - 1].id, -1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, addToCart, products]);

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.qty, 0);

  const generateInvoiceNumber = () => `INV-${String(invoiceCounter + 1).padStart(5, "0")}`;

  const handlePrint = () => {
    if (cart.length === 0) return;
    const newInvoiceNo = generateInvoiceNumber();
    const invoice = {
      id: Date.now(),
      invoiceNo: newInvoiceNo,
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
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              color: #000;
              line-height: 1.6;
              width: 70mm;
              margin: auto;
              padding: 10px;
            }
            h2 {
              font-size: 18px;
              font-weight: 700;
              text-align: center;
              margin-bottom: 5px;
            }
            p, h3 {
              margin: 0;
              padding: 0;
              text-align: center;
            }
            h3 {
              font-size: 16px;
              font-weight: bold;
              margin: 8px 0;
            }
            hr {
              border: none;
              border-top: 1px dashed #333;
              margin: 8px 0;
            }
            .items p {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              margin: 2px 0;
            }
            .total {
              font-size: 15px;
              font-weight: bold;
              text-align: right;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h2>Shukurullah Nig. Ltd</h2>
          <p>Block 390, Talba Estate</p>
          <p>Off Bida Road, Minna</p>
          <p>09019286029</p>
          <hr/>
          <p><strong>Invoice No:</strong> ${invoice.invoiceNo}</p>
          <p><strong>Date:</strong> ${invoice.date}</p>
          <hr/>
          <div class="items">
          ${invoice.items
            .map((item) =>
              `<p><span>${item.name} x ${item.qty}</span><span>₦${(item.price * item.qty).toLocaleString()}</span></p>`
            )
            .join("")}
          </div>
          <hr/>
          <div class="total">Total: ₦${invoice.total.toLocaleString()}</div>
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <>
      <Header />
      <div className="receipt-container">
        <h2 className="store-name">Shukurullah Nig. Ltd</h2>
        <p className="store-contact">Attendant: {attendantName}</p>

        <div className="products">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.alt} onError={(e) => e.target.style.display = "none"} />
              <p>{p.name}</p>
              <p>₦{p.price}</p>
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
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}><FaTrash /></button>
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

      <button className="scroll-btn" onClick={showScrollButton ? scrollToTop : scrollToBottom}>
        {showScrollButton ? <FaArrowUp /> : <FaArrowDown />}
      </button>
    </>
  );
}

export default POS;
