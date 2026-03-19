import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adminLogin.css";
import "./kitchenLogin.css";

export default function ForgotCode({ role }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Determine Styles based on Role
    let wrapperClass, cardClass, btnClass, title;
    if (role === 'admin') {
        wrapperClass = "admin-login-wrapper";
        cardClass = "admin-card";
        btnClass = "admin-btn";
        title = "Recover Admin Code";
    } else {
        wrapperClass = "kitchen-login-wrapper";
        cardClass = "kitchen-card";
        btnClass = "kitchen-btn";
        title = "Recover Kitchen Code";
    }

    const handleRecover = async (e) => {
        e.preventDefault();
        setMessage("");
        setCode("");

        try {
            const res = await axios.post("http://192.168.1.113:4000/api/auth/recover-code", {
                email,
                password,
                role
            });
            setCode(res.data.code);
        } catch (err) {
            const errorData = err.response?.data;

            if (errorData?.needsVerification) {
                // User hasn't completed OTP verification
                setMessage(
                    "⚠️ Your account isn't verified yet. " +
                    "Please complete OTP verification to get your code. " +
                    "Check your email or backend console for the OTP."
                );
            } else {
                setMessage(errorData?.message || "Recovery Failed");
            }
        }
    };

    return (
        <div className={wrapperClass}>
            <div className={cardClass}>
                <h2 style={{ marginBottom: '20px', color: role === 'kitchen' ? '#334155' : 'inherit' }}>{title}</h2>

                {code ? (
                    <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '10px', border: '1px solid #22c55e' }}>
                        <p style={{ color: role === 'kitchen' ? '#14532d' : '#fff', marginBottom: '5px' }}>Your Access Code:</p>
                        <h3 style={{ fontSize: '1.8rem', color: role === 'kitchen' ? '#16a34a' : '#4ade80', letterSpacing: '2px' }}>{code}</h3>
                        <button
                            className={btnClass}
                            style={{ marginTop: '15px' }}
                            onClick={() => navigate(role === 'admin' ? '/admin/login' : '/kitchen/login')}
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleRecover}>
                        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: role === 'admin' ? '#94a3b8' : '#64748b' }}>Registered Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: role === 'kitchen' ? '1px solid #ccc' : '1px solid rgba(255,255,255,0.1)',
                                    background: role === 'kitchen' ? '#fff' : 'rgba(15,23,42,0.6)',
                                    color: role === 'kitchen' ? '#000' : '#fff'
                                }}
                            />
                        </div>

                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: role === 'admin' ? '#94a3b8' : '#64748b' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Verify your password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: role === 'kitchen' ? '1px solid #ccc' : '1px solid rgba(255,255,255,0.1)',
                                    background: role === 'kitchen' ? '#fff' : 'rgba(15,23,42,0.6)',
                                    color: role === 'kitchen' ? '#000' : '#fff'
                                }}
                            />
                        </div>

                        {message && (
                            <div style={{
                                color: message.includes('⚠️') ? '#f59e0b' : '#ef4444',
                                marginBottom: '15px',
                                padding: '12px',
                                background: message.includes('⚠️') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '8px',
                                border: `1px solid ${message.includes('⚠️') ? '#f59e0b' : '#ef4444'}`
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>{message}</p>
                                {message.includes('⚠️') && (
                                    <button
                                        type="button"
                                        onClick={() => navigate(role === 'admin' ? '/admin/verify-otp' : '/kitchen/verify-otp', { state: { email } })}
                                        style={{
                                            marginTop: '10px',
                                            padding: '8px 16px',
                                            background: '#f59e0b',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Complete Verification Now →
                                    </button>
                                )}
                            </div>
                        )}

                        <button type="submit" className={btnClass}>Retrieve Code</button>

                        <p style={{ marginTop: '15px', fontSize: '0.9rem', color: role === 'kitchen' ? '#64748b' : '#94a3b8', cursor: 'pointer' }} onClick={() => navigate(-1)}>
                            Cancel
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
