import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import "./kitchenLogin.css";

export default function KitchenVerify() {
    const [otp, setOtp] = useState("");
    const [kitchenCode, setKitchenCode] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/kitchen/verify`, { email, otp });
            setKitchenCode(res.data.kitchenCode);
        } catch (err) {
            alert("Invalid OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/kitchen/resend-otp`, { email });
            alert("OTP Resent! Check your email or console.");
        } catch (err) {
            alert("Failed to resend OTP");
        }
    };

    if (kitchenCode) {
        return (
            <div className="kitchen-login-wrapper">
                <div className="kitchen-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ color: '#16a34a', marginBottom: '15px' }}>Registration Complete!</h2>
                    <p style={{ color: '#64748b', marginBottom: '10px' }}>Your Kitchen Access Code:</p>
                    <div style={{
                        background: '#fef3c7',
                        border: '2px solid #f97316',
                        borderRadius: '12px',
                        padding: '20px',
                        margin: '20px 0'
                    }}>
                        <h1 style={{
                            color: '#ea580c',
                            fontSize: '2.5rem',
                            letterSpacing: '3px',
                            fontFamily: 'monospace'
                        }}>{kitchenCode}</h1>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '25px' }}>
                        ⚠️ Save this code! You'll use it to access the kitchen dashboard.
                    </p>
                    <button className="kitchen-btn" onClick={() => navigate("/kitchen/login")}>
                        Go to Kitchen Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="kitchen-login-wrapper">
            <div className="kitchen-card">
                <h2 style={{ marginBottom: '20px' }}>🔐 Verify Your Email</h2>
                <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.95rem' }}>
                    We've sent a 4-digit OTP to <strong style={{ color: '#f97316' }}>{email}</strong>
                </p>

                <form onSubmit={handleVerify}>
                    <div className="k-input-group">
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
                    <button type="submit" className="kitchen-btn">
                        Verify & Get Kitchen Code
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
                    Didn't receive? <span style={{ color: '#f97316', textDecoration: 'underline' }}>Resend OTP</span>
                </p>
            </div>
        </div>
    );
}
