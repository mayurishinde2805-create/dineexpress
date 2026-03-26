require('dotenv').config();
const db = require('./config/db');

db.query("SELECT id, fullname, email, role, is_verified, admin_code, kitchen_code FROM users ORDER BY id DESC LIMIT 5", (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Latest 5 Registrations:");
        console.log(JSON.stringify(res, null, 2));
    }
    process.exit();
});
