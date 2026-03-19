import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import { useNavigate } from "react-router-dom";
import "./kitchenLogin.css";

export default function KitchenLogin() {
    const [formData, setFormData] = useState({
        kitchenCode: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/kitchen/login`, formData);
            // Save user info
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("role", "kitchen");
            navigate("/kitchen");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="kitchen-login-wrapper">
            <div className="kitchen-card">
                <h2>🍳 Chef Portal</h2>
                <span className="kitchen-subtitle">DineExpress Kitchen Display System</span>
                <form onSubmit={handleSubmit}>
                    <div className="k-input-group">
                        <label>Kitchen Code</label>
                        <input
                            type="text"
                            name="kitchenCode"
                            placeholder="e.g. KIT-1234"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="k-input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter access password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="kitchen-btn">Access KDS</button>
                    <p style={{ marginTop: '15px', color: '#64748b', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => navigate('/kitchen/forgot-password')}>
                        Forgot Password?
                    </p>
                    <p style={{ marginTop: '5px', color: '#f97316', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => navigate('/kitchen/recover-code')}>
                        Forgot Kitchen Code?
                    </p>
                </form>
                <div className="kitchen-footer">
                    <p onClick={() => navigate("/kitchen/register")}>
                        Need access? <span>Register Staff</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
