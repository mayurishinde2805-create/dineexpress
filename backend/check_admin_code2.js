require('dotenv').config();
const db = require('./config/db');
db.query("SELECT id, email, role, is_verified, admin_code FROM users WHERE email='mayurishinde2805@gmail.com'", (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
