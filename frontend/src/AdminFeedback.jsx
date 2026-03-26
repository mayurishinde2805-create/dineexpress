import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminFeedback.css";

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL + "/api/feedback/all")
            .then(res => setFeedbacks(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="admin-feedback-container">
            <h2 className="page-title">📝 Customer Feedback</h2>

            {feedbacks.length === 0 ? (
                <div className="empty-state">No feedback received yet.</div>
            ) : (
                <div className="feedback-grid">
                    {feedbacks.map((fb) => (
                        <div key={fb.id} className="feedback-card">
                            <div className="feedback-header">
                                <span className="fb-id">Order #{fb.order_id}</span>
                                <span className="fb-date">{new Date(fb.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="fb-rating">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < fb.rating ? "star filled" : "star"}>★</span>
                                ))}
                            </div>
                            <p className="fb-comment">"{fb.comment || "No comment provided."}"</p>
                            <div className="fb-user">
                                - {fb.user_name || "Guest"}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
