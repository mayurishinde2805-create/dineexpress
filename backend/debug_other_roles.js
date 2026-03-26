require('dotenv').config();
const db = require('./config/db');

db.query("SELECT id, email, fullname, role, is_verified, admin_code, kitchen_code FROM users WHERE role IN ('customer', 'kitchen') ORDER BY id DESC LIMIT 5", (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Recent Customers and Kitchen Staff:");
        console.log(JSON.stringify(res, null, 2));
    }
    process.exit();
});
