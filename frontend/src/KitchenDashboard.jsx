import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./kitchenDashboard.css";

const socket = io(API_BASE_URL);

// Import useLanguage
import { useLanguage } from "./context/LanguageContext";

export default function KitchenDashboard() {
    const [orders, setOrders] = useState([]);
    const [user] = useState(() => ( (() => { try { return ( (() => { try { const val = localStorage.getItem("user"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() ) || JSON.parse("{}"); } catch(e) { return JSON.parse("{}"); } })() ));
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = React.useRef(null);
    const { language } = useLanguage();

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchActiveOrders();

        socket.on("newOrder", () => {
            fetchActiveOrders();
        });

        socket.on("statusUpdated", () => {
            fetchActiveOrders();
        });

        socket.on("orderCancelled", () => {
            fetchActiveOrders();
        });

        return () => {
            socket.off("newOrder");
            socket.off("statusUpdated");
            socket.off("orderCancelled");
        };
    }, [language]); // Add language dependency

    const fetchActiveOrders = async () => {
        try {
            // Corrected API route
            const res = await axios.get(API_BASE_URL + "/api/orders/kitchen", { params: { lang: language } });
            // Filter is usually done in backend now, but safe to keep or remove. 
            // Backend `getKitchenOrders` filters for Paid + Active.
            // Frontend filter here was: New, Preparing, Pending, Ready.
            // Backend returns: Paid & != Served.
            // So we can assume `res.data` is correct list.
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                status: newStatus,
            });
            fetchActiveOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        window.location.href = "/kitchen/login";
    };

    return (
        <div className="kitchen-dashboard">
            <div className="kitchen-header">
                <div>
                    <h2>👨‍🍳 Kitchen Display System (KDS)</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="kitchen-stats">
                        <div className="k-stat">
                            <span>Pending</span>
                            <strong>{orders.filter(o => o.status === "Pending" || o.status === "New").length}</strong>
                        </div>
                        <div className="k-stat">
                            <span>Preparing</span>
                            <strong>{orders.filter(o => o.status === "Preparing").length}</strong>
                        </div>
                    </div>

                    <div
                        ref={profileRef}
                        className="kitchen-user"
                        style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '30px' }}
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>{user.fullname || "Kitchen Staff"}</span>
                        </div>
                        <div className="avatar-circle" style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            🍳
                        </div>

                        {showProfile && (
                            <div className="profile-dropdown" style={{
                                position: 'absolute',
                                top: '120%',
                                right: 0,
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '12px',
                                padding: '15px',
                                width: '250px',
                                zIndex: 1000,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                color: '#fff'
                            }}>
                                <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Kitchen Profile</h4>
                                <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Name:</strong> {user.fullname || "N/A"}</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Email:</strong> {user.email || "N/A"}</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Phone:</strong> {user.mobile || "N/A"}</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Code:</strong> {user.kitchen_code || "N/A"}</p>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        marginTop: '10px',
                                        background: '#ef4444',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
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
                                <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>👤 {order.customer_name || "Guest"}</div>
                            </div>

                            <div className="k-items">
                                {JSON.parse(order.items || "[]").map((item, idx) => (
                                    <div key={idx} className="k-item">
                                        <span className="k-qty">{item.quantity}x</span>
                                        <span className="k-name">{item.name} {item.variant}</span>
                                        {item.special_request && <div className="k-note">📝 {item.special_request}</div>}
                                    </div>
                                ))}
                            </div>

                            <div className="k-actions">
                                {(order.status === "Pending" || order.status === "New") && (
                                    <button
                                        className="k-btn start"
                                        onClick={() => updateStatus(order.id, "Preparing")}
                                    >
                                        🔥 Start Cooking
                                    </button>
                                )}
                                {order.status === "Preparing" && (
                                    <button
                                        className="k-btn ready"
                                        onClick={() => updateStatus(order.id, "Ready")}
                                    >
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
    );
}
