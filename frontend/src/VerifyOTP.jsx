import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import API_BASE_URL from './apiConfig';
import "./verifyOtp.css";
import bg from "./assets/verify-bg.jpg";
import { useLanguage } from "./context/LanguageContext";

export default function VerifyOTP() {
  const { t } = useLanguage();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // email register page वरून येतो
  const email = location.state?.email;

  const handleVerify = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email, otp });
      
      if (res.data.success) {
        setMessage("Verified successfully ✔️");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server not responding");
    }
  };

  return (
    <div
      className="verify-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="verify-box">
        <h2>{t("verify_otp")}</h2>
        <p>{t("enter_otp_hint")}</p>

        <input
          type="text"
          placeholder={t("enter_otp_placeholder")}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {message && <p className="error-text">{message}</p>}

        <button className="verify-btn" onClick={handleVerify}>
          {t("verify_otp")}
        </button>
      </div>
    </div>
  );
}
