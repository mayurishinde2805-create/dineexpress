import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cart_payment.css"; // New CSS file
import { useLanguage } from "./context/LanguageContext";
import bg from "./assets/bg.jpg";

export default function Cart() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [cart, setCart] = useState({});

    useEffect(() => {
        const savedCart = ( (() => { try { const val = localStorage.getItem("cart"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() ) || {};
        setCart(savedCart);
    }, []);

    const updateCart = (key, change) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (!newCart[key]) return prev;

            newCart[key].quantity += change;
            if (newCart[key].quantity <= 0) {
                delete newCart[key];
            }
            localStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const getCartTotal = () => Object.values(cart).reduce((total, item) => total + ((parseFloat(item.price) || 0) * item.quantity), 0);
    const cartCount = Object.values(cart).reduce((a, b) => a + b.quantity, 0);

    return (
        <div className="cp-container elite">
            <div className="immersive-bg" style={{ backgroundImage: `url(${bg})` }}></div>
            <div className="glass-frame">
                <header className="cp-header">
                    <button className="back-btn" onClick={() => navigate("/home")}>&larr;</button>
                    <h1>{t("your_order")}</h1>
                    <span className="cp-table-badge">{t("table_no")} 1</span>
                </header>

                <main className="cp-content">
                    {cartCount === 0 ? (
                        <div className="empty-cart-view">
                            <div className="empty-icon">🍽️</div>
                            <p>{t("empty_cart")}</p>
                            <button className="browse-menu-btn" onClick={() => navigate("/home")}>{t("browse_menu")}</button>
                        </div>
                    ) : (
                        <div className="cart-list">
                            {Object.entries(cart).map(([key, item]) => (
                                <div key={key} className="cart-item-glass">
                                    <div className="cart-item-img">
                                        <img src={item.image_url || "https://placehold.co/100"} alt={item.name} />
                                        <span className={`diet-dot ${item.diet === 'veg' ? 'veg' : 'non-veg'}`}></span>
                                    </div>
                                    <div className="cart-item-info">
                                        <h3>{item.name}</h3>
                                        {item.variant && <span className="variant-label">{item.variant}</span>}
                                        <div className="cart-item-price">₹{item.price}</div>
                                    </div>
                                    <div className="cart-item-qty">
                                        <button onClick={() => updateCart(key, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateCart(key, 1)}>+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {cartCount > 0 && (
                    <footer className="cp-footer">
                        <div className="footer-summ">
                            <span>{cartCount} {t("items")}</span>
                            <span className="footer-total">₹{getCartTotal()}</span>
                        </div>
                        <button className="confirm-btn" onClick={() => navigate("/confirm-order")}>
                            {t("proceed_summary")} &rarr;
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
}
