require('dotenv').config();
const db = require('./config/db');
db.query("SELECT * FROM users WHERE role='admin' AND created_at >= CURDATE()", (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
