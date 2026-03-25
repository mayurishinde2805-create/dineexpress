import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import "./itemsPage.css";
// import "./menu.css"; // Removed to prevent visual mismatches and CSS conflicts
import CraveBot from "./CraveBot";
import { useLanguage } from "./context/LanguageContext";
import ThreeDViewer from "./ThreeDViewer";
import Gourmet3DViewer from "./Gourmet3DViewer";
import API_BASE_URL from "./apiConfig";

const socket = io(API_BASE_URL);

export default function ItemsPage() {
    const { categoryName, subCategoryName } = useParams();
    const navigate = useNavigate();
    const { t, language } = useLanguage();


    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "{}"));
    const [selectedVariants, setSelectedVariants] = useState({});
    const [arDish, setArDish] = useState(null);
    const [viewMode, setViewMode] = useState('3d'); // '3d' for interactive depth, 'ar' for True AR
    const [tableNo] = useState(localStorage.getItem("tableNo") || 1);


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
                const fetchedItems = Array.isArray(res.data) ? res.data : [];
                
                const filteredItems = fetchedItems.filter(item => {
                    const itemCat = (item.display_category || item.category || "").trim().toLowerCase();
                    const targetCat = (dbCategory || "").trim().toLowerCase();
                    const itemSub = (item.display_sub_category || item.sub_category || "").trim().toLowerCase();
                    const targetSub = (dbSubCategory || "").trim().toLowerCase();

                    if (!dbSubCategory) return itemCat === targetCat;
                    return itemCat === targetCat && itemSub === targetSub;
                });

                if (filteredItems.length === 0 && dbCategory) {
                    const catFallback = fetchedItems.filter(i => (i.display_category || i.category || "").trim().toLowerCase() === dbCategory.toLowerCase());
                    setItems(catFallback);
                } else {
                    setItems(filteredItems);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [dbCategory, dbSubCategory, language]);

    // --- ACTIONS ---
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
            console.error("Error calling waiter:", err);
            alert("Failed to call waiter. Please try again.");
        }
    };

    const displayedItems = items.filter(item => {
        const name = item.display_name || item.name;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const cartItemCount = Object.values(cart || {}).reduce((total, item) => total + (item?.quantity || 0), 0);

    return (
        <div className="items-v3-container">
            <header className="v2-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="back-pill" onClick={() => navigate(`/category/${categoryName}`)} style={{ margin: 0 }}>←</button>
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
                    ) : displayedItems.length === 0 ? (
                        <div className="v3-empty">{t("no_culinary_items")}</div>
                    ) : (
                        displayedItems.map(item => {
                            const variantsSource = item.display_variants || item.variants;


                            let variants = [];
                            try {
                                variants = typeof variantsSource === 'string' ? JSON.parse(variantsSource) : (variantsSource || []);
                            } catch (e) {
                                console.error("Variants Data Mismatch Error:", e);
                            }

                            const currentVariant = selectedVariants[item.id] || (variants.length > 0 ? variants[0].name : null);
                            const currentPrice = (variants.length > 0 && currentVariant) ? variants.find(v => v.name === currentVariant)?.price : item.price;
                            const cartId = currentVariant ? `${item.id}-${currentVariant}` : item.id;
                            const qty = cart[cartId]?.quantity || 0;

                            return (
                                <div key={item.id} className="dish-card-v3">
                                    <div className="dish-img-wrapper" style={{ background: '#0a1c15' }}>
                                        <img
                                            src={getFullImageUrl(item.image_url)}
                                            className="dish-img-v3"
                                            alt={item.name}
                                        />
                                        <span className={`diet-indicator ${item.diet}`}></span>
                                        <div className="v3-small-visual-controls">
                                            <button className="v3-icon-btn-3d" title="Full 3D View" onClick={(e) => {
                                                e.stopPropagation();
                                                setViewMode('3d');
                                                setArDish(item);
                                            }}>
                                                🧊
                                            </button>
                                            <button className="v3-icon-btn-ar" title="View in AR" onClick={(e) => {
                                                e.stopPropagation();
                                                setViewMode('ar');
                                                setArDish(item);
                                                setTimeout(() => {
                                                    const mv = document.querySelector('model-viewer');
                                                    if (mv && mv.activateAR) mv.activateAR();
                                                }, 500); // Give modal time to open
                                            }}>
                                                🧿
                                            </button>
                                        </div>
                                    </div>

                                    <div className="dish-details-v3">
                                        <div className="dish-header-v3">
                                            <h3>{item.display_name || item.name}</h3>
                                            <span className="dish-price-v3">₹{currentPrice}</span>
                                        </div>

                                        <p className="dish-desc-v3">{item.display_description || item.description || t("premium_experience")}</p>

                                        {variants && (
                                            <div className="variant-selector-v3">
                                                {variants.map(v => (
                                                    <button
                                                        key={v.name}
                                                        className={`variant-btn-v3 ${currentVariant === v.name ? 'active' : ''}`}
                                                        onClick={() => setSelectedVariants(prev => ({ ...prev, [item.id]: v.name }))}
                                                    >
                                                        {v.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="dish-footer-v3">
                                            {qty === 0 ? (
                                                <button className="add-to-cart-premium" onClick={() => updateCart(item, 1, currentVariant)}>
                                                    + {t("add_to_order")}
                                                </button>
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
                </div >
            </main >

            <button className="waiter-fab-premium" onClick={handleCallWaiter}>
                <span className="fab-icon">🔔</span>
                <span className="fab-text">{t("assist")}</span>
            </button>

            <CraveBot menuItems={items} />

            {
                Object.keys(cart).length > 0 && (
                    <div className="bottom-checkout-bar" onClick={() => navigate("/cart")}>
                        <div className="order-summary-v3">
                            <span className="order-count">{Object.values(cart).reduce((a, b) => a + b.quantity, 0)} Items</span>
                            <span className="order-total">₹{Object.values(cart).reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
                        </div>
                        <button className="checkout-btn-v3">
                            {t("checkout")}
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>
                )
            }

            {/* HIGH-END AR / 3D MODAL USING GOOGLE MODEL-VIEWER */}
            {
                arDish && (
                    <div className="ar-modal-v3" onClick={() => setArDish(null)}>
                        <div className="ar-modal-inner" onClick={e => e.stopPropagation()}>
                            <button className="close-ar-v3" onClick={() => setArDish(null)}>✕</button>

                            <div className="ar-viewport-v3" id="3d-container">
                                {viewMode === '3d' ? (
                                    <Gourmet3DViewer
                                        image={arDish}
                                        itemName={arDish.display_name || arDish.name}
                                    />
                                ) : (
                                    <ThreeDViewer
                                        modelUrl={arDish.model_url.startsWith('http') ? arDish.model_url : `${API_BASE_URL}${arDish.model_url.startsWith('/') ? '' : '/'}${arDish.model_url}`}
                                        posterUrl={getFullImageUrl(arDish.image_url)}
                                        itemName={arDish.name}
                                    />
                                )}
                            </div>

                            <div className="ar-info-v3">
                                <div className="ar-badge">
                                    {/Android|iPhone/i.test(navigator.userAgent) ? "📱 MOBILE AR READY" : "🖥️ DESKTOP 3D VIEW"}
                                </div>

                                <h2>{arDish.display_name || arDish.name}</h2>
                                <p>{arDish.display_description || arDish.description || "Experimental 3D visualization. If AR doesn't start, ensure WebXR is enabled in your browser settings."}</p>

                                <div className="ar-modal-footer">
                                    <div className="ar-price">₹{arDish.price}</div>
                                    <button className="checkout-btn-v3" style={{ flex: 1 }} onClick={() => { updateCart(arDish, 1); setArDish(null); }}>
                                        {t("add_to_order")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

