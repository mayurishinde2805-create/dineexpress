import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import "./adminLogin.css";

export default function AdminRegister() {
    const navigate = useNavigate();
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const validate = () => {
        let newErrors = {};

        if (!fullname.trim()) newErrors.fullname = "Required";
        else if (!/^[A-Za-z ]+$/.test(fullname))
            newErrors.fullname = "Only letters allowed";

        if (!email.trim()) newErrors.email = "Required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            newErrors.email = "Invalid email";

        if (!mobile.trim()) newErrors.mobile = "Required";
        else if (!/^[0-9]{10}$/.test(mobile))
            newErrors.mobile = "10 digits only";

        if (!password.trim()) newErrors.password = "Required";
        else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,12}$/.test(password))
            newErrors.password = "6-12 chars: letter, number & symbol";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        try {
            await axios.post(`${API_BASE_URL}/api/auth/admin/register`, {
                fullname, email, mobile, password
            });
            navigate("/admin/verify-otp", { state: { email } });
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-card" style={{ maxWidth: '450px' }}>
                <h2 style={{ marginBottom: '25px' }}>Create Admin Account</h2>

                <div className="input-box">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullname && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.fullname}</span>}
                </div>

                <div className="input-box">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="admin@dineexpress.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.email}</span>}
                </div>

                <div className="input-box">
                    <label>Mobile Number</label>
                    <input
                        type="text"
                        placeholder="10-digit mobile"
                        value={mobile}
                        maxLength="10"
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    {errors.mobile && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.mobile}</span>}
                </div>

                <div className="input-box">
                    <label>Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                userSelect: 'none',
                                color: '#94a3b8'
                            }}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                    {errors.password && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{errors.password}</span>}
                </div>

                {message && <p style={{ color: '#ef4444', margin: '10px 0', fontSize: '0.9rem' }}>{message}</p>}

                <button className="admin-btn" onClick={handleRegister}>
                    Create Account & Get OTP
                </button>

                <p className="admin-switch" style={{ marginTop: '15px' }}>
                    Already registered?{" "}
                    <span onClick={() => navigate("/admin/login")}>Login Here</span>
                </p>
            </div>
        </div>
    );
}
