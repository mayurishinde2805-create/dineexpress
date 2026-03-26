import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./counterDashboard.css";
import { useLanguage } from "./context/LanguageContext";

const socket = io(API_BASE_URL);

export default function CounterDashboard() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("all"); // all, pending_payment, paid
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { language } = useLanguage();

    const parseItems = (items) => {
        if (!items) return [];
        if (typeof items === 'string') {
            try {
                return JSON.parse(items);
            } catch (e) {
                return [];
            }
        }
        return items;
    };

    useEffect(() => {
        fetchOrders();

        socket.on("statusUpdated", (updatedOrder) => {
            // Refresh orders when status updates
            fetchOrders();
        });

        socket.on("newOrder", (newOrder) => {
            fetchOrders();
        });

        return () => {
            socket.off("statusUpdated");
            socket.off("newOrder");
        };
    }, [language]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(API_BASE_URL + "/api/orders", { params: { lang: language } });
            // Sort by Pending Payment first
            const sorted = res.data.sort((a, b) => {
                if (a.payment_status === "Pending" && b.payment_status !== "Pending") return -1;
                if (a.payment_status !== "Pending" && b.payment_status === "Pending") return 1;
                return new Date(b.created_at) - new Date(a.created_at);
            });
            setOrders(sorted);
        } catch (err) {
            console.error(err);
        }
    };

    const updatePaymentStatus = async (orderId, status) => {
        try {
            if (status === "Paid") {
                await axios.post(`${API_BASE_URL}/api/orders/confirm-cash`, {
                    orderId: orderId
                });
            }
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const generateBill = (order) => {
        const billContent = `
      DineExpress - Bill Receipt
      --------------------------
      Order ID: #${order.id}
      Table: ${order.table_number || "N/A"}
      Date: ${new Date().toLocaleString()}
      
      Items:
      ${parseItems(order.items).map(item =>
            `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
        ).join("\n")}
      
      --------------------------
      Total Amount: ₹${order.total_amount}
      Payment Mode: ${order.payment_mode || "Cash"}
      Status: ${order.payment_status || "Pending"}
      --------------------------
      Thank you for dining with us!
    `;

        // Simple mock print/download
        const blob = new Blob([billContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Bill-Order-${order.id}.txt`;
        link.click();
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        if (filter === "pending_payment") return order.payment_status === "Pending";
        if (filter === "paid") return order.payment_status === "Paid";
        return true;
    });

    return (
        <div className="counter-dashboard">
            <div className="counter-header">
                <h2>🧾 Counter Dashboard</h2>
                <div className="counter-stats">
                    <div className="stat-box pending">
                        <span>Pending Payment</span>
                        <strong>{orders.filter(o => o.payment_status === "Pending").length}</strong>
                    </div>
                    <div className="stat-box cash">
                        <span>Cash Collected</span>
                        <strong>₹{orders.filter(o => o.payment_status === "Paid" && o.payment_mode === "Cash").reduce((sum, o) => sum + parseFloat(o.total_amount), 0)}</strong>
                    </div>
                </div>
            </div>

            <div className="counter-controls">
                <button
                    className={`filter-tab ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All Orders
                </button>
                <button
                    className={`filter-tab ${filter === "pending_payment" ? "active" : ""}`}
                    onClick={() => setFilter("pending_payment")}
                >
                    ⏳ Pending Payment
                </button>
                <button
                    className={`filter-tab ${filter === "paid" ? "active" : ""}`}
                    onClick={() => setFilter("paid")}
                >
                    ✅ Paid History
                </button>
            </div>

            <div className="orders-list">
                {filteredOrders.map((order) => (
                    <div key={order.id} className={`counter-order-card ${order.payment_status === "Pending" ? "pending-glow" : ""}`}>
                        <div className="card-top">
                            <div className="card-id-info">
                                <div className="card-id"><span className="hash">#</span>{order.id}</div>
                                <div className="card-cust-name" style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '2px' }}>
                                    {order.customer_name || "Guest"}
                                </div>
                            </div>
                            <div className="card-table-info" style={{ textAlign: 'right' }}>
                                <div className="card-table">Table {order.table_no || "N/A"}</div>
                                <div className="card-cust-mobile" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {order.customer_mobile || ""}
                                </div>
                            </div>
                        </div>

                        <div className="card-items">
                            {parseItems(order.items).map((item, idx) => (
                                <div key={idx} className="item-row">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="card-total">
                            <span>Total Bill</span>
                            <strong>₹{order.total_amount}</strong>
                        </div>

                        <div className="card-status-row">
                            <div className="status-pill status-order">
                                {order.status}
                            </div>
                            <div className={`status-pill status-payment ${order.payment_status}`}>
                                {order.payment_status || "Pending"}
                            </div>
                        </div>

                        <div className="card-actions">
                            {order.payment_status !== "Paid" ? (
                                <button
                                    className="pay-btn"
                                    onClick={() => updatePaymentStatus(order.id, "Paid")}
                                >
                                    💵 Mark Paid (Cash)
                                </button>
                            ) : (
                                <button
                                    className="bill-btn"
                                    onClick={() => generateBill(order)}
                                >
                                    📄 Print Bill
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
