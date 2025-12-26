import React from "react";
import "./welcome.css";
import bg from "./assets/bg.jpg";
import { useNavigate, useLocation } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();

  // QR मधून table number घेण्यासाठी
  const params = new URLSearchParams(location.search);
  const tableNo = params.get("table");

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
    </div>
  );
}
