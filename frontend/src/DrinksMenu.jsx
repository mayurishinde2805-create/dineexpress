import React, { useState, useEffect } from "react";
import axios from "axios";
import "./drinksMenu.css";

const drinksCategories = [
    {
        category: "Hot Tea",
        icon: "☕",
        sub: ["Classic", "Flavored", "Herbal"],
    },
    {
        category: "Hot Coffee",
        icon: "☕",
        sub: ["Classic", "Milk-based", "Special flavors"],
    },
    {
        category: "Iced Coffee",
        icon: "🧊",
        sub: ["Classic", "Creamy", "Flavored"],
    },
    {
        category: "Iced Tea",
        icon: "🍹",
        sub: ["Classic", "Fruity", "Herbal"],
    },
    {
        category: "Milkshakes",
        icon: "🥤",
        sub: ["Classic", "Thick", "Fruit"],
    },
    {
        category: "Mocktails",
        icon: "🍹",
        sub: ["Citrus", "Fruit", "Refreshing"],
    },
    {
        category: "Fresh Juices",
        icon: "🧃",
        sub: ["Citrus", "Fruit", "Mixed"],
    },
    {
        category: "Traditional & Health Drinks",
        icon: "🥥",
        sub: ["Indian Drinks", "Healthy Drinks"],
    },
    {
        category: "Soft Drinks & Energy Drinks",
        icon: "🥤",
        sub: ["Carbonated", "Energy Drinks"],
    },
];

export default function DrinksMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Hot Tea");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    useEffect(() => {
        axios
            .get("http://192.168.1.113:4000/api/menu/all")
            .then((res) => {
                const drinks = res.data.filter(
                    (item) => item.category?.toLowerCase() === "drinks"
                );
                setMenuItems(drinks);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const currentCategoryData = drinksCategories.find(
        (c) => c.category === selectedCategory
    );

    const getFilteredItems = () => {
        return menuItems.filter((item) => {
            const itemSubCat = (item.sub_category || "").trim().toLowerCase();
            const selectedCat = selectedCategory.toLowerCase();
            const selectedSub = selectedSubCategory.toLowerCase();

            // Match category
            const categoryMatch = itemSubCat.includes(selectedCat.split(" ")[0]);

            // If sub-category is selected, match it
            if (selectedSub) {
                return categoryMatch && itemSubCat.includes(selectedSub);
            }

            return categoryMatch;
        });
    };

    const currentItems = getFilteredItems();

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setSelectedSubCategory("");
    };

    return (
        <div className="drinks-container">
            <header className="drinks-header">
                <h1 className="drinks-logo">☕ Drinks Menu</h1>
            </header>

            {/* Tier 1: Category Tabs */}
            <nav className="drinks-tabs">
                {drinksCategories.map((c) => (
                    <button
                        key={c.category}
                        className={`drinks-tab ${c.category === selectedCategory ? "active" : ""
                            }`}
                        onClick={() => handleCategoryChange(c.category)}
                    >
                        <span className="tab-icon">{c.icon}</span>
                        <span className="tab-text">{c.category}</span>
                    </button>
                ))}
            </nav>

            {/* Tier 2: Sub-category Pills */}
            {currentCategoryData?.sub && currentCategoryData.sub.length > 0 && (
                <div className="sub-pills-container">
                    <div className="sub-pills">
                        <button
                            className={`pill ${!selectedSubCategory ? "active" : ""}`}
                            onClick={() => setSelectedSubCategory("")}
                        >
                            All
                        </button>
                        {currentCategoryData.sub.map((s) => (
                            <button
                                key={s}
                                className={`pill ${s === selectedSubCategory ? "active" : ""}`}
                                onClick={() => setSelectedSubCategory(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tier 3: Drinks Grid */}
            <main className="drinks-grid">
                {loading ? (
                    <div className="drinks-loading">
                        <div className="loading-spinner">⌛</div>
                        <p>Loading drinks...</p>
                    </div>
                ) : currentItems.length === 0 ? (
                    <div className="drinks-empty">
                        <div className="empty-icon">🍹</div>
                        <p>No drinks found in this category</p>
                    </div>
                ) : (
                    currentItems.map((item) => {
                        const imgSrc =
                            item.image_url ||
                            `https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80`;

                        return (
                            <div key={item.id} className="drink-card">
                                <div className="drink-img-wrapper">
                                    <img
                                        src={imgSrc}
                                        alt={item.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80";
                                        }}
                                    />
                                    {item.diet === "veg" && (
                                        <div className="diet-badge veg">🟢</div>
                                    )}
                                </div>
                                <div className="drink-info">
                                    <h4 className="drink-name">{item.name}</h4>
                                    {item.description && (
                                        <p className="drink-desc">{item.description}</p>
                                    )}
                                    <p className="drink-price">₹{item.price}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
}
