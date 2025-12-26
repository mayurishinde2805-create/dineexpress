const db = require('../config/db');

exports.placeOrder = (req, res) => {
    const { user_id, item_id, quantity } = req.body;

    const sql = "INSERT INTO orders (user_id, item_id, quantity, status) VALUES (?, ?, ?, 'Pending')";
    db.query(sql, [user_id, item_id, quantity], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Order Placed!" });
    });
};

exports.getOrders = (req, res) => {
    const { user_id } = req.query;

    const sql = "SELECT * FROM orders WHERE user_id = ?";
    db.query(sql, [user_id], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
    });
};
