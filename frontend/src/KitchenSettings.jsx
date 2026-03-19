import React, { useState, useEffect } from "react";
import "./kitchenSettings.css";

export default function KitchenSettings() {
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState({
        orderSound: true,
        autoPrint: false,
        displayMode: "grid",
        prepTimeLimit: 15,
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="kitchen-settings-container">
            {/* Chef Profile Header */}
            <div className="chef-profile-card">
                <div className="chef-avatar-wrapper">
                    👨‍🍳
                    <span className="chef-badge">Online</span>
                </div>
                <div className="chef-info">
                    <h2>{user?.name || "Kitchen Staff"}</h2>
                    <p>📧 {user?.email || "staff@dineexpress.com"}</p>
                    <div className="kitchen-id-pill">
                        ID: {user?.kitchen_code || "KDS-DEFAULT"}
                    </div>
                </div>
            </div>

            {/* Operational Settings Grid */}
            <div className="k-settings-grid">
                {/* Sound Settings */}
                <div className="k-settings-card">
                    <div className="card-icon">🔊</div>
                    <h3>Notification Alerts</h3>
                    <p>Control audio alerts for incoming orders and status updates.</p>
                    <div className="k-toggle-row">
                        <span>Order Sound</span>
                        <div
                            className={`k-switch ${settings.orderSound ? 'active' : ''}`}
                            onClick={() => handleChange("orderSound", !settings.orderSound)}
                        >
                            <div className="k-knob"></div>
                        </div>
                    </div>
                </div>

                {/* Print Settings */}
                <div className="k-settings-card">
                    <div className="card-icon">🖨️</div>
                    <h3>Kitchen Printing</h3>
                    <p>Automate KOT printing as soon as orders are confirmed.</p>
                    <div className="k-toggle-row">
                        <span>Auto-Print KOT</span>
                        <div
                            className={`k-switch ${settings.autoPrint ? 'active' : ''}`}
                            onClick={() => handleChange("autoPrint", !settings.autoPrint)}
                        >
                            <div className="k-knob"></div>
                        </div>
                    </div>
                </div>

                {/* Performance Settings */}
                <div className="k-settings-card">
                    <div className="card-icon">⏱️</div>
                    <h3>Prep Threshold</h3>
                    <p>Set warning time for dishes taking longer than expected.</p>
                    <div className="k-input-wrapper">
                        <label>Warning Limit (Minutes)</label>
                        <input
                            type="number"
                            className="k-field"
                            value={settings.prepTimeLimit}
                            onChange={(e) => handleChange("prepTimeLimit", e.target.value)}
                        />
                    </div>
                </div>

                {/* View Mode */}
                <div className="k-settings-card">
                    <div className="card-icon">🖥️</div>
                    <h3>Display Mode</h3>
                    <p>Choose how orders are organized on your screen.</p>
                    <div className="k-input-wrapper">
                        <label>Interface Style</label>
                        <select
                            className="k-field"
                            value={settings.displayMode}
                            onChange={(e) => handleChange("displayMode", e.target.value)}
                        >
                            <option value="grid">Dynamic Grid</option>
                            <option value="list">Detailed List</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Sticky Save Bar */}
            <div className="k-save-bar">
                <div className="k-save-info">
                    {saved ? (
                        <span style={{ color: '#22c55e', fontWeight: 600 }}>✅ Settings Applied Successfully</span>
                    ) : (
                        <span style={{ color: '#64748b' }}>Last updated: Just now</span>
                    )}
                </div>
                <button className="k-save-btn" onClick={handleSave}>
                    <span>💾 Update Kitchen Config</span>
                </button>
            </div>
        </div>
    );
}
