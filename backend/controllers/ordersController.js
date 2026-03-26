const db = require('../config/db');
require('dotenv').config(); // Load immediately in file
const Razorpay = require('razorpay');

// Fallback logic inside the instance creation
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || ""
});

// 1. PLACE ORDER
exports.placeOrder = async (req, res) => {
    // ... (No changes needed for placement)
    const { user_id, table_no, items, total_amount, payment_method } = req.body;

    console.log("RX ORDER:", JSON.stringify(req.body, null, 2));

    if (!user_id || !items || items.length === 0) {
        return res.status(400).json({ message: "Invalid order data" });
    }

    // A. ONLINE PAYMENT FLOW
    if (payment_method === 'Online' || payment_method === 'Razorpay') {
        try {
            const options = {
                amount: total_amount * 100, // amount in paise
                currency: "INR",
                receipt: "order_rcptid_" + Date.now(),
            };

            // 1. Create Razorpay ID (AWAIT this before DB insert)
            const razorpayOrder = await razorpay.orders.create(options);

            // 2. Insert into DB: Status 'Placed', Payment 'Pending'
            const orderSql = "INSERT INTO orders (user_id, table_number, total_amount, order_status, payment_status, payment_method) VALUES (?, ?, ?, 'Placed', 'Pending', ?)";

            db.query(orderSql, [user_id, table_no, total_amount, 'Online'], (err, result) => {
                if (err) return res.status(500).json({ message: "DB Error: " + err.message });

                const dbOrderId = result.insertId;

                // 3. Insert Items
                const itemValues = items.map(item => [
                    dbOrderId, item.item_id, item.quantity, item.price, item.variant || null, item.special_request || ""
                ]);
                const itemsSql = "INSERT INTO order_items (order_id, item_id, quantity, price, variant, special_request) VALUES ?";

                db.query(itemsSql, [itemValues], (err) => {
                    if (err) return res.status(500).json({ message: "Item Error: " + err.message });

                    // 4. Return Razorpay details to Frontend
                    res.json({
                        id: razorpayOrder.id,           // This is the CRITICAL 'order_id' Razorpay needs
                        currency: razorpayOrder.currency,
                        amount: razorpayOrder.amount,
                        dbOrderId: dbOrderId,           // Custom ID for our DB verification
                        message: "Online Order Initiated"
                    });
                });
            });

        } catch (error) {
            console.error("Razorpay Error Object:", JSON.stringify(error, null, 2));
            res.status(500).json({
                message: "Razorpay Connection Error",
                error: error.description || error.message || JSON.stringify(error)
            });
        }

    } else {
        // B. CASH PAYMENT FLOW
        const orderSql = "INSERT INTO orders (user_id, table_number, total_amount, order_status, payment_status, payment_method) VALUES (?, ?, ?, 'Placed', 'Pending', 'Cash')";

        db.query(orderSql, [user_id, table_no, total_amount], (err, result) => {
            if (err) {
                console.error("Error creating order SQL:", err);
                return res.status(500).json({ message: "Order creation failed: " + err.message });
            }

            const orderId = result.insertId;

            const itemValues = items.map(item => [
                orderId, item.item_id, item.quantity, item.price, item.variant || null, item.special_request || ""
            ]);

            const itemsSql = "INSERT INTO order_items (order_id, item_id, quantity, price, variant, special_request) VALUES ?";

            db.query(itemsSql, [itemValues], (err, itemResult) => {
                if (err) return res.status(500).json({ message: "Order items failed" });

                if (req.io) {
                    req.io.emit('newOrder', { id: orderId, table_no, total_amount, status: 'Placed', payment_status: 'Pending', type: 'Cash' });
                }

                res.json({ message: "Order Placed. Please Pay at Counter.", orderId: orderId });
            });
        });
    }
};

// 2. VERIFY PAYMENT (Razorpay)
exports.verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');

    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        // SUCCESS
        const updateSql = "UPDATE orders SET payment_status = 'Paid' WHERE id = ?";
        db.query(updateSql, [dbOrderId], (err) => {
            if (err) return res.status(500).send("DB Error");

            const paySql = "INSERT INTO payments (order_id, payment_method, razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_status, verified_by) VALUES (?, 'Online', ?, ?, ?, 'Success', 'SYSTEM')";
            db.query(paySql, [dbOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature]);

            if (req.io) {
                req.io.emit('paymentSuccess', { id: dbOrderId, status: 'Paid' });
            }
            res.json({ message: "Payment Verified", status: "Success" });
        });
    } else {
        res.status(400).json({ message: "Signature Verification Failed", status: "Failed" });
    }
};

// 3. CONFIRM CASH PAYMENT
exports.confirmCashPayment = (req, res) => {
    console.log("RX: Confirm Cash Payment Request", JSON.stringify(req.body));
    const { orderId } = req.body;

    if (!orderId) {
        console.error("Missing Order ID");
        return res.status(400).json({ message: "Order ID Required" });
    }

    const sql = "UPDATE orders SET payment_status = 'Paid', payment_method = 'Cash' WHERE id = ?";
    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error("DB Error Confirming Payment:", err);
            return res.status(500).json({ message: "DB Error" });
        }

        console.log(`Payment Confirmed as CASH in DB for Order: ${orderId}. Rows affected: ${result.affectedRows}`);

        // Emit to Kitchen
        if (req.io) {
            req.io.emit('paymentSuccess', { id: orderId, status: 'Paid' });
        }
        res.json({ message: "Cash Payment Confirmed" });
    });
};

// Helper: Get Name Column based on Lang
const getNameCol = (lang) => {
    if (lang === 'hi') return "COALESCE(m.name_hi, m.name, 'Unknown Item')";
    if (lang === 'mr') return "COALESCE(m.name_mr, m.name, 'Unknown Item')";
    return "COALESCE(m.name, 'Unknown Item')";
};

// 4. GET KITCHEN ORDERS (Paid Only)
exports.getKitchenOrders = (req, res) => {
    const lang = req.query.lang;
    const nameCol = getNameCol(lang);

    const sql = `
         SELECT o.id, o.table_number as table_no, o.order_status as status, o.created_at,
                u.fullname as customer_name, u.mobile as customer_mobile,
                JSON_ARRAYAGG(
                    JSON_OBJECT('name', ${nameCol}, 'quantity', oi.quantity, 'variant', oi.variant, 'special_request', oi.special_request)
                ) as items
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN menu m ON oi.item_id = m.id
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.payment_status = 'Paid' AND o.order_status NOT IN ('Served', 'Cancelled')
         GROUP BY o.id
         ORDER BY o.created_at ASC
     `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        const parsed = results.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));
        res.send(parsed);
    });
};

// 5. GET ALL ORDERS (Admin)
exports.getOrders = (req, res) => {
    const lang = req.query.lang;
    const nameCol = getNameCol(lang);

    const sql = `
        SELECT o.id, o.table_number as table_no, o.order_status as status, o.created_at, o.payment_status, o.payment_method as payment_mode, o.total_amount,
               u.fullname as customer_name, u.mobile as customer_mobile,
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'name', ${nameCol},
                       'quantity', oi.quantity,
                       'variant', oi.variant,
                       'price', oi.price
                   )
               ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu m ON oi.item_id = m.id
        LEFT JOIN users u ON o.user_id = u.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        const parsed = results.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));
        res.send(parsed);
    });
};

// 6. UPDATE STATUS (Unchanged)
exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id || req.body.orderId;
    const { status } = req.body;

    let sql = "UPDATE orders SET order_status = ? WHERE id = ?";
    let params = [status, orderId];

    if (status === 'Served') {
        sql = "UPDATE orders SET order_status = ?, served_at = NOW() WHERE id = ?";
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).send(err);
        if (req.io) req.io.emit('statusUpdated', { id: orderId, status });
        res.json({ message: "Status updated" });
    });
};

// 7. CANCEL ORDER (Customer)
exports.cancelOrder = (req, res) => {
    const { id } = req.params;

    const checkSql = "SELECT order_status FROM orders WHERE id = ?";
    db.query(checkSql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: "DB Error" });
        if (results.length === 0) return res.status(404).json({ message: "Order not found" });

        const currentStatus = results[0].order_status.toLowerCase();
        if (currentStatus === 'preparing' || currentStatus === 'ready' || currentStatus === 'served') {
            return res.status(400).json({ message: "Cannot cancel order once preparation has started." });
        }

        const cancelSql = "UPDATE orders SET order_status = 'Cancelled' WHERE id = ?";
        db.query(cancelSql, [id], (err) => {
            if (err) return res.status(500).json({ message: "Update failed" });

            if (req.io) {
                req.io.emit('statusUpdated', { id, status: 'Cancelled' });
                req.io.emit('orderCancelled', { id });
            }
            res.json({ message: "Order cancelled successfully" });
        });
    });
};

// 8. USER HISTORY
exports.getUserOrders = (req, res) => {
    const userId = req.params.userId;
    const lang = req.query.lang;
    const nameCol = getNameCol(lang);

    const sql = `
        SELECT o.id, o.order_status as status, o.total_amount, o.created_at, o.served_at,
               JSON_ARRAYAGG(
                   JSON_OBJECT('name', ${nameCol}, 'quantity', oi.quantity, 'variant', oi.variant)
               ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu m ON oi.item_id = m.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send(err);
        const parsed = results.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));
        res.json(parsed);
    });
};
