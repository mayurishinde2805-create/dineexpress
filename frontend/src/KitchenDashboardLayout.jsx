import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./adminDashboard.css";
import "./kitchenLayout.css";

export default function KitchenDashboardLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
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
        { id: "overview", name: "Live Orders", icon: "🍳", path: "/kitchen/overview" },
        { id: "past", name: "Order History", icon: "📜", path: "/kitchen/history" },
        { id: "inventory", name: "Kitchen Status", icon: "📊", path: "/kitchen/status" },
        { id: "settings", name: "Settings", icon: "⚙️", path: "/kitchen/settings" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("kitchenToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/kitchen/login");
    };

    return (
        <div className="admin-layout kitchen-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header" style={{ background: '#7c3aed' }}> {/* Purple theme for kitchen */}
                    <h2>{sidebarCollapsed ? "KD" : "Kitchen"}</h2>
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
                        {menuItems.find((item) => item.path === location.pathname)?.name || "Kitchen Dashboard"}
                    </h1>
                    <div className="topbar-actions">
                        <div
                            ref={profileRef}
                            className="admin-user"
                            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                            onClick={() => setShowProfile(!showProfile)}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontWeight: '800', color: '#fff', fontSize: '0.95rem' }}>
                                    {user.name || "Chef"}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: '600', textTransform: 'uppercase' }}>
                                    {user.role || "Kitchen"} Staff
                                </span>
                            </div>
                            <div className="avatar-circle" style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                👨‍🍳
                            </div>

                            {showProfile && (
                                <div className="premium-kitchen-profile">
                                    <div className="profile-header-premium">
                                        <div className="avatar-large-neon">👨‍🍳</div>
                                        <div className="profile-title-premium">Chef Profile</div>
                                    </div>

                                    <div className="profile-details-list">
                                        <div className="detail-row-premium">
                                            <div className="detail-icon-glass">👤</div>
                                            <div className="detail-content-premium">
                                                <span className="detail-label-premium">Name</span>
                                                <span className="detail-value-premium">{user.name || "N/A"}</span>
                                            </div>
                                        </div>

                                        <div className="detail-row-premium">
                                            <div className="detail-icon-glass">🔑</div>
                                            <div className="detail-content-premium">
                                                <span className="detail-label-premium">Kitchen Code</span>
                                                <span className="detail-value-premium">{user.kitchen_code || "KDS-MAIN"}</span>
                                            </div>
                                        </div>

                                        <div className="detail-row-premium">
                                            <div className="detail-icon-glass">🛡️</div>
                                            <div className="detail-content-premium">
                                                <span className="detail-label-premium">Access Level</span>
                                                <span className="detail-value-premium">Senior Chef</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="logout-btn-premium" onClick={handleLogout}>
                                        <span>🚪 Sign Out</span>
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
