require('dotenv').config();
const db = require('./config/db');
db.query('SELECT category, sub_category, COUNT(*) as count FROM menu_items WHERE category IN ("Drinks", "Desserts") GROUP BY category, sub_category', (err, res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit();
});
