import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import "./adminLogin.css";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [adminCode, setAdminCode] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        if (!adminCode || !password) {
            setMessage("Required");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/admin/login`, {
                adminCode,
                password
            });

            // Store Auth
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("role", "admin");
            localStorage.setItem("token", res.data.token);

            setMessage("✔️ Login successful");
            setTimeout(() => navigate("/admin"), 800);

        } catch (err) {
            setMessage(err.response?.data?.message || "Invalid Admin Code / Password");
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-card">
                <h2>ADMIN PANEL</h2>

                <div className="input-box">
                    <label>Admin Code</label>
                    <input
                        type="text"
                        placeholder="ADM-XXXX"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                    />
                </div>

                <div className="input-box">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {message && <p style={{ color: '#f87171', margin: '10px 0' }}>{message}</p>}

                <button className="admin-btn" onClick={handleLogin}>
                    Login to Dashboard
                </button>

                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#94a3b8', cursor: 'pointer', textAlign: 'right' }} onClick={() => navigate("/admin/forgot-password")}>
                    Forgot Password?
                </p>
                <p style={{ marginTop: '5px', fontSize: '0.9rem', color: '#4ade80', cursor: 'pointer', textAlign: 'right' }} onClick={() => navigate("/admin/recover-code")}>
                    Forgot Admin Code?
                </p>

                <p className="admin-switch">
                    New Admin?{" "}
                    <span onClick={() => navigate("/admin/register")}>Register Access</span>
                </p>
            </div>
        </div>
    );
}
