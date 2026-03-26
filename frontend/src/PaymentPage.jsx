import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import "./cart_payment.css";
import { useLanguage } from "./context/LanguageContext";
import bg from "./assets/bg.jpg";

export default function PaymentPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [orderNote, setOrderNote] = useState("");
    const { t } = useLanguage();

    // States
    const [paymentMethod, setPaymentMethod] = useState(null); // 'Cash' or 'Online'
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const savedCart = ( (() => { try { const val = localStorage.getItem("cart"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() ) || {};
        const savedNote = localStorage.getItem("orderNote") || "";
        if (Object.keys(savedCart).length === 0) navigate("/cart");
        setCart(savedCart);
        setOrderNote(savedNote);
    }, [navigate]);

    const getCartTotal = () => Object.values(cart).reduce((total, item) => total + ((parseFloat(item.price) || 0) * item.quantity), 0);
    const itemTotal = getCartTotal();
    const tax = Math.round(itemTotal * 0.05);
    const grandTotal = itemTotal + tax;

    // --- PLACE ORDER FUNCTION (CASH TIMING) ---
    const handlePlaceOrder = async (method) => {
        setProcessing(true);
        const user = ( (() => { try { const val = localStorage.getItem("user"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() ) || { id: 1 };
        const orderItems = Object.values(cart).map(item => ({
            item_id: item.id,
            quantity: item.quantity,
            variant: item.variant,
            price: item.price,
            special_request: item.note || ""
        }));

        const payload = {
            user_id: user.id || 1,
            table_no: localStorage.getItem("table_no") || "Table 1",
            items: orderItems,
            total_amount: grandTotal,
            payment_status: "Pending",
            payment_method: "Cash"
        };


        if (orderNote && payload.items.length > 0) {
            payload.items[0].special_request = (payload.items[0].special_request || "") + " [Global Note: " + orderNote + "]";
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/orders/place`, payload);
            if (res.status === 200) {
                localStorage.removeItem("cart");
                localStorage.removeItem("orderNote");
                localStorage.setItem("activeOrder", JSON.stringify({
                    id: res.data.orderId,
                    status: "Placed",
                    total: grandTotal
                }));
                navigate("/order-status", { state: { orderId: res.data.orderId, isNew: true } });
            }
        } catch (err) {
            console.error(err);
            alert("Order Failed. Please try again.");
            setProcessing(false);
        }
    };

    // --- RAZORPAY HANDLER ---
    const handleOnlinePayment = async () => {
        setProcessing(true);
        const user = ( (() => { try { const val = localStorage.getItem("user"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() ) || { id: 1 };
        const orderItems = Object.values(cart).map(item => ({
            item_id: item.id,
            quantity: item.quantity,
            variant: item.variant,
            price: item.price,
            special_request: item.note || ""
        }));

        const payload = {
            user_id: user.id || 1,
            table_no: localStorage.getItem("table_no") || "Table 1",
            items: orderItems,
            total_amount: grandTotal,
            payment_status: "Pending",
            payment_method: "Razorpay"
        };


        if (orderNote && payload.items.length > 0) {
            payload.items[0].special_request = (payload.items[0].special_request || "") + " [Global Note: " + orderNote + "]";
        }

        try {
            // 1. Create Order on Backend (which creates Razorpay Order)
            const res = await axios.post(`${API_BASE_URL}/api/orders/place`, payload);
            if (res.status === 200 && res.data.id) {

                // 2. Open Razorpay Popup
                const options = {
                    key: "rzp_test_zM7N1jN6rXU4zD", // Use exactly the backend test key if env fails
                    amount: res.data.amount,
                    currency: res.data.currency,
                    name: "DineExpress",
                    description: "Table 1 Online Payment",
                    image: "https://your-logo-url.com/logo.png",
                    order_id: res.data.id, // The Razorpay Order ID from backend
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment Signature on Backend
                            const verifyRes = await axios.post(`${API_BASE_URL}/api/orders/verify`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                dbOrderId: res.data.dbOrderId
                            });

                            if (verifyRes.data.status === "Success") {
                                // Success flow
                                localStorage.removeItem("cart");
                                localStorage.removeItem("orderNote");
                                localStorage.setItem("activeOrder", JSON.stringify({
                                    id: res.data.dbOrderId,
                                    status: "Placed",
                                    total: grandTotal
                                }));
                                navigate("/order-status", { state: { orderId: res.data.dbOrderId, isNew: true } });
                            } else {
                                alert("Payment Verification Failed!");
                                setProcessing(false);
                            }
                        } catch (err) {
                            alert("Payment Verification Error!");
                            setProcessing(false);
                        }
                    },
                    prefill: {
                        name: user.fullname || "Guest User",
                        email: user.email || "guest@example.com",
                        contact: user.mobile || "9999999999"
                    },
                    theme: { color: "#d4af37" }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert("Payment Failed: " + response.error.description);
                    setProcessing(false);
                });
                rzp1.open();
            }
        } catch (err) {
            console.error("Error creating online order: ", err);
            if (err.response && err.response.data) {
                console.error("Backend Error Data:", err.response.data);
                alert(`Order Initialization Failed: ${err.response.data.message || err.response.data.error || 'Unknown Backend Error'}`);
            } else {
                alert("Order Initialization Failed. Please try again.");
            }
            setProcessing(false);
        }
    };

    return (
        <div className="cp-container elite">
            <div className="immersive-bg" style={{ backgroundImage: `url(${bg})` }}></div>
            <div className="glass-frame">
                <header className="cp-header">
                    <button className="back-btn" onClick={() => navigate("/confirm-order")}>&larr;</button>
                    <h1>{t("select_payment")}</h1>
                </header>

                <main className="cp-content payment-mode">
                    <div className="pay-amount-display">
                        <span>{t("amount_to_pay")}</span>
                        <h2>₹{grandTotal}</h2>
                    </div>

                    <div className="payment-options">
                        {/* Cash Card */}
                        <div
                            className={`pay-card ${paymentMethod === 'Cash' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('Cash')}
                        >
                            <div className="pay-icon">💵</div>
                            <div className="pay-info">
                                <h3>{t("cash")}</h3>
                                <p>{t("pay_at_counter")}</p>
                            </div>
                            {paymentMethod === 'Cash' && <div className="check-mark">✔</div>}
                        </div>

                        {/* Online Card */}
                        <div
                            className={`pay-card ${paymentMethod === 'Online' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('Online')}
                        >
                            <div className="pay-icon">💳</div>
                            <div className="pay-info">
                                <h3>{t("pay_online")}</h3>
                                <p>{t("pay_online_desc")}</p>
                                <div className="pay-logos">
                                    <span>GPay</span> • <span>PhonePe</span> • <span>Visa</span>
                                </div>
                            </div>
                            {paymentMethod === 'Online' && <div className="check-mark">✔</div>}
                        </div>
                    </div>

                    {paymentMethod === 'Cash' && (
                        <div className="pay-hint">
                            ℹ️ {t("pay_counter_hint") || "Please pay at the counter before your food is prepared."}
                        </div>
                    )}
                </main>

                <footer className="cp-footer">
                    <button
                        className="pay-now-btn"
                        disabled={!paymentMethod || processing}
                        onClick={() => {
                            if (paymentMethod === 'Cash') handlePlaceOrder("Cash");
                            else handleOnlinePayment();
                        }}
                    >
                        {processing ? t("processing") : (paymentMethod === 'Online' ? `${t("pay_now")} ₹${grandTotal}` : `${t("place_order")} (${t("cash")})`)}
                    </button>
                </footer>
            </div>
        </div>
    );
}
