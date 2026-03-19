const db = require('../config/db');

exports.submitFeedback = (req, res) => {
    const { order_id, user_id, rating, comment } = req.body;

    if (!order_id || !user_id || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = "INSERT INTO feedback (order_id, user_id, rating, comment) VALUES (?, ?, ?, ?)";
    db.query(sql, [order_id, user_id, rating, comment], (err, result) => {
        if (err) {
            console.error("Error submitting feedback:", err);
            return res.status(500).json({ message: "Feedback submission failed" });
        }
        res.json({ message: "Feedback Submitted Successfully" });
    });
};

exports.getFeedback = (req, res) => {
    // Join with users and menu/orders if needed for detailed view
    // For now simple list
    const sql = `
        SELECT f.*, u.fullname as customer_name 
        FROM feedback f
        JOIN users u ON f.user_id = u.id
        ORDER BY f.created_at DESC
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
    });
};
