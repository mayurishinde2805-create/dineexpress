const db = require('../config/db');

exports.getCustomers = (req, res) => {
    // Return users with 'user' role + aggregation of orders
    // Columns: id, fullname, email, mobile, join_date, total_orders, total_spent
    const sql = `
        SELECT 
            u.id, 
            u.fullname, 
            u.email, 
            u.mobile, 
            u.is_verified,
            COUNT(o.id) as total_orders,
            COALESCE(SUM(o.total_amount), 0) as total_spent,
            MAX(o.created_at) as last_order
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'user' OR u.role IS NULL
        GROUP BY u.id
        ORDER BY u.id DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error("Get Customers Error:", err);
            return res.status(500).send("DB Error");
        }
        res.json(rows);
    });
};

exports.getCustomerDetails = (req, res) => {
    const userId = req.params.id;
    // Get Order History for specific user
    const sql = `
        SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `;
    db.query(sql, [userId], (err, rows) => {
        if (err) return res.status(500).send("DB Error");
        res.json(rows);
    });
};
