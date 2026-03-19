import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "./adminAnalytics.css";

export default function AdminAnalytics() {
    const [period, setPeriod] = useState("daily"); // daily, weekly, monthly
    const [salesData, setSalesData] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [dietData, setDietData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            const salesRes = await axios.get(`http://192.168.1.113:4000/api/admin/analytics/sales?period=${period}`);
            setSalesData(salesRes.data || []);

            const itemsRes = await axios.get("http://192.168.1.113:4000/api/admin/analytics/popular");
            setPopularItems(itemsRes.data || []);

            const dietRes = await axios.get("http://192.168.1.113:4000/api/admin/analytics/diet");
            setDietData(dietRes.data || []);

            const statusRes = await axios.get("http://192.168.1.113:4000/api/admin/analytics/status");
            setStatusData(statusRes.data || []);
        } catch (err) {
            console.error("Analytics fetch error", err);
        }
    };

    const COLORS = ["#4ade80", "#f97316", "#fbbf24", "#ef4444", "#3b82f6"];

    return (
        <div className="admin-analytics">
            <div className="analytics-header">
                <h2>Analytics & Reports</h2>
                <div className="period-selector">
                    {["daily", "weekly", "monthly"].map((p) => (
                        <button
                            key={p}
                            className={`period-btn ${period === p ? "active" : ""}`}
                            onClick={() => setPeriod(p)}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="charts-grid">
                {/* Status Chart */}
                <div className="chart-card">
                    <h3>Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales Chart */}
                <div className="chart-card">
                    <h3>Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={3} dot={{ r: 4 }} name="Revenue (₹)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Popular Items */}
                <div className="chart-card">
                    <h3>Top Ordered Items</h3>
                    <div className="popular-items-list">
                        {popularItems.map((item, index) => (
                            <div key={index} className="popular-item">
                                <span className="item-rank">#{index + 1}</span>
                                <span className="item-name">{item.name}</span>
                                <span className="item-orders">{item.orders} Sold</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Diet Stats */}
                <div className="chart-card">
                    <h3>Dietary Preferences</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dietData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {dietData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
