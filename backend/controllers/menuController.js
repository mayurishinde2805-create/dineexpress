const db = require('../config/db');

exports.getMenu = (req, res) => {
    db.query("SELECT * FROM menu", (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
    });
};
