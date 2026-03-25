import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./categoryPage.css";
import CraveBot from "./CraveBot";
import { useLanguage } from "./context/LanguageContext";
import API_BASE_URL from "./apiConfig";

export default function CategoryPage() {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [subCategories, setSubCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    const categoryMap = {
        "starters": {
            img: "/images/category/starters.png",
            description: t("discovery_menu"),
            label: "Starters"
        },
        "main-menu": {
            img: "/images/category/main-menu.png",
            description: t("premium_experience"),
            label: "Main Menu"
        },
        "desserts": {
            img: "/images/category/desserts.png",
            description: t("sweet_indulgence"),
            label: "Desserts"
        },
        "drinks": {
            img: "/images/category/drinks.png",
            description: t("refreshing_collection"),
            label: "Drinks"
        }
    };

    const currentCatInfo = categoryMap[categoryName] || { img: "", description: "" };

    // Helper to generate full image URL
    const getFullImageUrl = (path) => {
        if (!path) return "https://source.unsplash.com/400x300/?food";
        if (path.startsWith('http')) return path;
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE_URL}${normalizedPath}`;
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/menu/all`, { params: { lang: language } })
            .then(res => {
                const catLabel = (categoryMap[categoryName]?.label || "Starters").toLowerCase();
                const allItems = Array.isArray(res.data) ? res.data : [];

                const items = allItems.filter(item => {
                    const itemCat = (item.category_en || item.category || "").trim().toLowerCase();
                    // Match if itemCat is same, or if one is singular/plural variant
                    return itemCat === catLabel || 
                           itemCat.includes(catLabel.slice(0,-1)) || 
                           catLabel.includes(itemCat.slice(0,-1));
                });
                setMenuItems(items);

                const subsMap = new Map();
                items.forEach(item => {
                    const subKey = item.sub_category || "General";
                    if (!subsMap.has(subKey)) {
                        subsMap.set(subKey, {
                            original: item.sub_category_en || subKey,
                            display: item.sub_category || subKey
                        });
                    }
                });
                setSubCategories(Array.from(subsMap.values()));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [categoryName, language]);

    return (
        <div className="cat-v2-container">
            {/* Header */}
            <header className="cat-v2-header">
                <button className="back-pill" onClick={() => navigate("/home")}>← {t("back")}</button>
                <div className="v2-brand">DineExpress <span>{t("premium_tag")}</span></div>
                <div className="v2-header-right">
                    <button className="dashboard-pill" onClick={() => navigate("/customer/dashboard")}>👤 {t("profile")}</button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="cat-hero-v3" style={{ backgroundImage: `linear-gradient(to bottom, rgba(10, 28, 21, 0.4), #0a1c15), url(${getFullImageUrl(currentCatInfo.img)})` }}>
                <div className="cat-hero-content-v3">
                    <span className="hero-eyebrow">{t("exquisite_collections")}</span>
                    <h1>{t(categoryName.replace("-", "_")) || categoryName}</h1>
                    {/* Using simple mapping for Hero title, e.g. starters -> t(starters) */}
                    <p>{currentCatInfo.description}</p>
                </div>
            </div>

            {/* Sub-Category Gallery */}
            <main className="subcat-gallery">
                <div className="gallery-header">
                    <h2>{t("explore_collection")}</h2>
                    <div className="gold-line"></div>
                </div>

                <div className="subcat-grid-v3">
                    {loading ? (
                        <div className="v2-loader">
                            <div className="spinner-gold"></div>
                            <p>{t("curating_experience")}</p>
                        </div>
                    ) : subCategories.length === 0 ? (
                        <div className="v2-empty">{t("no_sub_categories")}</div>
                    ) : (
                        subCategories.map((sub, idx) => {
                            // Find an item sample for image
                            const subItem = menuItems.find(i => i.sub_category === sub.original && i.image_url);
                            const bgImage = subItem ? subItem.image_url : currentCatInfo.img;

                            return (
                                <div
                                    key={idx}
                                    className="sub-card-v3"
                                    onClick={() => navigate(`/items/${categoryName}/${encodeURIComponent(sub.original)}`)}
                                    style={{
                                        backgroundImage: `linear-gradient(to bottom, rgba(10, 28, 21, 0.1), rgba(10, 28, 21, 0.9)), url(${getFullImageUrl(subItem?.image_url || currentCatInfo.img)})`
                                    }}
                                >
                                    <div className="sub-card-content">
                                        <h3>{sub.display}</h3>
                                        <div className="sub-footer">
                                            <span>{t("explore_collection")}</span>
                                            <span className="arrow">→</span>
                                        </div>
                                    </div>
                                    <div className="card-glimmer"></div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            <CraveBot menuItems={menuItems} onSelectItem={(item) => navigate(`/items/${categoryName}/${encodeURIComponent(item.sub_category)}`)} />

            <footer className="home-footer-v2">
                <p>&copy; 2026 DineExpress {t("premium_tag")} • {t("premium_experience")}</p>
            </footer>
        </div>
    );
}

