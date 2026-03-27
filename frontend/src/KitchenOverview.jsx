import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./kitchenDashboard.css";

const socket = io(API_BASE_URL, { 
    transports: ['websocket'],
    reconnection: true
});

export default function KitchenOverview() {
    const [orders, setOrders] = useState([]);
    const [waiterAlerts, setWaiterAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState("orders");

    useEffect(() => {
        fetchActiveOrders();
        fetchWaiterRequests();

        socket.on("connect", () => console.log("🍳 Kitchen Connected to Backend"));
        socket.on("newOrder", () => fetchActiveOrders());
        socket.on("statusUpdated", () => fetchActiveOrders());
        socket.on("orderCancelled", () => fetchActiveOrders());
        socket.on("callWaiter", () => fetchWaiterRequests());

        return () => {
            socket.off("connect");
            socket.off("newOrder");
            socket.off("statusUpdated");
            socket.off("orderCancelled");
            socket.off("callWaiter");
        };
    }, []);

    const fetchActiveOrders = async () => {
        try {
            const res = await axios.get(API_BASE_URL + "/api/orders/kitchen");
            const data = Array.isArray(res.data) ? res.data : [];
            const activeOnly = data.filter(o => (o.status || "").toLowerCase() !== "served");
            setOrders(activeOnly);
        } catch (err) {
            console.error("Fetch Orders Error:", err);
        }
    };

    const fetchWaiterRequests = async () => {
        try {
            const res = await axios.get(API_BASE_URL + "/api/waiter-requests");
            setWaiterAlerts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Waiter Request Error:", err);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            
            await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                status: newStatus,
            });
            fetchActiveOrders();
        } catch (err) {
            console.error("Status Update Failed:", err);
            alert("Failed to update status.");
            fetchActiveOrders();
        }
    };

    const resolveAlert = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/api/waiter-requests/${id}/resolve`);
            setWaiterAlerts(prev => prev.filter(alert => alert.id !== id));
        } catch (err) {
            console.error("Error resolving alert:", err);
        }
    };

    return (
        <div className="kitchen-overview-content">
            <h1 className="kitchen-title">Kitchen Dashboard</h1>

            <div className="kitchen-tabs">
                <button
                    className={`k-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    🍳 Orders ({orders.length})
                </button>
                <button
                    className={`k-tab ${activeTab === 'alerts' ? 'active alert-active' : ''}`}
                    onClick={() => setActiveTab('alerts')}
                >
                    🔔 Waiter Requests ({waiterAlerts.length})
                </button>
            </div>

            {activeTab === 'orders' && (
                <div className="orders-section">
                    <div className="kitchen-stats-grid" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div className="k-stat-card" style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #334155' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pending</span>
                            <h2 style={{ margin: '5px 0', fontSize: '2rem' }}>{orders.filter(o => o.status === "Pending" || o.status === "Placed").length}</h2>
                        </div>
                        <div className="k-stat-card" style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #334155' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Cooking</span>
                            <h2 style={{ margin: '5px 0', fontSize: '2rem', color: '#fbbf24' }}>{orders.filter(o => o.status === "Preparing").length}</h2>
                        </div>
                        <div className="k-stat-card" style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #334155' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Ready</span>
                            <h2 style={{ margin: '5px 0', fontSize: '2rem', color: '#10b981' }}>{orders.filter(o => o.status === "Ready").length}</h2>
                        </div>
                    </div>

                    <div className="kitchen-grid">
                        {orders.length === 0 ? (
                            <div className="kitchen-empty">
                                <p>All orders cleared! ✅</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className={`kitchen-card ${order.status.toLowerCase()}`}>
                                    <div className="k-card-header">
                                        <span className="k-table">Table {order.table_no}</span>
                                        <div className="k-header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className={`status-dot ${order.status.toLowerCase()}`} title={order.status}></span>
                                            <span className="k-timer">🕒 {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <div className="k-customer-info">
                                        <div style={{ color: '#fbbf24', fontWeight: '600' }}>👤 {order.customer_name || "Guest"}</div>
                                    </div>

                                    <div className="k-items">
                                        {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item, idx) => (
                                            <div key={idx} className="k-item">
                                                <span className="k-qty">{item.quantity}x</span>
                                                <span className="k-name">{item.name} {item.variant ? `(${item.variant})` : ''}</span>
                                                {item.special_request && <div className="k-note">📝 {item.special_request}</div>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="k-actions">
                                        {(order.status === "Pending" || order.status === "Placed") && (
                                            <button className="k-btn start" onClick={() => updateStatus(order.id, "Preparing")}>
                                                🔥 Start Cooking
                                            </button>
                                        )}
                                        {order.status === "Preparing" && (
                                            <button className="k-btn ready" onClick={() => updateStatus(order.id, "Ready")}>
                                                ✅ Mark Ready
                                            </button>
                                        )}
                                        {order.status === "Ready" && (
                                            <button
                                                className="k-btn served"
                                                onClick={() => updateStatus(order.id, "Served")}
                                            >
                                                🍽️ Mark Served
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'alerts' && (
                <div className="alerts-section">
                    {waiterAlerts.length === 0 ? (
                        <div className="kitchen-empty">
                            <p>No active waiter requests. 👍</p>
                        </div>
                    ) : (
                        <div className="alerts-grid-large">
                            {waiterAlerts.map(alert => (
                                <div key={alert.id} className="alert-card">
                                    <div className="alert-header">
                                        <span className="alert-table">Table {alert.table_no}</span>
                                        <span className="alert-time">{new Date(alert.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="alert-body">
                                        <p>Customer needs assistance.</p>
                                    </div>
                                    <div className="alert-actions">
                                        <button className="resolve-btn" onClick={() => resolveAlert(alert.id)}>
                                            ✅ Mark Resolved
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
