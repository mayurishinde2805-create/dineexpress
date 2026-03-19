const db = require('../config/db');

// Dashboard Overview Stats
exports.getDashboardStats = (req, res) => {
    const queries = {
        todayOrders: "SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()",
        todayRevenue: "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE DATE(created_at) = CURDATE()",
        activeTables: "SELECT COUNT(DISTINCT table_number) as count FROM orders WHERE status NOT IN ('Served', 'Completed', 'Cancelled')",
        pendingOrders: "SELECT COUNT(*) as count FROM orders WHERE status IN ('Placed', 'Preparing', 'Ready')" // Adjusted for 'Placed'
    };

    const stats = {};

    // Execute queries sequentially (or Promise.all)
    const promises = Object.entries(queries).map(([key, sql]) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) reject(err);
                else {
                    stats[key] = result[0].count !== undefined ? result[0].count : result[0].total;
                    resolve();
                }
            });
        });
    });

    Promise.all(promises)
        .then(() => res.json(stats))
        .catch(err => res.status(500).json(err));
};

// Analytics - Sales Trends
exports.getSalesAnalytics = (req, res) => {
    const period = req.query.period || 'daily';
    let sql = "";

    if (period === 'daily') {
        // Last 7 days
        sql = `
            SELECT DATE_FORMAT(created_at, '%a') as name, COUNT(*) as orders, SUM(total_amount) as revenue 
            FROM orders 
            WHERE created_at >= DATE(NOW()) - INTERVAL 7 DAY 
            GROUP BY DATE(created_at) 
            ORDER BY created_at ASC
        `;
    } else if (period === 'weekly') {
        // Last 4 weeks
        sql = `
            SELECT CONCAT('Week ', WEEK(created_at)) as name, COUNT(*) as orders, SUM(total_amount) as revenue 
            FROM orders 
            WHERE created_at >= DATE(NOW()) - INTERVAL 4 WEEK 
            GROUP BY WEEK(created_at) 
            ORDER BY created_at ASC
        `;
    } else {
        // Monthly
        sql = `
            SELECT DATE_FORMAT(created_at, '%b') as name, COUNT(*) as orders, SUM(total_amount) as revenue 
            FROM orders 
            WHERE created_at >= DATE(NOW()) - INTERVAL 6 MONTH 
            GROUP BY MONTH(created_at) 
            ORDER BY created_at ASC
        `;
    }

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// Top Items
exports.getPopularItems = (req, res) => {
    const sql = `
        SELECT m.name, SUM(oi.quantity) as orders 
        FROM order_items oi 
        JOIN menu m ON oi.item_id = m.id 
        GROUP BY oi.item_id 
        ORDER BY orders DESC 
        LIMIT 5
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// Diet Stats (Veg vs Non-Veg)
exports.getDietStats = (req, res) => {
    const sql = `
        SELECT 
            CASE 
                WHEN m.sub_category LIKE '%Veg%' AND m.sub_category NOT LIKE '%Non-Veg%' THEN 'Vegetarian'
                ELSE 'Non-Vegetarian' 
            END as name,
            COUNT(*) as value
        FROM order_items oi
        JOIN menu m ON oi.item_id = m.id
        GROUP BY name
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};
