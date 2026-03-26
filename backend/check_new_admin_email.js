require('dotenv').config();
const db = require('./config/db');
const email = 'mayushinde234@gmail.com';
db.query('SELECT * FROM users WHERE email = ?', [email], (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
