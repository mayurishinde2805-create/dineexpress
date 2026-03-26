require('dotenv').config();
const db = require('./config/db');
const email = 'mayurishinde2805@gmail.com';
db.query('SELECT * FROM otps WHERE email = ? ORDER BY id DESC', [email], (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
