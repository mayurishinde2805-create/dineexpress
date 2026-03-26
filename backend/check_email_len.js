require('dotenv').config();
const db = require('./config/db');
db.query('SELECT id, email, LENGTH(email) as len FROM users WHERE email LIKE "%mayurishinde2805%"', (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
