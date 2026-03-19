const db = require('../config/db');
const QRCode = require('qrcode');

// GET ALL TABLES
exports.getTables = (req, res) => {
    const sql = "SELECT * FROM tables ORDER BY table_number ASC";
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
};

// ADD TABLE & GENERATE QR
exports.addTable = async (req, res) => {
    const { table_number, capacity } = req.body;

    // Generate QR Content (e.g., URL to order page for this table)
    // Assuming Frontend URL is http://localhost:3000/menu?table=5
    // OR just the table number data
    const qrData = `http://localhost:3000/home?table=${table_number}`;

    try {
        const qrImage = await QRCode.toDataURL(qrData);

        const sql = "INSERT INTO tables (table_number, capacity, status, qr_code) VALUES (?, ?, 'Available', ?)";
        db.query(sql, [table_number, capacity, qrImage], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Table number exists" });
                return res.status(500).send(err);
            }
            res.json({ message: "Table Added", qr_code: qrImage });
        });
    } catch (err) {
        console.error("QR Gen Error:", err);
        res.status(500).json({ message: "QR Generation Failed" });
    }
};

// DELETE TABLE
exports.deleteTable = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tables WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Table Deleted" });
    });
};

// UPDATE STATUS
exports.updateTableStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE tables SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Status Updated" });
    });
};

// REGENERATE QR (Optional)
exports.regenerateQR = async (req, res) => {
    const { id, table_number } = req.body;
    const qrData = `http://localhost:3000/home?table=${table_number}`;
    try {
        const qrImage = await QRCode.toDataURL(qrData);
        db.query("UPDATE tables SET qr_code = ? WHERE id = ?", [qrImage, id], (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "QR Regenerated", qr_code: qrImage });
        });
    } catch (err) {
        res.status(500).send(err);
    }
};
