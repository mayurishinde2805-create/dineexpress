// Welcome.jsx
import React from "react";
import "./welcome.css";
import bg from "./assets/bg.jpg";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  // QR table number logic
  const params = new URLSearchParams(window.location.search);
  const tableNo = params.get("table");

  if (tableNo) {
    localStorage.setItem("tableNo", tableNo);
  }

  return (
    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="welcome-text">
        Welcome to <span>DineExpress</span>

        {/* Optional: table number show */}
        {tableNo && (
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            Table No: {tableNo}
          </p>
        )}
      </div>

      <button
        className="proceed-btn"
        onClick={() => navigate("/login")}
      >
        Proceed →
      </button>

      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}>
        <button 
          onClick={() => navigate("/staff-portal")}
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Staff Entrance
        </button>
      </div>
    </div>
  );
}
