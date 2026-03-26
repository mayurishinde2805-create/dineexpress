import API_BASE_URL from "./apiConfig";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import "./orderStatus.css";
import { useLanguage } from "./context/LanguageContext";
import bg from "./assets/bg.jpg";

const socket = io(API_BASE_URL);

export default function OrderSuccess() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [order, setOrder] = useState(null);
    const [statusStep, setStatusStep] = useState(0);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const steps = ["Placed", "Preparing", "Ready", "Served"];

    useEffect(() => {
        const fetchOrder = () => {
            const user = ( (() => { try { const val = localStorage.getItem("user"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() );
            const userId = user ? user.id : 1;

            axios.get(`${API_BASE_URL}/api/orders/user/${userId}`)
                .then(res => {
                    const allOrders = res.data;
                    if (state?.orderId) {
                        const specific = allOrders.find(o => o.id == state.orderId);
                        if (specific) setOrder(specific);
                        else if (allOrders.length > 0) setOrder(allOrders.sort((a, b) => b.id - a.id)[0]);
                    } else if (allOrders.length > 0) {
                        const latest = allOrders.sort((a, b) => b.id - a.id)[0];
                        setOrder(latest);
                    }
                })
                .catch(err => console.error(err));
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 5000);

        socket.on("statusUpdated", (data) => {
            if (order && data.id === order.id) {
                setOrder(prev => ({ ...prev, status: data.status }));
            } else {
                fetchOrder();
            }
        });

        socket.on("paymentSuccess", (data) => {
            if (order && data.id === order.id) {
                setOrder(prev => ({ ...prev, payment_status: 'Paid' }));
                alert(t("alert_order_confirmed") || "🎉 Order Confirmed!");
            } else {
                fetchOrder();
            }
        });

        return () => {
            clearInterval(interval);
            socket.off("statusUpdated");
            socket.off("paymentSuccess");
        };
    }, [state, navigate, order?.id]);

    useEffect(() => {
        if (order) {
            let status = order.status;
            if (status === "Pending") status = "Placed";
            let stepIndex = steps.indexOf(status);
            if (stepIndex === -1) {
                stepIndex = steps.findIndex(s => s.toLowerCase() === status.toLowerCase());
            }
            if (stepIndex === -1) stepIndex = 0;
            setStatusStep(stepIndex);
        }
    }, [order]);

    const submitFeedback = () => {
        if (rating === 0) {
            alert(t("alert_rate") || "Please select a rating! ⭐");
            return;
        }
        const user = ( (() => { try { const val = localStorage.getItem("user"); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() );
        axios.post(API_BASE_URL + "/api/feedback/submit", {
            order_id: order.id,
            user_id: user ? user.id : 1,
            rating,
            comment
        })
            .then(() => {
                setFeedbackSubmitted(true);
                alert(t("alert_feedback_success") || "Feedback Sent! 🎉");
            })
            .catch(err => console.error(err));
    };

    if (!order) {
        return (
            <div className="status-container">
                <div className="status-card-elite">
                    <h2 style={{ color: '#fff' }}>{t("loading_order")}</h2>
                </div>
            </div>
        );
    }

    const isNew = state?.isNew;

    return (
        <div className="status-container">
            <div className="immersive-bg" style={{ backgroundImage: `url(${bg})` }}></div>

            <div className="status-card-elite">
                <header className="status-header">
                    <h1>{isNew ? t("order_placed_title") : t("track_order_title")}</h1>
                    <div className="live-indicator">
                        <div className="pulse-dot"></div>
                        Live Order Tracking
                    </div>
                </header>

                <main className="status-content">
                    <div className="order-id-pill" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '50px', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
                        {t("order_hash")}{order.id}
                    </div>

                    <div className="timeline-elite">
                        {steps.map((step, index) => (
                            <div key={step} className={`timeline-step ${index === statusStep ? 'active' : ''} ${index < statusStep ? 'completed' : ''}`}>
                                <div className="step-circle">
                                    {index < statusStep ? "✓" : index + 1}
                                </div>
                                <div className="step-label">{t(step.toLowerCase()) || step}</div>
                            </div>
                        ))}
                    </div>

                    {!feedbackSubmitted && (
                        <div className="feedback-box">
                            <h3>{t("rate_experience")}</h3>
                            <div className="stars-row">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        className={`elite-star ${star <= rating ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >★</span>
                                ))}
                            </div>
                            <textarea
                                className="comment-area"
                                placeholder="Any comments?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button className="status-btn btn-primary" style={{ width: '100%' }} onClick={submitFeedback}>
                                {t("submit_feedback")}
                            </button>
                        </div>
                    )}

                    {feedbackSubmitted && (
                        <div className="feedback-box" style={{ color: '#22c55e' }}>
                            <h3>{t("thank_you")}! 🎉</h3>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t("feedback_desc")}</p>
                        </div>
                    )}

                    <div className="status-actions">
                        <button className="status-btn btn-secondary" onClick={() => navigate("/customer/dashboard")}>
                            {t("dashboard")}
                        </button>
                        <button className="status-btn btn-primary" onClick={() => navigate("/home")}>
                            {t("return_menu")}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
