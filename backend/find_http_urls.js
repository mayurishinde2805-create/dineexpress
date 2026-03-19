const db = require('./config/db');
db.query('SELECT id, name, image_url FROM menu WHERE image_url LIKE "http%"', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log(JSON.stringify(res, null, 2));
    }
    process.exit();
});
