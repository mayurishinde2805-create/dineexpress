require('dotenv').config();
const db = require('./config/db');
db.query('DESCRIBE otps', (err, res) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(res, null, 2));
    process.exit();
});
