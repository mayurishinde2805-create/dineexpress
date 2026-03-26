import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminMenuManagement.css";

export default function AdminMenuManagement() {
    const [activeTab, setActiveTab] = useState("items"); // items, categories, subcategories
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        sub_category: "",
        type: "",
        price: "",
        diet: "veg",
        description: "",
        image_url: "",
        is_available: true,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            const uniqueCategories = [...new Set(items.map(i => i.category))].filter(Boolean);
            const uniqueSubCategories = [...new Set(items.map(i => i.sub_category))].filter(Boolean);
            setCategories(uniqueCategories);
            setSubCategories(uniqueSubCategories);
        }
    }, [items]);

    const fetchItems = async () => {
        try {
            const role = localStorage.getItem("role");
            const res = await axios.get(API_BASE_URL + "/api/menu/all", {
                headers: { role }
            });
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getFullImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith('http')) return path;
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE_URL}${normalizedPath}`;
    };


    const handleAddNew = () => {
        setEditingItem(null);
        setFormData({
            name: "",
            category: "",
            sub_category: "",
            type: "",
            price: "",
            diet: "veg",
            description: "",
            image_url: "",
            is_available: true,
        });
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            sub_category: item.sub_category,
            type: item.type || "",
            price: item.price,
            diet: item.diet,
            description: item.description,
            image_url: item.image_url || "",
            is_available: item.is_available !== false,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const role = localStorage.getItem("role");
                await axios.delete(`${API_BASE_URL}/api/menu/${id}`, {
                    headers: { role }
                });
                fetchItems();
            } catch (err) {
                console.error(err);
                alert("Action denied: Admin only");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = localStorage.getItem("role");
            const config = { headers: { role } };

            if (editingItem) {
                await axios.put(`${API_BASE_URL}/api/menu/${editingItem.id}`, formData, config);
            } else {
                await axios.post(API_BASE_URL + "/api/menu", formData, config);
            }
            setShowModal(false);
            fetchItems();
        } catch (err) {
            console.error(err);
            alert("Failed to save item. Make sure you are logged in as Admin.");
        }
    };

    return (
        <div className="admin-menu-management">
            <div className="management-header">
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${activeTab === "items" ? "active" : ""}`}
                        onClick={() => setActiveTab("items")}
                    >
                        🍽️ Items
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
                        onClick={() => setActiveTab("categories")}
                    >
                        📁 Categories
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "subcategories" ? "active" : ""}`}
                        onClick={() => setActiveTab("subcategories")}
                    >
                        📂 Sub-Categories
                    </button>
                </div>
                <button className="add-new-btn" onClick={handleAddNew}>
                    ➕ Add New {activeTab === "items" ? "Item" : activeTab === "categories" ? "Category" : "Sub-Category"}
                </button>
            </div>

            {activeTab === "items" && (
                <div className="items-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Sub-Category</th>
                                <th>Price</th>
                                <th>Diet</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="item-image">
                                            {item.image_url ? (
                                                <img src={getFullImageUrl(item.image_url)} alt={item.name} />
                                            ) : (
                                                <div className="no-image">📷</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.sub_category}</td>
                                    <td>₹{item.price}</td>
                                    <td>
                                        <span className={`diet-badge ${item.diet}`}>
                                            {item.diet === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.is_available !== false ? "active" : "inactive"}`}>
                                            {item.is_available !== false ? "✅ Yes" : "❌ No"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                                            <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === "categories" && (
                <div className="categories-grid">
                    {categories.map((cat, index) => (
                        <div key={index} className="category-card">
                            <h3>{cat}</h3>
                            <p>{items.filter(i => i.category === cat).length} items</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "subcategories" && (
                <div className="categories-grid">
                    {subCategories.map((sub, index) => (
                        <div key={index} className="category-card">
                            <h3>{sub}</h3>
                            <p>{items.filter(i => i.sub_category === sub).length} items</p>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Item Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Starters">Starters</option>
                                        <option value="Main Menu">Main Menu</option>
                                        <option value="Continental">Continental</option>
                                        <option value="Fusion">Fusion</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Drinks">Drinks</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Sub-Category *</label>
                                    <input
                                        type="text"
                                        value={formData.sub_category}
                                        onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        placeholder="e.g., Indian, Chinese"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Diet Type *</label>
                                    <select
                                        value={formData.diet}
                                        onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                                    >
                                        <option value="veg">🟢 Vegetarian</option>
                                        <option value="non-veg">🔴 Non-Vegetarian</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_available}
                                        onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                    />
                                    <span>Available for ordering</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    {editingItem ? "Update Item" : "Add Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
