const db = require('../config/db');

// GET Sales Data (Daily/Weekly/Monthly)
exports.getSalesData = (req, res) => {
    const period = req.query.period || 'daily';
    let dateFormat = '%Y-%m-%d';
    let limit = 7;

    if (period === 'weekly') {
        dateFormat = '%x-%v'; // Year-Week (ISO)
        limit = 10;
    } else if (period === 'monthly') {
        dateFormat = '%Y-%m';
        limit = 12;
    }

    const sql = `
        SELECT 
            DATE_FORMAT(created_at, ?) as name, 
            SUM(total_amount) as revenue,
            COUNT(id) as orders
        FROM orders
        WHERE order_status != 'Cancelled'
        GROUP BY name
        ORDER BY name DESC
        LIMIT ?
    `;

    db.query(sql, [dateFormat, limit], (err, rows) => {
        if (err) {
            console.error("Sales Analytics Error:", err);
            return res.status(500).send("DB Error");
        }
        // Reverse to show chronological order in chart
        res.json(rows.reverse());
    });
};

// GET Popular Items (All Time or Daily)
exports.getPopularItems = (req, res) => {
    const period = req.query.period || 'all_time';
    let dateFilter = '';

    if (period === 'daily') {
        dateFilter = 'AND DATE(o.created_at) = CURDATE()';
    }

    const sql = `
        SELECT 
            m.name, 
            COUNT(oi.id) as orders,
            SUM(oi.price) as revenue
        FROM order_items oi
        JOIN menu m ON oi.item_id = m.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.order_status != 'Cancelled' ${dateFilter}
        GROUP BY m.id, m.name
        ORDER BY orders DESC
        LIMIT 10
    `;
    db.query(sql, (err, rows) => {
        if (err) {
            console.error("Popular Items Error:", err);
            return res.status(500).send("DB Error");
        }
        res.json(rows);
    });
};

// GET Diet Stats (Veg vs Non-Veg Approximation)
exports.getDietStats = (req, res) => {
    // Exact list of non-veg keywords to match standard menu items
    const sql = `
        SELECT 
            CASE 
                WHEN m.category LIKE '%Non-Veg%' 
                  OR m.category LIKE '%Chicken%' 
                  OR m.category LIKE '%Mutton%' 
                  OR m.category LIKE '%Fish%' 
                  OR m.category LIKE '%Egg%'
                  OR m.name LIKE '%Chicken%'
                  OR m.name LIKE '%Mutton%'
                  OR m.name LIKE '%Egg%'
                THEN 'Non-Veg'
                ELSE 'Veg'
            END as type,
            COUNT(oi.id) as value
        FROM order_items oi
        JOIN menu m ON oi.item_id = m.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.order_status != 'Cancelled'
        GROUP BY type
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send("DB Error");
        const formatted = rows.map(r => ({ name: r.type, value: r.value }));
        res.json(formatted);
    });
};

// GET Order Status Stats (Current + Archive - Exact)
exports.getStatusStats = (req, res) => {
    const sql = `
        SELECT 
            order_status as name, 
            COUNT(*) as value 
        FROM orders 
        WHERE order_status != 'Cancelled'
        GROUP BY order_status
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send("DB Error");
        res.json(rows);
    });
};

// GET MAIN DASHBOARD STATS (Live)
exports.getDashboardStats = (req, res) => {
    // 1. Today's Revenue and Orders
    const todaySql = `
        SELECT 
            COUNT(*) as orders,
            COALESCE(SUM(total_amount), 0) as revenue
        FROM orders 
        WHERE DATE(created_at) = CURDATE() AND (payment_status = 'Paid' OR order_status != 'Cancelled')
    `;

    // 2. Active Tables (count OCCUPIED tables)
    const tablesSql = `SELECT COUNT(*) as active FROM tables WHERE status = 'Occupied'`;

    // 3. Pending Orders (New/Preparing/Ready)
    const pendingSql = `SELECT COUNT(*) as pending FROM orders WHERE order_status IN ('New', 'Preparing', 'Ready', 'Placed')`;

    db.query(todaySql, (err, todayRes) => {
        if (err) return res.status(500).json({ error: "DB Error 1" });

        db.query(tablesSql, (err, tableRes) => {
            if (err) return res.status(500).json({ error: "DB Error 2" });

            db.query(pendingSql, (err, pendingRes) => {
                if (err) return res.status(500).json({ error: "DB Error 3" });

                const revenue = todayRes[0].revenue;
                // SIMULATED EXPENSES (Assuming 60% of revenue is cost)
                const expenses = revenue * 0.6;

                res.json({
                    todayOrders: todayRes[0].orders,
                    todayRevenue: revenue,
                    todayExpenses: expenses,
                    activeTables: tableRes[0].active,
                    pendingOrders: pendingRes[0].pending
                });
            });
        });
    });
};
