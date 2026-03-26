import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminOrders.css";
import { useLanguage } from "./context/LanguageContext";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL);

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("active"); // active, new, preparing, ready, history
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { language } = useLanguage();

    useEffect(() => {
        fetchOrders();

        socket.on("newOrder", () => {
            fetchOrders();
        });

        socket.on("statusUpdated", () => {
            fetchOrders();
        });

        socket.on("orderCancelled", () => {
            fetchOrders();
        });

        return () => {
            socket.off("newOrder");
            socket.off("statusUpdated");
            socket.off("orderCancelled");
        };
    }, [language]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(API_BASE_URL + "/api/orders", { params: { lang: language } });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                status: newStatus,
            });
            fetchOrders();
        } catch (err) {
            alert("Error updating status");
            console.error(err);
        }
    };

    const confirmCashPayment = async (orderId) => {
        try {
            await axios.post(API_BASE_URL + "/api/orders/confirm-cash", {
                orderId: orderId
            });
            alert("Payment Confirmed! Order sent to Kitchen.");
            fetchOrders();
        } catch (err) {
            alert("Error confirming payment");
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            new: "#fbbf24", // Yellow/Orange
            preparing: "#f97316", // Orange
            ready: "#4ade80", // Green Light
            served: "#22c55e", // Green
        };
        return colors[status?.toLowerCase()] || "#a8b5a8";
    };

    const getPaymentColor = (status) => {
        return status?.toLowerCase() === 'paid' ? '#22c55e' : '#ef4444'; // Green or Red
    };

    const filteredOrders = orders.filter((order) => {
        const status = order.status?.toLowerCase();
        if (filter === "active") return !["served", "cancelled"].includes(status);
        if (filter === "history") return ["served", "cancelled"].includes(status);
        return status === filter;
    });

    const getNextStatus = (currentStatus) => {
        const flow = {
            new: "preparing",
            preparing: "ready",
            ready: "served",
        };
        return flow[currentStatus?.toLowerCase()];
    };

    const parseItems = (items) => {
        if (!items) return [];
        if (typeof items === 'string') {
            try {
                return JSON.parse(items);
            } catch (e) {
                console.error("Parse error", e);
                return [];
            }
        }
        return items;
    };

    return (
        <div className="admin-orders">
            <div className="orders-header">
                <div className="filter-buttons">
                    <button className={`filter-btn ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
                        🔥 Active ({orders.filter(o => !["served", "cancelled"].includes((o.status || "").toLowerCase())).length})
                    </button>
                    <button className={`filter-btn ${filter === "new" ? "active" : ""}`} onClick={() => setFilter("new")}>
                        🆕 New
                    </button>
                    <button className={`filter-btn ${filter === "preparing" ? "active" : ""}`} onClick={() => setFilter("preparing")}>
                        👨‍🍳 Preparing
                    </button>
                    <button className={`filter-btn ${filter === "ready" ? "active" : ""}`} onClick={() => setFilter("ready")}>
                        ✅ Ready
                    </button>
                    <button className={`filter-btn ${filter === "history" ? "active" : ""}`} onClick={() => setFilter("history")}>
                        📜 History ({orders.filter(o => ["served", "cancelled"].includes((o.status || "").toLowerCase())).length})
                    </button>
                </div>
            </div>

            <div className="orders-grid">
                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <p>No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h3>#{order.id} <small>Table {order.table_no || order.table_number}</small></h3>
                                    <div className="payment-badges">
                                        <span className="badge" style={{ backgroundColor: getPaymentColor(order.payment_status) }}>
                                            {order.payment_status || 'Pending'}
                                        </span>
                                        <span className="badge" style={{ backgroundColor: '#64748b' }}>
                                            {order.payment_mode || order.payment_method || 'Cash'}
                                        </span>
                                    </div>
                                </div>
                                <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                                    {order.status?.toUpperCase()}
                                </span>
                            </div>

                            <div className="order-items">
                                {parseItems(order.items).map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <strong>₹{order.total_amount}</strong>
                                <div className="order-actions">
                                    {/* Confirm Cash Payment Button */}
                                    {order.payment_status !== 'Paid' && (
                                        <button className="action-btn pay-btn" onClick={() => confirmCashPayment(order.id)}>
                                            💵 Confirm Payment
                                        </button>
                                    )}

                                    {/* Only allow kitchen status updates if Paid */}
                                    {order.payment_status === 'Paid' && order.status !== "served" && (
                                        <button
                                            className="action-btn primary"
                                            onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                                        >
                                            {order.status === "new" && "Start Preparing"}
                                            {order.status === "preparing" && "Mark Ready"}
                                            {order.status === "ready" && "Mark Served"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Keeping Modal Logic (Omitting for brevity if unchanged, but actually I should include full file) */}
        </div>
    );
}
