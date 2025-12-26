import React, { useState } from "react";
import "./register.css";
import bg from "./assets/register-bg.jpg";

export default function Register() {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // VALIDATION (UI change नाही)
  const validate = () => {
    let newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = "Required";
    } else if (!/^[A-Za-z ]+$/.test(fullname)) {
      newErrors.fullname = "Only letters allowed";
    }

    if (!email.trim()) {
      newErrors.email = "Required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Required";
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      newErrors.mobile = "10 digits only";
    }

    if (!password.trim()) {
      newErrors.password = "Required";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{1,12}$/.test(password)
    ) {
      newErrors.password = "Use letter, number & symbol (max 12 chars)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // REGISTER
  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          email,
          mobile,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
      } else {
        setMessage("OTP sent to your email ✔️");
        setTimeout(() => {
          window.location.href = "/verify-otp";
        }, 1200);
      }
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
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
        />
        <p className="error-text">{errors.fullname}</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="error-text">{errors.email}</p>

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <p className="error-text">{errors.mobile}</p>

        <input
          type="password"
          placeholder="Set Password (max 12 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="error-text">{errors.password}</p>

        {message && <p className="error-text">{message}</p>}

        <button className="create-btn" onClick={handleRegister}>
          Create Account
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
