import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import "./adminLogin.css";

export default function AdminVerify() {
    const [otp, setOtp] = useState("");
    const [adminCode, setAdminCode] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/admin/verify`, { email, otp });
            setAdminCode(res.data.adminCode);
        } catch (err) {
            alert("Invalid OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/admin/resend-otp`, { email });
            alert("OTP Resent! Check your email or console.");
        } catch (err) {
            alert("Failed to resend OTP");
        }
    };

    if (adminCode) {
        return (
            <div className="admin-login-wrapper">
                <div className="admin-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ color: '#4ade80', marginBottom: '15px' }}>Registration Successful!</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '10px' }}>Your Unique Admin Code:</p>
                    <div style={{
                        background: 'rgba(74, 222, 128, 0.1)',
                        border: '2px solid #22c55e',
                        borderRadius: '12px',
                        padding: '20px',
                        margin: '20px 0'
                    }}>
                        <h1 style={{
                            color: '#4ade80',
                            fontSize: '2.5rem',
                            letterSpacing: '3px',
                            fontFamily: 'monospace'
                        }}>{adminCode}</h1>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '25px' }}>
                        ⚠️ Save this code securely! You'll need it to login.
                    </p>
                    <button className="admin-btn" onClick={() => navigate("/admin/login")}>
                        Proceed to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-login-wrapper">
            <div className="admin-card">
                <h2 style={{ marginBottom: '20px' }}>🔐 Verify Your Email</h2>
                <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '0.95rem' }}>
                    We've sent a 4-digit OTP to <strong style={{ color: '#4ade80' }}>{email}</strong>
                </p>

                <form onSubmit={handleVerify}>
                    <div className="input-box">
                        <label>Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="4"
                            placeholder="XXXX"
                            required
                            style={{
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                letterSpacing: '8px',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>
                    <button type="submit" className="admin-btn">
                        Verify & Get Admin Code
                    </button>
                </form>

                <p
                    style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                    onClick={handleResend}
                >
                    Didn't receive? <span style={{ color: '#4ade80', textDecoration: 'underline' }}>Resend OTP</span>
                </p>
            </div>
        </div>
    );
}
