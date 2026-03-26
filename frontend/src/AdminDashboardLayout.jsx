import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./adminDashboard.css";

export default function AdminDashboardLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [user] = useState(() => ( (() => { try { return ( (() => { try { const val = localStorage.getItem("user"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() ) || JSON.parse("{}"); } catch(e) { return JSON.parse("{}"); } })() ));
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = React.useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Close on click outside
    React.useEffect(() => {
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

    const menuItems = [
        { id: "dashboard", name: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
        { id: "counter", name: "Counter (Cash)", icon: "💰", path: "/admin/counter" },
        { id: "menu", name: "Menu Management", icon: "🍽️", path: "/admin/menu" },
        { id: "orders", name: "Orders", icon: "📦", path: "/admin/orders" },
        { id: "tables", name: "Tables & QR", icon: "🪑", path: "/admin/tables" },
        { id: "customers", name: "Customers", icon: "👤", path: "/admin/customers" },
        { id: "feedback", name: "Feedback", icon: "💬", path: "/admin/feedback" },
        { id: "analytics", name: "Analytics", icon: "📊", path: "/admin/analytics" },
        { id: "settings", name: "Settings", icon: "⚙️", path: "/admin/settings" },
        { id: "kitchen-view", name: "Kitchen View", icon: "🍳", path: "/kitchen" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/admin/login");
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <h2>{sidebarCollapsed ? "DE" : "DineExpress"}</h2>
                    <button
                        className="collapse-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? "→" : "←"}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                            title={sidebarCollapsed ? item.name : ""}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="nav-text">{item.name}</span>}
                        </button>
                    ))}
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    {!sidebarCollapsed && <span className="nav-text">Logout</span>}
                </button>
            </aside>

            {/* Main Content */}
            <main className={`admin-main ${sidebarCollapsed ? "expanded" : ""}`}>
                <div className="admin-topbar">
                    <h1 className="page-title">
                        {menuItems.find((item) => item.path === location.pathname)?.name || "Dashboard"}
                    </h1>
                    <div className="topbar-actions">
                        <div
                            ref={profileRef}
                            className="admin-user"
                            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                            onClick={() => setShowProfile(!showProfile)}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontWeight: 'bold' }}>{user.fullname || "Admin"}</span>
                                <span style={{ fontSize: '0.8em', color: '#ccc' }}>{user.role || "Administrator"}</span>
                            </div>
                            <div className="avatar-circle" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                👤
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
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                }}>
                                    <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>Profile Details</h4>
                                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Name:</strong> {user.fullname || "N/A"}</p>
                                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Email:</strong> {user.email || "N/A"}</p>
                                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Mobile:</strong> {user.mobile || "N/A"}</p>
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

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
