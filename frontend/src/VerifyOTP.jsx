import React, { useState } from "react";
import "./verifyOtp.css";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp.trim()) {
      setMessage("Enter OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
      } else {
        setMessage("OTP Verified ✔️");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {message && <p className="otp-msg">{message}</p>}

        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
}
