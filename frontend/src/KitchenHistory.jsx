import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./kitchenDashboard.css";

const socket = io(API_BASE_URL);

export default function KitchenHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchHistory();
        // Socket not strictly needed for history but helpful
        socket.on("statusUpdated", fetchHistory);
        return () => socket.off("statusUpdated", fetchHistory);
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(API_BASE_URL + "/api/orders");
            // For history, show Served or Cancelled.
            const history = res.data.filter(o =>
                o.status === "Served" || o.status === "Cancelled"
            );
            setOrders(history);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="kitchen-history-content">
            <h3 style={{ marginBottom: '20px', color: '#94a3b8' }}>Recently Completed Orders</h3>
            <div className="kitchen-grid">
                {orders.length === 0 ? (
                    <div className="kitchen-empty">
                        <p>No past orders found. 📜</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="kitchen-card history">
                            <div className="k-card-header">
                                <span className="k-table">Table {order.table_no}</span>
                                <span className={`k-status-label ${order.status.toLowerCase()}`}>{order.status}</span>
                            </div>
                            <div className="k-customer-info">
                                <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>👤 {order.customer_name || "Guest"}</div>
                            </div>
                            <div className="k-items">
                                {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item, idx) => (
                                    <div key={idx} className="k-item">
                                        <span className="k-qty">{item.quantity}x</span>
                                        <span className="k-name">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="k-footer" style={{ padding: '5px 12px', fontSize: '0.7rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
                                Finished: {new Date(order.served_at || order.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}



