import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import bg from "./assets/register-bg.jpg"; 
import { useLanguage } from "./context/LanguageContext";
import API_BASE_URL from "./apiConfig";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{1,12}$/.test(password)
    )
      newErrors.password = "Min 8 chars, 1 letter, 1 number & 1 special";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, mobile, password, birthdate }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        setLoading(false);
      } else {
        navigate("/verify-otp", { state: { email } });
      }
    } catch {
      setMessage("Server not responding. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay-gradient"></div>
      
      <div className="register-card">
        <div className="brand-header">
          <h1 className="brand-logo">DineExpress</h1>
          <p className="brand-tagline">Experience the Art of Fine Dining</p>
        </div>

        <div className="form-sections">
          <div className="form-group-row">
            <div className="input-box">
              <label>{t("full_name")}</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex. Mayuri Shinde"
              />
              {errors.fullname && <span className="err-msg">{errors.fullname}</span>}
            </div>

            <div className="input-box">
              <label>{t("mobile_no")}</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10 Digits"
              />
              {errors.mobile && <span className="err-msg">{errors.mobile}</span>}
            </div>
          </div>

          <div className="input-box">
            <label>{t("email_address")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
            {errors.email && <span className="err-msg">{errors.email}</span>}
          </div>

          <div className="form-group-row">
            <div className="input-box">
              <label>{t("birthdate")}</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>{t("set_password")}</label>
              <div className="pass-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
              {errors.password && <span className="err-msg">{errors.password}</span>}
            </div>
          </div>
        </div>

        {message && <div className="status-toast error">{message}</div>}

        <button className="gold-btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Creating..." : t("create_account")}
        </button>

        <div className="card-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
