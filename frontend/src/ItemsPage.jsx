import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import "./itemsPage.css";
import CraveBot from "./CraveBot";
import { useLanguage } from "./context/LanguageContext";
import ThreeDViewer from "./ThreeDViewer";
import Gourmet3DViewer from "./Gourmet3DViewer";
import API_BASE_URL from "./apiConfig";

const socket = io(API_BASE_URL, { transports: ['websocket'] });

export default function ItemsPage() {
    const { categoryName, subCategoryName } = useParams();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        try {
            const val = localStorage.getItem("cart");
            return val && val !== 'undefined' ? JSON.parse(val) : {};
        } catch (e) {
            return {};
        }
    });
    const [selectedVariants, setSelectedVariants] = useState({});
    const [arDish, setArDish] = useState(null);
    const [viewMode, setViewMode] = useState('3d'); 
    
    // Unified table_no (Check both Home.jsx formats)
    const [tableNo] = useState(() => {
        const raw = localStorage.getItem("table_no") || localStorage.getItem("tableNo") || "1";
        return raw.replace("Table ", "");
    });

    const [loyaltyPoints] = useState(1250);
    const [searchQuery, setSearchQuery] = useState("");

    const categoryMap = {
        "starters": "Starters",
        "main-menu": "Main Menu",
        "desserts": "Desserts",
        "drinks": "Drinks"
    };

    const dbCategory = categoryMap[categoryName];
    const dbSubCategory = subCategoryName ? decodeURIComponent(subCategoryName) : null;

    const getFullImageUrl = (path) => {
        if (!path) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
        if (path.startsWith('http')) return path;
        const normalizedPath = path.startsWith('/') ? path : `/images/${path}`;
        const finalPath = normalizedPath.includes('/images/images/') 
            ? normalizedPath.replace('/images/images/', '/images/') 
            : normalizedPath;
        return `${API_BASE_URL}${finalPath}`;
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/menu/all`, { params: { lang: language } })
            .then(res => {
                const fetchedItems = Array.isArray(res.data) ? res.data : [];
                const filtered = fetchedItems.filter(item => {
                    const itemCat = (item.category_en || item.category || "").trim().toLowerCase();
                    const targetCat = (dbCategory || "").trim().toLowerCase();
                    const itemSub = (item.sub_category_en || item.sub_category || "").trim().toLowerCase();
                    const targetSub = (dbSubCategory || "").trim().toLowerCase();
                    if (!dbSubCategory) return itemCat === targetCat;
                    return itemCat === targetCat && itemSub === targetSub;
                });
                setItems(filtered.length > 0 ? filtered : fetchedItems.filter(i => (i.category_en || i.category || "").trim().toLowerCase() === (dbCategory || "").toLowerCase()));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [dbCategory, dbSubCategory, language]);

    const updateCart = (item, change, variantName = null) => {
        const vName = variantName || selectedVariants[item.id] ||
            (item.variants ? (typeof item.variants === 'string' ? JSON.parse(item.variants)[0].name : item.variants[0].name) : null);
        const cartId = vName ? `${item.id}-${vName}` : item.id;

        setCart(prev => {
            const currentItem = prev[cartId] || {};
            const newQty = (currentItem.quantity || 0) + change;
            let newCart = { ...prev };

            if (newQty <= 0) {
                delete newCart[cartId];
            } else {
                let finalPrice = item.price;
                if (vName && item.variants) {
                    const variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
                    const v = variants.find(v => v.name === vName);
                    if (v) finalPrice = v.price;
                }
                newCart[cartId] = {
                    id: item.id,
                    name: item.display_name || item.name,
                    variant: vName,
                    price: finalPrice,
                    quantity: newQty
                };
            }
            localStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const handleCallWaiter = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/waiter-requests`, { table: tableNo });
            alert(t("waiter_called"));
        } catch (err) {
            alert("Failed to call waiter.");
        }
    };

    const cartItemCount = Object.values(cart || {}).reduce((total, item) => total + (item?.quantity || 0), 0);

    return (
        <div className="items-v3-container">
            <header className="v2-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="back-pill" onClick={() => navigate(`/category/${categoryName}`)}>←</button>
                    <div className="v2-brand">DineExpress <span className="table-tag">T{tableNo}</span></div>
                </div>
                <div className="v2-header-actions">
                    <div className="loyalty-card-mini">🌟 {loyaltyPoints} Pts</div>
                    <div className="v2-cart-icon" onClick={() => navigate("/cart")}>
                        🛍️ <span className="count">{cartItemCount}</span>
                    </div>
                </div>
            </header>

            <section className="items-hero-v3">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>{items[0]?.display_sub_category || t(dbSubCategory) || dbSubCategory}</h1>
                    <p>{t("premium_experience")}</p>
                </div>
            </section>

            <div className="search-container-v2">
                <input
                    type="text"
                    placeholder={t("login_subtitle")}
                    className="search-bar-premium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <main className="items-main">
                <div className="section-title">
                    <h2>{t("discovery_menu")}</h2>
                    <div className="gold-accent-line"></div>
                </div>

                <div className="items-grid-v3">
                    {loading ? (
                        <div className="v3-loader">
                            <div className="spinner-gold"></div>
                            <p>{t("articulating_flavors")}</p>
                        </div>
                    ) : (
                        items.filter(i => (i.display_name || i.name).toLowerCase().includes(searchQuery.toLowerCase())).map(item => {
                            const variantsSource = item.display_variants || item.variants;
                            let variants = [];
                            try { variants = typeof variantsSource === 'string' ? JSON.parse(variantsSource) : (variantsSource || []); } catch (e) {}
                            
                            const currentVariant = selectedVariants[item.id] || (variants.length > 0 ? variants[0].name : null);
                            const currentPrice = (variants.length > 0 && currentVariant) ? variants.find(v => v.name === currentVariant)?.price : item.price;
                            const qty = cart[currentVariant ? `${item.id}-${currentVariant}` : item.id]?.quantity || 0;

                            return (
                                <div key={item.id} className="dish-card-v3">
                                    <div className="dish-img-wrapper">
                                        <img src={getFullImageUrl(item.image_url)} className="dish-img-v3" alt={item.name} />
                                        <span className={`diet-indicator ${item.diet}`}></span>
                                        <div className="v3-small-visual-controls">
                                            <button className="v3-icon-btn-3d" onClick={() => { setViewMode('3d'); setArDish(item); }}>🧊</button>
                                            <button className="v3-icon-btn-ar" onClick={() => { setViewMode('ar'); setArDish(item); setTimeout(() => document.querySelector('model-viewer')?.activateAR(), 500); }}>🧿</button>
                                        </div>
                                    </div>
                                    <div className="dish-details-v3">
                                        <div className="dish-header-v3">
                                            <h3>{item.display_name || item.name}</h3>
                                            <span className="dish-price-v3">₹{currentPrice}</span>
                                        </div>
                                        <p className="dish-desc-v3">{item.display_description || item.description || t("premium_experience")}</p>
                                        {variants.length > 0 && (
                                            <div className="variant-selector-v3">
                                                {variants.map(v => (
                                                    <button key={v.name} className={`variant-btn-v3 ${currentVariant === v.name ? 'active' : ''}`} onClick={() => setSelectedVariants(prev => ({ ...prev, [item.id]: v.name }))}>{v.name}</button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="dish-footer-v3">
                                            {qty === 0 ? (
                                                <button className="add-to-cart-premium" onClick={() => updateCart(item, 1, currentVariant)}>+ {t("add_to_order")}</button>
                                            ) : (
                                                <div className="premium-qty-control">
                                                    <button onClick={() => updateCart(item, -1, currentVariant)}>−</button>
                                                    <span className="qty-val">{qty}</span>
                                                    <button onClick={() => updateCart(item, 1, currentVariant)}>+</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {arDish && (
                <div className="ar-modal-v3" onClick={() => setArDish(null)}>
                    <div className="ar-modal-inner" onClick={e => e.stopPropagation()}>
                        <button className="close-ar-v3" onClick={() => setArDish(null)}>✕</button>
                        <div className="ar-viewport-v3">
                            {viewMode === '3d' ? <Gourmet3DViewer image={arDish} itemName={arDish.display_name || arDish.name} /> : <ThreeDViewer modelUrl={arDish.model_url.startsWith('http') ? arDish.model_url : `${API_BASE_URL}${arDish.model_url.startsWith('/') ? '' : '/'}${arDish.model_url}`} posterUrl={getFullImageUrl(arDish.image_url)} itemName={arDish.name} />}
                        </div>
                        <div className="ar-info-v3">
                            <h2>{arDish.display_name || arDish.name}</h2>
                            <div className="ar-modal-footer">
                                <div className="ar-price">₹{arDish.price}</div>
                                <button className="checkout-btn-v3" onClick={() => { updateCart(arDish, 1); setArDish(null); }}>{t("add_to_order")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {Object.keys(cart).length > 0 && (
                <div className="bottom-checkout-bar" onClick={() => navigate("/cart")}>
                    <div className="order-summary-v3">
                        <span>{Object.values(cart).reduce((a, b) => a + b.quantity, 0)} Items</span>
                        <span>₹{Object.values(cart).reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
                    </div>
                    <button className="checkout-btn-v3">{t("checkout")} →</button>
                </div>
            )}
            <CraveBot menuItems={items} />
        </div>
    );
}
