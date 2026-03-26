import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import "./kitchenAnalytics.css";

export default function KitchenAnalytics() {
    const [statusData, setStatusData] = useState([]);
    const [stats, setStats] = useState({
        pending: 0,
        preparing: 0,
        ready: 0,
        avgPrepTime: "12m" // Mocked for now
    });

    useEffect(() => {
        fetchKitchenStats();
        const interval = setInterval(fetchKitchenStats, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchKitchenStats = async () => {
        try {
            const statusRes = await axios.get(API_BASE_URL + "/api/admin/analytics/status");
            const data = statusRes.data || [];
            setStatusData(data);

            const pending = data.find(d => d.name === "Placed" || d.name === "Pending")?.value || 0;
            const preparing = data.find(d => d.name === "Preparing")?.value || 0;
            const ready = data.find(d => d.name === "Ready")?.value || 0;

            setStats(prev => ({
                ...prev,
                pending,
                preparing,
                ready
            }));
        } catch (err) {
            console.error("Error fetching kitchen analytics:", err);
        }
    };

    const COLORS = ["#fbbf24", "#f97316", "#10b981", "#3b82f6", "#ef4444"];

    return (
        <div className="kitchen-analytics-container">
            <header className="ka-header">
                <h2>Kitchen Performance Insights</h2>
                <p>Real-time order throughput and kitchen load.</p>
            </header>

            <div className="ka-stats-summary">
                <div className="ka-stat-card gold">
                    <span>Active Orders</span>
                    <h3>{stats.pending + stats.preparing}</h3>
                </div>
                <div className="ka-stat-card orange">
                    <span>In Preparation</span>
                    <h3>{stats.preparing}</h3>
                </div>
                <div className="ka-stat-card green">
                    <span>Ready for Service</span>
                    <h3>{stats.ready}</h3>
                </div>
                <div className="ka-stat-card blue">
                    <span>Est. Prep Time</span>
                    <h3>{stats.avgPrepTime}</h3>
                </div>
            </div>

            <div className="ka-charts-grid">
                <div className="ka-chart-card">
                    <h3>Load Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
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

                <div className="ka-chart-card">
                    <h3>Hourly Throughput (Simulated)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { hour: '12 PM', orders: 12 },
                            { hour: '1 PM', orders: 25 },
                            { hour: '2 PM', orders: 18 },
                            { hour: '3 PM', orders: 5 },
                            { hour: '6 PM', orders: 15 },
                            { hour: '7 PM', orders: 32 },
                            { hour: '8 PM', orders: 28 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="hour" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155" }} />
                            <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
