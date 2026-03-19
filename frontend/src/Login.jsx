import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiConfig";
import "./login.css";
import { useLanguage } from "./context/LanguageContext";
import bg from "./assets/login-bg.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { t, changeLanguage, language } = useLanguage();

  const handleLogin = async () => {
    try {
      setError("");
      setSuccess("");
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      setSuccess("Login Successful! Redirecting...");

      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role || "customer");

      // Brief delay so user sees the success toast
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid Email or Password";
      setError(msg);
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="glass-card">
        {/* Language Switcher */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '5px',
              padding: '5px',
              color: '#333',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        <h2 className="title">{t("welcome")}</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>{t("login_subtitle")}</p>

        <div className="input-group">
          <label>{t("email_label")}</label>
          <input
            type="email"
            placeholder={t("login_placeholder_email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>{t("password_label")}</label>
          <input
            type="password"
            placeholder={t("login_placeholder_password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          {t("login_btn")}
        </button>

        <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#1e1e1e', cursor: 'pointer' }} onClick={() => navigate('/forgot-password')}>
          {t("forgot_password")}
        </p>

        {/* Replaced the original register-text paragraph with the new structure */}
        <div>
          <p className="switch-auth">
            New user? <span onClick={() => navigate("/register")}>Register here</span>
          </p>
          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
            Staff? <span style={{ color: '#7c3aed', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate("/admin/login")}>Admin Login</span> or <span style={{ color: '#7c3aed', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate("/kitchen/login")}>Kitchen Login</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="toast error-toast">
          {error}
        </div>
      )}

      {success && (
        <div className="toast success-toast">
          {success}
        </div>
      )}
    </div>
  );
}
