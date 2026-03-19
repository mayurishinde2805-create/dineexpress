const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ensure table exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS waiter_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_no VARCHAR(50) NOT NULL,
    status ENUM('pending', 'resolved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.query(createTableQuery, (err) => {
    if (err) console.error("Error creating waiter_requests table:", err);
    else console.log("✅ waiter_requests table ready");
});

// GET active requests
router.get('/', (req, res) => {
    db.query("SELECT * FROM waiter_requests WHERE status = 'pending' ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST create request
router.post('/', (req, res) => {
    const { table } = req.body;
    if (!table) return res.status(400).json({ error: "Table number required" });

    const query = "INSERT INTO waiter_requests (table_no) VALUES (?)";
    db.query(query, [table], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const newRequest = { id: result.insertId, table_no: table, status: 'pending', created_at: new Date() };

        // Emit socket event
        if (req.io) {
            req.io.emit("callWaiter", { table: table, id: result.insertId, time: new Date() });
        }

        res.status(201).json(newRequest);
    });
});

// PUT resolve request
router.put('/:id/resolve', (req, res) => {
    const { id } = req.params;
    db.query("UPDATE waiter_requests SET status = 'resolved' WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;
