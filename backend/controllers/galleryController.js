const db = require('../config/db');

exports.getGalleryImages = (req, res) => {
    // Fetch items that have a valid external image URL
    const sql = "SELECT id, name, category, image_url FROM menu WHERE image_url IS NOT NULL AND image_url != ''";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
