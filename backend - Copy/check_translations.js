const db = require('./config/db');

db.query("SELECT name, variants_hi FROM menu WHERE variants_hi IS NOT NULL LIMIT 5", (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log(JSON.stringify(results, null, 2));
    }
    process.exit();
});
