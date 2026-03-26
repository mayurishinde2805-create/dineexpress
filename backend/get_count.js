require('dotenv').config();
const db = require('./config/db');
db.query('SELECT COUNT(*) as total FROM menu_items', (err, res) => {
    console.log("FINAL COUNT:", res[0].total);
    db.query('SELECT category, COUNT(*) as count FROM menu_items GROUP BY category', (err2, res2) => {
        console.log("CATEGORIES:", res2);
        process.exit();
    });
});
