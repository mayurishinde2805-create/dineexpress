require('dotenv').config();
const db = require('./config/db');
db.query('DESCRIBE users', (err, res) => {
    if (err) console.error(err);
    else console.log('SCHEMA:', JSON.stringify(res, null, 2));
    db.query('SHOW INDEX FROM users', (err, res) => {
        if (err) console.error(err);
        else console.log('INDEXES:', JSON.stringify(res, null, 2));
        process.exit();
    });
});
