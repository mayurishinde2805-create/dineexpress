require('dotenv').config();
const db = require('./config/db');

db.query("SELECT id, email, role, is_verified, admin_code FROM users WHERE role='admin' ORDER BY id DESC LIMIT 5", (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Registered Admins:");
        console.log(JSON.stringify(res, null, 2));
    }
    process.exit();
});
