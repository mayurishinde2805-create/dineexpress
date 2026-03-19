import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cart_payment.css";
import { useLanguage } from "./context/LanguageContext";
import bg from "./assets/bg.jpg";

export default function OrderSummary() {
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [note, setNote] = useState("");
    const { t } = useLanguage();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
        if (Object.keys(savedCart).length === 0) {
            navigate("/cart");
        }
        setCart(savedCart);
    }, [navigate]);

    const getCartTotal = () => Object.values(cart).reduce((total, item) => total + ((parseFloat(item.price) || 0) * item.quantity), 0);
    const itemTotal = getCartTotal();
    const tax = Math.round(itemTotal * 0.05);
    const grandTotal = itemTotal + tax;

    const handleProceed = () => {
        localStorage.setItem("orderNote", note);
        navigate("/payment");
    };

    return (
        <div className="cp-container elite">
            <div className="immersive-bg" style={{ backgroundImage: `url(${bg})` }}></div>
            <div className="glass-frame">
                <header className="cp-header">
                    <button className="back-btn" onClick={() => navigate("/cart")}>&larr;</button>
                    <h1>{t("order_summary")}</h1>
                </header>

                <main className="cp-content summary-mode">
                    <div className="summary-card">
                        <h3>{t("table_no")} 1</h3>
                        <p className="prep-time">⏱️ {t("est_time")}: 15-20 {t("mins")}</p>

                        <div className="summ-list">
                            {Object.values(cart).map((item, idx) => (
                                <div key={idx} className="summ-row">
                                    <div className="summ-name">
                                        <span className="summ-qty">{item.quantity}x</span>
                                        {item.name} {item.variant && `(${item.variant})`}
                                    </div>
                                    <div className="summ-price">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className="summ-totals">
                            <div className="row">
                                <span>{t("item_total")}</span>
                                <span>₹{itemTotal}</span>
                            </div>
                            <div className="row tax">
                                <span>{t("tax")} (5%)</span>
                                <span>₹{tax}</span>
                            </div>
                            <div className="row total">
                                <span>{t("to_pay")}</span>
                                <span>₹{grandTotal}</span>
                            </div>
                        </div>
                    </div>

                    <div className="note-section">
                        <label>{t("cooking_requests")}</label>
                        <textarea
                            className="note-input"
                            placeholder={t("note_placeholder")}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </main>

                <footer className="cp-footer">
                    <button className="edit-btn" onClick={() => navigate("/cart")}>{t("edit_order")}</button>
                    <button className="confirm-btn" onClick={handleProceed}>
                        {t("select_payment")} &rarr;
                    </button>
                </footer>
            </div>
        </div>
    );
}
