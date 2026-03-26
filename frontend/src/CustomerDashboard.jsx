import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import "./customerDashboard.css";
import { io } from "socket.io-client";
import { useLanguage } from "./context/LanguageContext";
import bg from "./assets/bg.jpg";

const socket = io(API_BASE_URL);

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("orders"); // orders, history, profile
    const { t, language } = useLanguage();

    const fetchOrders = (userId, lang) => {
        axios.get(`${API_BASE_URL}/api/orders/user/${userId}`, { params: { lang } })
            .then(res => setOrders(res.data))
            .catch(err => console.error("Error fetching history:", err));
    };

    useEffect(() => {
        const storedUser = ( (() => { try { const val = localStorage.getItem("user"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() );
        if (!storedUser) {
            navigate("/login");
            return;
        }
        setUser(storedUser);
        fetchOrders(storedUser.id, language);

        socket.on("statusUpdated", () => fetchOrders(storedUser.id, language));
        socket.on("paymentSuccess", () => fetchOrders(storedUser.id, language));
        socket.on("orderCancelled", () => fetchOrders(storedUser.id, language));

        return () => {
            socket.off("statusUpdated");
            socket.off("paymentSuccess");
            socket.off("orderCancelled");
        };
    }, [navigate, language]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm(t("confirm_cancel") || "Are you sure you want to cancel this order?")) return;
        try {
            await axios.put(`${API_BASE_URL}/api/orders/${orderId}/cancel`);
            fetchOrders(user.id, language);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel order");
        }
    };

    const activeOrders = orders.filter(o => {
        const orderStatus = (o.status || "").toLowerCase();
        return orderStatus !== "served" && orderStatus !== "cancelled";
    });

    const pastOrders = orders.filter(o => {
        const orderStatus = (o.status || "").toLowerCase();
        return orderStatus === "served" || orderStatus === "cancelled";
    }).sort((a, b) => b.id - a.id);

    const getStatusLabel = (status) => {
        const key = (status || "").toLowerCase();
        return t(key) || status;
    };

    const getProgressIndex = (status) => {
        const s = (status || "").toLowerCase();
        if (s === 'placed' || s === 'new') return 0;
        if (s === 'preparing') return 1;
        if (s === 'ready') return 2;
        if (s === 'served') return 3;
        return 0;
    };

    return (
        <div className="cp-container elite">
            <div className="immersive-bg" style={{ backgroundImage: `url(${bg})` }}></div>
            <div className="glass-frame dashboard-frame">
                <header className="cp-header dashboard-header">
                    <button className="back-btn" onClick={() => navigate("/home")}>&larr;</button>
                    <h1>{t("my_dashboard")}</h1>
                    <button className="logout-btn-icon" onClick={handleLogout} title="Logout">⏻</button>
                </header>

                <main className="cp-content">
                    <div className="premium-welcome">
                        <h2>{t("welcome")}, {user?.fullname?.split(" ")[0]}!</h2>
                        <p>{t("culinary_journey_subtitle") || "Your curated culinary selections"}</p>
                    </div>

                    {/* Elite Tab Switcher */}
                    <div className="elite-tabs">
                        <button className={`tab-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            {t("your_orders") || "Orders"}
                        </button>
                        <button className={`tab-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                            {t("order_history") || "History"}
                        </button>
                        <button className={`tab-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            {t("profile") || "Profile"}
                        </button>
                    </div>

                    <div className="dash-sections">
                        {activeTab === 'orders' && (
                            <section className="live-orders animate-in">
                                <h3 className="section-title">✨ {t("active_orders")}</h3>
                                {activeOrders.length === 0 ? (
                                    <div className="empty-state-luxury">
                                        <p>{t("no_active_orders")}</p>
                                        <button className="gold-btn" onClick={() => navigate("/home")}>{t("view_menu")}</button>
                                    </div>
                                ) : (
                                    activeOrders.map(order => (
                                        <div key={order.id} className="order-card luxury">
                                            <div className="order-meta">
                                                <span className="order-id">#{order.id}</span>
                                                <div className="order-status-group">
                                                    <span className={`status-pill ${order.status.toLowerCase()}`}>{getStatusLabel(order.status)}</span>
                                                    {(order.status === 'Placed' || order.status === 'New') && (
                                                        <button className="cancel-btn" onClick={() => handleCancelOrder(order.id)}>Cancel</button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="order-progress">
                                                {['Placed', 'Preparing', 'Ready', 'Served'].map((step, idx) => (
                                                    <div key={idx} className={`progress-step ${getProgressIndex(order.status) >= idx ? 'active' : ''}`}>
                                                        <span className="step-num">{idx + 1}</span>
                                                        <span className="progress-label">{t(step.toLowerCase()) || step}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="order-details-elite">
                                                <div className="order-items-list">
                                                    {order.items && order.items.map((item, idx) => (
                                                        <div key={idx} className="order-item-row">
                                                            <span className="qty">{item.quantity}x</span>
                                                            <span className="name">{item.name} {item.variant ? `(${item.variant})` : ''}</span>
                                                            <span className="price">₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-time">
                                                    Placed at: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </section>
                        )}

                        {activeTab === 'history' && (
                            <section className="history-section-premium animate-in">
                                <h3 className="section-title">📜 {t("order_history")}</h3>
                                {pastOrders.length === 0 ? (
                                    <div className="empty-state-luxury">
                                        <p>{t("no_history") || "No orders found in history"}</p>
                                    </div>
                                ) : (
                                    <div className="premium-table">
                                        {pastOrders.map(order => (
                                            <div key={order.id} className="history-item">
                                                <div className="history-details">
                                                    <div className="history-id">Order #{order.id}</div>
                                                    <div className="history-items-inline">
                                                        {order.items && order.items.map((i, idx) => (
                                                            <span key={idx}>{i.quantity}x {i.name}{idx < order.items.length - 1 ? ', ' : ''}</span>
                                                        ))}
                                                    </div>
                                                    <div className="history-time">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                <div className="h-right">
                                                    <div className="h-total">₹{order.total_amount}</div>
                                                    <div className={`h-status sticker ${order.status.toLowerCase()}`}>{order.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {activeTab === 'profile' && (
                            <section className="profile-section-elite animate-in">
                                <h3 className="section-title">👤 {t("your_profile") || "Profile Details"}</h3>
                                <div className="member-card">
                                    <div className="member-avatar">
                                        {user?.fullname?.charAt(0)}
                                    </div>
                                    <div className="member-details">
                                        <div className="detail-item">
                                            <label>{t("fullname_label") || "Full Name"}</label>
                                            <p>{user?.fullname}</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>{t("email_label") || "Email"}</label>
                                            <p>{user?.email}</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>{t("phone_label") || "Phone"}</label>
                                            <p>{user?.phone || "Not Provided"}</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>{t("member_since") || "Member Since"}</label>
                                            <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}</p>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <span className="membership-badge">⭐ ELITE MEMBER</span>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
