require('dotenv').config();
const db = require('./config/db');
db.query('SELECT * FROM otps ORDER BY id DESC LIMIT 5', (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
