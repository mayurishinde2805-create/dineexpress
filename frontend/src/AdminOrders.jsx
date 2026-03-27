import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminOrders.css";
import { useLanguage } from "./context/LanguageContext";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL, { 
    transports: ['websocket'],
    reconnection: true
});

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("active"); 
    const { language } = useLanguage();

    useEffect(() => {
        fetchOrders();

        socket.on("connect", () => console.log("📊 Admin Connected to Backend"));
        socket.on("newOrder", () => fetchOrders());
        socket.on("statusUpdated", () => fetchOrders());
        socket.on("orderCancelled", () => fetchOrders());

        return () => {
            socket.off("connect");
            socket.off("newOrder");
            socket.off("statusUpdated");
            socket.off("orderCancelled");
        };
    }, [language]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(API_BASE_URL + "/api/orders", { params: { lang: language } });
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!newStatus) return;
        try {
            await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                status: newStatus,
            });
            fetchOrders();
        } catch (err) {
            alert("Error updating status");
        }
    };

    const confirmCashPayment = async (orderId) => {
        try {
            await axios.post(API_BASE_URL + "/api/orders/confirm-cash", { orderId });
            alert("Payment Confirmed! Order sent to Kitchen.");
            fetchOrders();
        } catch (err) {
            alert("Error confirming payment");
        }
    };

    const getStatusColor = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "pending" || s === "placed") return "#fbbf24";
        if (s === "preparing") return "#f97316";
        if (s === "ready") return "#4ade80";
        if (s === "served") return "#22c55e";
        return "#64748b";
    };

    const filteredOrders = orders.filter((order) => {
        const s = (order.status || "").toLowerCase();
        if (filter === "active") return !["served", "cancelled"].includes(s);
        if (filter === "history") return ["served", "cancelled"].includes(s);
        if (filter === "preparing") return s === "preparing";
        if (filter === "ready") return s === "ready";
        if (filter === "new") return s === "pending" || s === "placed";
        return true;
    });

    const getNextStatus = (currentStatus) => {
        const s = (currentStatus || "").toLowerCase();
        if (s === "pending" || s === "placed") return "Preparing";
        if (s === "preparing") return "Ready";
        if (s === "ready") return "Served";
        return null;
    };

    return (
        <div className="admin-orders">
            <div className="orders-header">
                <div className="filter-buttons">
                    <button className={`filter-btn ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
                        🔥 Active ({orders.filter(o => !["served", "cancelled"].includes((o.status || "").toLowerCase())).length})
                    </button>
                    <button className={`filter-btn ${filter === "new" ? "active" : ""}`} onClick={() => setFilter("new")}>🆕 New</button>
                    <button className={`filter-btn ${filter === "preparing" ? "active" : ""}`} onClick={() => setFilter("preparing")}>👨‍🍳 Preparing</button>
                    <button className={`filter-btn ${filter === "ready" ? "active" : ""}`} onClick={() => setFilter("ready")}>✅ Ready</button>
                    <button className={`filter-btn ${filter === "history" ? "active" : ""}`} onClick={() => setFilter("history")}>📜 History</button>
                </div>
            </div>

            <div className="orders-grid">
                {filteredOrders.length === 0 ? (
                    <div className="empty-state">No orders found</div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h3>#{order.id} <small>Table {order.table_no}</small></h3>
                                    <div className="payment-badges">
                                        <span className="badge" style={{ backgroundColor: order.payment_status?.toLowerCase() === 'paid' ? '#22c55e' : '#ef4444' }}>
                                            {order.payment_status}
                                        </span>
                                        <span className="badge" style={{ backgroundColor: '#64748b' }}>{order.payment_mode || 'Cash'}</span>
                                    </div>
                                </div>
                                <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-items">
                                {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <strong>₹{order.total_amount}</strong>
                                <div className="order-actions">
                                    {order.payment_status !== 'Paid' && (
                                        <button className="action-btn pay-btn" onClick={() => confirmCashPayment(order.id)}>💵 Confirm Payment</button>
                                    )}
                                    {order.payment_status === 'Paid' && order.status !== "Served" && order.status !== "served" && (
                                        <button className="action-btn primary" onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}>
                                            {getNextStatus(order.status)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
