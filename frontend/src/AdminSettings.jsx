import React, { useState, useEffect } from "react";
import "./adminSettings.css";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        restaurantName: "DineExpress",
        contact: "+91 98765 43210",
        email: "contact@dineexpress.com",
        address: "123 Food Street, Mumbai, India",
        taxRate: 5,
        serviceCharge: 10,
        currency: "INR",
        qrOrderingEnabled: true,
        onlineOrderingEnabled: true,
        themeColor: "#0d1b0d",
        accentColor: "#4ade80",
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
        setSaved(false);
    };

    const handleSave = () => {
        // Save to API
        console.log("Saving settings:", settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="admin-settings">
            <div className="settings-header">
                <h2>Settings</h2>
                {saved && <span className="save-indicator">✅ Settings Saved</span>}
            </div>

            <div className="settings-sections">
                {/* Restaurant Details */}
                <div className="settings-section">
                    <h3>Restaurant Details</h3>
                    <div className="settings-grid">
                        <div className="form-group">
                            <label>Restaurant Name</label>
                            <input
                                type="text"
                                value={settings.restaurantName}
                                onChange={(e) => handleChange("restaurantName", e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Contact Number</label>
                            <input
                                type="tel"
                                value={settings.contact}
                                onChange={(e) => handleChange("contact", e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea
                                value={settings.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                {/* Billing Configuration */}
                <div className="settings-section">
                    <h3>Billing Configuration</h3>
                    <div className="settings-grid">
                        <div className="form-group">
                            <label>Tax Rate (%)</label>
                            <input
                                type="number"
                                value={settings.taxRate}
                                onChange={(e) => handleChange("taxRate", parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Service Charge (%)</label>
                            <input
                                type="number"
                                value={settings.serviceCharge}
                                onChange={(e) => handleChange("serviceCharge", parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Currency</label>
                            <select
                                value={settings.currency}
                                onChange={(e) => handleChange("currency", e.target.value)}
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Ordering Options */}
                <div className="settings-section">
                    <h3>Ordering Options</h3>
                    <div className="toggle-group">
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <strong>QR Code Ordering</strong>
                                <p>Allow customers to order via QR code scan</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.qrOrderingEnabled}
                                    onChange={(e) => handleChange("qrOrderingEnabled", e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="toggle-item">
                            <div className="toggle-info">
                                <strong>Online Ordering</strong>
                                <p>Enable online ordering and delivery</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.onlineOrderingEnabled}
                                    onChange={(e) => handleChange("onlineOrderingEnabled", e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Theme Configuration */}
                <div className="settings-section">
                    <h3>Theme Configuration</h3>
                    <div className="settings-grid">
                        <div className="form-group">
                            <label>Primary Color (Dark Green)</label>
                            <div className="color-input">
                                <input
                                    type="color"
                                    value={settings.themeColor}
                                    onChange={(e) => handleChange("themeColor", e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={settings.themeColor}
                                    onChange={(e) => handleChange("themeColor", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Accent Color (Bright Green)</label>
                            <div className="color-input">
                                <input
                                    type="color"
                                    value={settings.accentColor}
                                    onChange={(e) => handleChange("accentColor", e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={settings.accentColor}
                                    onChange={(e) => handleChange("accentColor", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="settings-actions">
                    <button className="save-btn" onClick={handleSave}>
                        💾 Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
