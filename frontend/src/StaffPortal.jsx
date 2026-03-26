import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css"; // Reuse home styles for premium feel
import { useLanguage } from "./context/LanguageContext";

export default function StaffPortal() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const portals = [
        {
            id: "admin",
            name: "Admin Dashboard",
            icon: "🔐",
            path: "/admin/login",
            description: "Manage menu, orders, tables, and analytics.",
            color: "linear-gradient(135deg, #d4af37, #b8860b)"
        },
        {
            id: "kitchen",
            name: "Kitchen Dashboard",
            icon: "🍳",
            path: "/kitchen/login",
            description: "Live order processing and kitchen status.",
            color: "linear-gradient(135deg, #7c3aed, #4c1d95)"
        }
    ];

    return (
        <div className="home-v2-container staff-portal-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
                    DineExpress <span style={{ color: 'var(--accent-green)' }}>Staff Portal</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Please select your workspace to continue.</p>
            </header>

            <div className="portal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', width: '90%', maxWidth: '900px' }}>
                {portals.map((portal) => (
                    <div
                        key={portal.id}
                        className="cat-card-v2"
                        onClick={() => navigate(portal.path)}
                        style={{
                            background: portal.color,
                            height: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{portal.icon}</div>
                        <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>{portal.name}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: '1rem' }}>{portal.description}</p>
                        <div className="cat-hover-v2">Enter Workspace →</div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => navigate("/")}
                style={{ 
                    marginTop: '50px', 
                    background: 'transparent', 
                    border: '1px solid #334155', 
                    color: '#94a3b8', 
                    padding: '12px 24px', 
                    borderRadius: '50px', 
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.target.style.borderColor = '#fff'; e.target.style.color = '#fff'; }}
                onMouseOut={(e) => { e.target.style.borderColor = '#334155'; e.target.style.color = '#94a3b8'; }}
            >
                ← Back to Guest View
            </button>
        </div>
    );
}
