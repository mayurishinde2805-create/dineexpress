import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./menu.css";
import CraveBot from "./CraveBot";
import { initializeModel, generateDepthMapCanvas } from "./utils/depthEstimator";
import DepthImage3D from "./components/DepthImage3D";
import "./gallery3d.css"; // Reuse gallery styles for spinner etc.

import { useLanguage } from "./context/LanguageContext";
import API_BASE_URL from "./apiConfig";

// Initialize Socket
const socket = io(API_BASE_URL);

export default function Menu() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // --- STATE ---
  const [arDish, setArDish] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => ( (() => { try { return ( (() => { try { const val = localStorage.getItem("cart"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() ) || JSON.parse("{}"); } catch(e) { return JSON.parse("{}"); } })() ));
  const [activeOrder, setActiveOrder] = useState(null);
  const [tableNo] = useState(1);
  const [loyaltyPoints] = useState(1250);
  const [depthCanvas, setDepthCanvas] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const arImageRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    const savedOrder = ( (() => { try { const val = localStorage.getItem("activeOrder"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() );
    if (savedOrder) setActiveOrder(savedOrder);

    axios.get(`${API_BASE_URL}/api/menu/all`, { params: { lang: language } })
      .then(res => {
        const allowedCategories = ['Starters', 'Main Menu', 'Desserts', 'Drinks'];
        const data = Array.isArray(res.data) ? res.data : [];
        const filteredData = data.filter(item => {
          const cat = (item.category_en || item.category || "").trim();
          return allowedCategories.some(allowed => allowed.toLowerCase() === cat.toLowerCase());
        });
        setMenuItems(filteredData);
        setCategories(["All", ...allowedCategories]);
      })
      .catch(err => console.error("Error fetching menu:", err));

    socket.on("statusUpdated", (data) => {
      if (activeOrder && activeOrder.id === data.id) {
        const updated = { ...activeOrder, status: data.status };
        setActiveOrder(updated);
        localStorage.setItem("activeOrder", JSON.stringify(updated));
      }
    });

    return () => socket.off("statusUpdated");
  }, [activeOrder, language]);

  // Helper to generate full image URL
  const getFullImageUrl = (path) => {
    if (!path) return `https://source.unsplash.com/400x300/?food`;
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  // --- ACTIONS ---
  const handleCallWaiter = () => {
    socket.emit("callWaiter", { table: tableNo });
    alert(t("waiter_called"));
  };

  const updateCart = (item, change) => {
    setCart(prev => {
      const currentItem = prev[item.id] || {};
      const newQty = (currentItem.quantity || 0) + change;
      let newCart = { ...prev };
      if (newQty <= 0) delete newCart[item.id];
      else {
        newCart[item.id] = {
          id: item.id,
          name: item.display_name || item.name,
          price: item.price,
          quantity: newQty
        };
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const filteredItems = menuItems.filter(item => {
    const itemCat = (item.display_category || item.category || "").trim().toLowerCase();
    const itemName = item.display_name || item.name;
    const matchesCat = selectedCategory === "All" || itemCat === selectedCategory.toLowerCase();
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartItemCount = Object.values(cart || {}).reduce((total, item) => total + (item?.quantity || 0), 0);

  return (
    <div className="menu-v2-container">
      {/* Header */}
      <header className="v2-header">
        <div className="v2-brand">DineExpress <span className="table-tag">T{tableNo}</span></div>
        <div className="v2-header-actions">
          <div className="loyalty-card-mini">🌟 {loyaltyPoints} Pts</div>
          <div className="v2-cart-icon" onClick={() => navigate("/cart")}>
            🛍️ <span className="count">{cartItemCount}</span>
          </div>
        </div>
      </header>

      {/* Simple Hero Section */}
      <section className="menu-simple-hero">
        <div className="hero-inner">
          <h1 className="cinematic-title">Our Menu</h1>
          <p className="elite-subtitle">{t("premium_experience")}</p>
        </div>
      </section>

      {/* Advanced Search */}
      <div className="search-container-v2">
        <input
          type="text"
          placeholder={t("login_subtitle")} // Using existing key for placeholder logic
          className="search-bar-premium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Order Tracking (If Active) */}
      {activeOrder && activeOrder.status !== "Served" && (
        <div className="timeline-premium">
          <div className="timeline-row">
            {["Placed", "Preparing", "Ready", "Served"].map((step, idx) => {
              const statuses = ["Placed", "Preparing", "Ready", "Served"];
              const currentIdx = statuses.indexOf(activeOrder.status);
              const isActive = idx <= currentIdx;
              return (
                <div key={step} className={`t-step ${isActive ? 'active' : ''}`}>
                  <div className="t-step-icon"></div>
                  <span>{t(step.toLowerCase()) || step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Nav */}
      <div className="category-nav-v2">
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-btn-v2 ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dish Grid */}
      <div className="menu-grid-v2">
        {filteredItems.map(item => {
          const qty = cart[item.id]?.quantity || 0;
          return (
            <div key={item.id} className="dish-card-v2">
              <span className={`diet-pill ${item.diet}`}></span>
              <img
                src={getFullImageUrl(item.image_url)}
                className="dish-img-v2"
                alt={item.name}
              />
              <div className="dish-info-v2">
                <h3>{item.display_name || item.name}</h3>
                <p className="dish-desc-v2">{item.display_description || item.description || "A premium delicacy prepared with fresh ingredients."}</p>
                <div className="dish-footer-v2">
                  <span className="price-v2">₹{item.price}</span>
                  <div className="dish-actions-right">
                    <button className="ar-small-btn" onClick={() => setArDish(item)}>🕶️ {t("3d_view")}</button>
                    {qty === 0 ? (
                      <button className="add-circle-btn" onClick={() => updateCart(item, 1)}>+</button>
                    ) : (
                      <div className="qty-pill-v2">
                        <button onClick={() => updateCart(item, -1)}>-</button>
                        <span>{qty}</span>
                        <button onClick={() => updateCart(item, 1)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Waiter FAB */}
      <button className="waiter-fab" onClick={handleCallWaiter}>
        🔔 {t("call_waiter_btn")}
      </button>

      {/* CraveBot AI */}
      <CraveBot
        menuItems={menuItems}
        onSelectItem={(item) => {
          setSelectedCategory("All");
          setSearchQuery(item.name);
        }}
      />

      {/* Bottom Floating Bar */}
      {
        Object.keys(cart).length > 0 && (
          <div className="floating-bar-v2" onClick={() => navigate("/cart")}>
            <div className="cart-summ">
              <span>{Object.values(cart).reduce((a, b) => a + b.quantity, 0)} {t("items")}</span>
              <span>₹{Object.values(cart).reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
            </div>
            <button className="view-cart-btn">{t("view_cart")} &rarr;</button>
          </div>
        )
      }

      {/* AR Preview Modal */}
      {arDish && (
        <div className="ar-modal-overlay" onClick={() => { setArDish(null); setDepthCanvas(null); }}>
          <div className="ar-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-ar" onClick={() => { setArDish(null); setDepthCanvas(null); }}>✕</button>
            <div className="ar-canvas">
              {/* Process current dish image for depth */}
              <img
                ref={arImageRef}
                src={getFullImageUrl(arDish.image_url)}
                crossOrigin="anonymous"
                style={{ display: 'none' }}
                onLoad={async () => {
                  setIsEstimating(true);
                  try {
                    const canvas = await generateDepthMapCanvas(arImageRef.current);
                    setDepthCanvas(canvas);
                  } catch (e) {
                    console.error("3D Error:", e);
                  } finally {
                    setIsEstimating(false);
                  }
                }}
              />

              {isEstimating && (
                <div className="estimating-overlay">
                  <div className="spinner"></div>
                  <span>Generating 3D Experience...</span>
                </div>
              )}

              {depthCanvas ? (
                <DepthImage3D image={arDish} depthMapCanvas={depthCanvas} />
              ) : (
                <div className="ar-dish-view-fallback">
                  <img src={getFullImageUrl(arDish.image_url)} alt="dish" className="ar-dish-view" />
                  {!isEstimating && <div className="ar-scanner-line"></div>}
                </div>
              )}
            </div>
            <h2>{arDish.name} in 3D</h2>
            <p>Experience the texture and detail of your dish. Interactive 3D view.</p>
            <button className="view-cart-btn" style={{ width: '100%' }} onClick={() => { updateCart(arDish, 1); setArDish(null); setDepthCanvas(null); }}>
              Add to Cart • ₹{arDish.price}
            </button>
          </div>
        </div>
      )}
    </div >
  );
}
