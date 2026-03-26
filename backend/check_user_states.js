require('dotenv').config();
const db = require('./config/db');

const emails = ['mayushinde2805@gmail.com', 'mayurishinde2805@gmail.com', 'kshitijgupta035@gmail.com'];
db.query("SELECT id, email, role, is_verified, admin_code, kitchen_code FROM users WHERE email IN (?)", [emails], (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
