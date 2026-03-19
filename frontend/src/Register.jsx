import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import bg from "./assets/bg.jpg"; // Using a cleaner background as requested
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
    else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{1,12}$/.test(password)
    )
      newErrors.password = "Use letter, number & symbol (max 12 chars)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, mobile, password, birthdate }),
      });

      const data = await res.json();

      if (!res.ok) setMessage(data.message);
      else navigate("/verify-otp", { state: { email } });
    } catch {
      setMessage("Server not responding");
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="register-box">
        <h2>{t("create_account")}</h2>

        <input
          type="text"
          placeholder={t("full_name")}
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
        />
        <p className="error-text">{errors.fullname}</p>

        <input
          type="email"
          placeholder={t("email_address")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="error-text">{errors.email}</p>

        <input
          type="text"
          placeholder={t("mobile_no")}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <p className="error-text">{errors.mobile}</p>

        <p className="error-text">{errors.mobile}</p>

        <div className="input-field-group">
          <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", display: "block", textAlign: "left", marginBottom: "5px" }}>
            {t("birthdate")}
          </label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            style={{ color: birthdate ? "#fff" : "#eee" }}
          />
        </div>
        <p className="error-text">{ }</p>

        <input
          type="password"
          placeholder={t("set_password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="error-text">{errors.password}</p>

        {message && <p className="error-text">{message}</p>}

        <button className="create-btn" onClick={handleRegister}>
          {t("create_account")}
        </button>
      </div>
    </div>
  );
}
