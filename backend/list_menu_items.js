const db = require('./config/db');
db.query('SELECT name, image_url, category FROM menu WHERE image_url NOT LIKE "/images/3d%" LIMIT 50', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log(JSON.stringify(res, null, 2));
    }
    process.exit();
});
