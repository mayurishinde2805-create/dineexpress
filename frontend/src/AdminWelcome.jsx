import React from "react";
import { useNavigate } from "react-router-dom";
import "./adminWelcome.css";

export default function AdminWelcome() {
    const navigate = useNavigate();

    return (
        <div className="admin-welcome-wrapper">
            <div className="admin-bg-pattern"></div>

            <div className="admin-welcome-content">
                <div className="admin-logo-circle">
                    🛡️
                </div>

                <h1 className="admin-title">DineExpress Admin</h1>
                <p className="admin-subtitle">
                    Secure operational control center. Manage menus, track orders,
                    and analyze performance from a single centralized dashboard.
                </p>

                <div className="admin-action-grid">
                    <div className="admin-action-card" onClick={() => navigate("/admin/login")}>
                        <span className="card-icon">🔐</span>
                        <span className="card-title">Secure Login</span>
                        <span className="card-desc">Access your dashboard via Admin Code</span>
                    </div>

                    <div className="admin-action-card" onClick={() => navigate("/admin/register")}>
                        <span className="card-icon">✨</span>
                        <span className="card-title">Register Access</span>
                        <span className="card-desc">Set up a new administrator account</span>
                    </div>
                </div>

                <div className="admin-footer-badge">
                    <span className="status-dot"></span>
                    System Secure & Operational v2.4
                </div>
            </div>
        </div>
    );
}
