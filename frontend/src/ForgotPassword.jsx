import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./login.css"; // Customer
import "./adminLogin.css"; // Admin
import "./kitchenLogin.css"; // Kitchen

export default function ForgotPassword({ role = "customer" }) {
    // role can be 'customer', 'admin', 'kitchen'
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Determine Wrapper & Card Classes
    let wrapperClass = "login-container";
    let cardClass = "glass-card";
    let btnClass = "login-btn";
    let title = "Reset Password";

    if (role === "admin") {
        wrapperClass = "admin-login-wrapper";
        cardClass = "admin-card";
        btnClass = "admin-btn";
        title = "Admin Recovery";
    } else if (role === "kitchen") {
        wrapperClass = "kitchen-login-wrapper";
        cardClass = "kitchen-card";
        btnClass = "kitchen-btn";
        title = "Kitchen Recovery";
    }

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://192.168.1.113:4000/api/auth/forgot-password", { email });
            setMessage("OTP sent to your email.");
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to send OTP. Check email.");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://192.168.1.113:4000/api/auth/verify-reset-otp", { email, otp });
            setMessage("OTP Verified. Set new password.");
            setStep(3);
        } catch (err) {
            setMessage(err.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://192.168.1.113:4000/api/auth/reset-password", { email, otp, newPassword });
            setMessage("Password Reset Successfully!");
            setTimeout(() => {
                if (role === 'admin') navigate("/admin/login");
                else if (role === 'kitchen') navigate("/kitchen/login");
                else navigate("/login");
            }, 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Reset Failed");
        }
    };

    return (
        <div className={wrapperClass}>
            <div className={cardClass}>
                <h2 style={{ marginBottom: '20px', color: role === 'kitchen' ? '#334155' : role === 'admin' ? '#fff' : '#1e1e1e' }}>
                    {title}
                </h2>

                {message && <p style={{ color: message.includes("Success") ? (role === 'admin' ? '#4ade80' : 'green') : '#ef4444', marginBottom: '15px' }}>{message}</p>}

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: role === 'admin' ? '#94a3b8' : '#555' }}>Register Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: role === 'admin' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ccc',
                                    background: role === 'admin' ? 'rgba(15, 23, 42, 0.6)' : 'transparent',
                                    color: role === 'admin' ? '#fff' : '#000'
                                }}
                            />
                        </div>
                        <button type="submit" className={btnClass}>Send OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: role === 'admin' ? '#94a3b8' : '#555' }}>Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="4-digit OTP"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: role === 'admin' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ccc',
                                    background: role === 'admin' ? 'rgba(15, 23, 42, 0.6)' : 'transparent',
                                    color: role === 'admin' ? '#fff' : '#000'
                                }}
                            />
                        </div>
                        <button type="submit" className={btnClass}>Verify OTP</button>
                        <p style={{ marginTop: '10px', cursor: 'pointer', fontSize: '0.9rem', color: '#888' }} onClick={() => setStep(1)}>Back</p>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: role === 'admin' ? '#94a3b8' : '#555' }}>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Set new password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: role === 'admin' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ccc',
                                    background: role === 'admin' ? 'rgba(15, 23, 42, 0.6)' : 'transparent',
                                    color: role === 'admin' ? '#fff' : '#000'
                                }}
                            />
                        </div>
                        <button type="submit" className={btnClass}>Reset Password</button>
                    </form>
                )}
            </div>
        </div>
    );
}
