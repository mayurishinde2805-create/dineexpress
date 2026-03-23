import React, { useState, useEffect } from "react";
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
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // email register page वरून येतो
  const email = location.state?.email;

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email, otp });
      
      if (res.data.message === "OTP verified") {
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

  const handleResend = async () => {
    try {
      setMessage("Sending new OTP...");
      const res = await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, { email });
      if (res.data.success) {
        setMessage("New OTP sent! Check your email.");
        setTimer(300);
        setCanResend(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend OTP");
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

        <div className="otp-timer">
          {timer > 0 ? (
            <p>OTP expires in: <span className="timer-countdown">{formatTime(timer)}</span></p>
          ) : (
            <p className="timer-expired">OTP has expired.</p>
          )}
        </div>

        {message && <p className="error-text">{message}</p>}

        <button className="verify-btn" onClick={handleVerify}>
          {t("verify_otp")}
        </button>

        <div className="resend-section">
          <p>Didn't receive OTP?</p>
          <button 
            className="resend-btn" 
            onClick={handleResend} 
            disabled={!canResend}
          >
            {canResend ? "Resend OTP" : `Resend in ${formatTime(timer)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
