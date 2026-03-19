import React, { useState, useEffect } from "react";
import axios from "axios";
import "./menu.css";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("menu");
    const [menuItems, setMenuItems] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        revenue: 0,
        expenses: 0,
        activeTables: 0,
        pendingOrders: 0
    });
    const [dailyPopular, setDailyPopular] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        id: null, name: "", description: "", price: "", category: "Main Course", sub_category: "", image_url: "", variants: []
    });

    useEffect(() => {
        if (activeTab === "menu") fetchMenu();
        if (activeTab === "analytics") fetchStats();
    }, [activeTab]);

    const fetchMenu = () => {
        axios.get("http://192.168.1.113:4000/api/menu/all").then(res => setMenuItems(res.data));
    };

    const fetchStats = async () => {
        try {
            // Fetch Dashboard Grid Stats
            const statsRes = await axios.get("http://192.168.1.113:4000/api/admin/analytics/stats");
            setStats({
                totalOrders: statsRes.data.todayOrders,
                revenue: statsRes.data.todayRevenue,
                expenses: statsRes.data.todayExpenses,
                activeTables: statsRes.data.activeTables,
                pendingOrders: statsRes.data.pendingOrders
            });

            // Fetch Daily Popular Items
            const popRes = await axios.get("http://192.168.1.113:4000/api/admin/analytics/popular?period=daily");
            setDailyPopular(popRes.data);

        } catch (err) {
            console.error("Error fetching analytics:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = formData.id ? "update" : "add";
        try {
            await axios.post(`http://192.168.1.113:4000/api/menu/${endpoint}`, formData);
            alert(`Item ${formData.id ? "Updated" : "Added"}!`);
            fetchMenu();
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Operation Failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.post("http://192.168.1.113:4000/api/menu/delete", { id });
            fetchMenu();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            sub_category: item.sub_category || "",
            image_url: item.image_url || "",
            variants: item.variants || []
        });
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setFormData({ id: null, name: "", description: "", price: "", category: "Main Course", sub_category: "", image_url: "", variants: [] });
    };

    return (
        <div className="menu-container">
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>🛠️ Admin Dashboard</h1>

            <div className="category-scroll">
                <button className={`cat-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu Management</button>
                <button className={`cat-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
            </div>

            {activeTab === "menu" && (
                <div style={{ padding: "20px" }}>
                    <div className="admin-form" style={{ background: "white", padding: "20px", borderRadius: "15px", marginBottom: "30px" }}>
                        <h3>{formData.id ? "Edit Item" : "Add New Item"}</h3>
                        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <input name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} required />
                            <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleInputChange} required />
                            <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
                            <input name="sub_category" placeholder="Sub Category" value={formData.sub_category} onChange={handleInputChange} />
                            <input name="image_url" placeholder="Image URL / Filename" value={formData.image_url} onChange={handleInputChange} style={{ gridColumn: "1/-1" }} />
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ gridColumn: "1/-1", height: "80px" }} />

                            <button type="button" onClick={resetForm} style={{ background: "#636e72", color: "white", padding: "10px", border: "none", borderRadius: "8px" }}>Cancel</button>
                            <button type="submit" className="add-btn-large" style={{ width: "100%", padding: "10px" }}>{formData.id ? "Update Item" : "Add Item"}</button>
                        </form>
                    </div>

                    <div className="items-grid">
                        {menuItems.map(item => (
                            <div key={item.id} className="item-card">
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>₹{item.price}</p>
                                    <div style={{ marginTop: "10px" }}>
                                        <button onClick={() => handleEdit(item)} style={{ marginRight: "10px", padding: "5px 10px", background: "#0984e3", color: "white", border: "none", borderRadius: "5px" }}>Edit</button>
                                        <button onClick={() => handleDelete(item.id)} style={{ padding: "5px 10px", background: "#d63031", color: "white", border: "none", borderRadius: "5px" }}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "analytics" && (
                <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                    {/* Stats Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center" }}>
                            <h3 style={{ color: "#7f8c8d", fontSize: "1rem" }}>Today's Orders</h3>
                            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2d3436" }}>{stats.totalOrders}</div>
                        </div>
                        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center" }}>
                            <h3 style={{ color: "#7f8c8d", fontSize: "1rem" }}>Revenue</h3>
                            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#27ae60" }}>₹{stats.revenue.toLocaleString()}</div>
                        </div>
                        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center" }}>
                            <h3 style={{ color: "#7f8c8d", fontSize: "1rem" }}>Expenses (Est.)</h3>
                            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#e17055" }}>₹{stats.expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center" }}>
                            <h3 style={{ color: "#7f8c8d", fontSize: "1rem" }}>Net Profit</h3>
                            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0984e3" }}>₹{(stats.revenue - stats.expenses).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        {/* Daily Top Items */}
                        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                            <h3 style={{ marginBottom: "20px", borderBottom: "2px solid #f1f2f6", paddingBottom: "10px" }}>🔥 Today's Top Items</h3>
                            {dailyPopular.length === 0 ? (
                                <p style={{ color: "#b2bec3", textAlign: "center", padding: "20px" }}>No orders yet today.</p>
                            ) : (
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {dailyPopular.map((item, index) => (
                                        <li key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f2f6" }}>
                                            <span style={{ fontWeight: "500" }}>{index + 1}. {item.name}</span>
                                            <span style={{ background: "#daf0ff", color: "#0984e3", padding: "2px 8px", borderRadius: "50px", fontSize: "0.9rem", fontWeight: "bold" }}>
                                                {item.orders} Sold
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Status Overview */}
                        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                            <h3 style={{ marginBottom: "20px", borderBottom: "2px solid #f1f2f6", paddingBottom: "10px" }}>📊 Live Status</h3>
                            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "30px" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e67e22" }}>{stats.activeTables}</div>
                                    <div style={{ color: "#7f8c8d" }}>Active Tables</div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#6c5ce7" }}>{stats.pendingOrders}</div>
                                    <div style={{ color: "#7f8c8d" }}>Pending Orders</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
