import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminOverview.css";

export default function AdminOverview() {
    const [stats, setStats] = useState({
        todayOrders: 0,
        todayRevenue: 0,
        activeTables: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Correct Endpoint
                const res = await axios.get(API_BASE_URL + "/api/admin/analytics/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            }
        };
        fetchStats();
        // Poll regularly for real-time updates
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const summaryCards = [
        {
            id: "orders",
            title: "Today's Orders",
            value: stats.todayOrders,
            icon: "📦",
            color: "#4ade80",
        },
        {
            id: "revenue",
            title: "Today's Revenue",
            value: `₹${(stats.todayRevenue || 0).toLocaleString()}`,
            icon: "💰",
            color: "#fbbf24",
        },
        {
            id: "tables",
            title: "Active Tables",
            value: stats.activeTables,
            icon: "🟢",
            color: "#22c55e",
        },
        {
            id: "pending",
            title: "Pending Orders",
            value: stats.pendingOrders,
            icon: "⏳",
            color: "#f97316",
        },
    ];

    // Reuse navigate from hook (Wait, I need to add useNavigate!)
    // Assuming imported at top? Yes, checking imports...

    return (
        <div className="admin-overview">
            <div className="summary-grid">
                {summaryCards.map((card, index) => (
                    <div
                        key={card.id}
                        className="summary-card"
                        style={{ "--card-color": card.color, "--delay": `${index * 0.1}s` }}
                    >
                        <div className="card-icon">{card.icon}</div>
                        <div className="card-content">
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-value">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <button className="action-btn" onClick={() => window.location.href = '/admin/menu'}>
                        <span className="action-icon">➕</span>
                        <span>Add Menu Item</span>
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/admin/orders'}>
                        <span className="action-icon">📋</span>
                        <span>View Orders</span>
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/admin/tables'}>
                        <span className="action-icon">🪑</span>
                        <span>Manage Tables</span>
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = '/admin/analytics'}>
                        <span className="action-icon">📊</span>
                        <span>View Analytics</span>
                    </button>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-icon">📦</span>
                        <div className="activity-content">
                            <p className="activity-text">New order from Table 5</p>
                            <span className="activity-time">2 minutes ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">✅</span>
                        <div className="activity-content">
                            <p className="activity-text">Order #1234 completed</p>
                            <span className="activity-time">15 minutes ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <span className="activity-icon">🍽️</span>
                        <div className="activity-content">
                            <p className="activity-text">Menu item "Paneer Tikka" updated</p>
                            <span className="activity-time">1 hour ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
