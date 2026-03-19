import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import CraveBot from "./CraveBot";
import { useLanguage } from "./context/LanguageContext";
import heroBg from "./assets/bg.jpg"; // Re-using the beautiful dining background
import API_BASE_URL from "./apiConfig";

export default function Home() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const categories = [
        {
            id: "starters",
            name: t("starters"),
            icon: "🥗",
            image: "/images/category/starters.png",
            description: t("discovery_menu"),
        },
        {
            id: "main-menu",
            name: t("main_menu"),
            icon: "🍽️",
            image: "/images/category/main-menu.png",
            description: t("premium_experience"),
        },
        {
            id: "desserts",
            name: t("desserts"),
            icon: "🍰",
            image: "/images/category/desserts.png",
            description: t("sweet_indulgence"),
        },
        {
            id: "drinks",
            name: t("drinks"),
            icon: "🥤",
            image: "/images/category/drinks.png",
            description: t("refreshing_collection"),
        },
    ];

    return (
        <div className="home-v2-container">
            {/* Premium Header */}
            <header className="home-header-v2">
                <div className="v2-brand">DineExpress <span>Premium</span></div>
                <div className="v2-actions">
                    <button className="dashboard-pill" onClick={() => navigate("/customer/dashboard")}>👤 {t("dashboard")}</button>
                </div>
            </header>

            {/* Premium Hero */}
            <section className="home-hero-v3" style={{ backgroundImage: `url(${heroBg})` }}>
                <div className="hero-overlay-v3"></div>
                <div className="hero-content-v3">
                    <h1>{t("premium_experience")}</h1>
                    <p>{t("explore_collection")}</p>
                    <div className="hero-button-group">
                        <button className="hero-cta-btn" onClick={() => navigate("/menu")}>{t("view_menu")}</button>
                        <button className="hero-cta-btn secondary" onClick={() => navigate("/gallery-3d")}>🌀 3D Experience</button>
                    </div>
                </div>
            </section>

            {/* Category Grid */}
            <main className="category-grid-v2">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="cat-card-v2"
                        onClick={() => navigate(`/category/${cat.id}`)}
                        style={{
                            backgroundImage: `url(${API_BASE_URL}${cat.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="cat-overlay-v2"></div>
                        <div className="cat-badge-v2">{cat.icon}</div>
                        <div className="cat-info-v2">
                            <h3>{cat.name}</h3>
                            <p>{cat.description}</p>
                        </div>
                        <div className="cat-hover-v2">{t("explore_collection")} →</div>
                    </div>
                ))}
            </main>

            {/* CraveBot Integration */}
            <CraveBot menuItems={[]} onSelectItem={(item) => navigate("/menu")} />

            <footer className="home-footer-v2">
                <p>&copy; 2026 DineExpress Premium • Scan. Order. Enjoy.</p>
            </footer>
        </div>
    );
}
