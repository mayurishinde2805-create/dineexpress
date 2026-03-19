const db = require('./config/db');
db.query('DESCRIBE menu', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Menu Columns:');
        res.forEach(r => console.log(`- ${r.Field} (${r.Type})`));
    }
    process.exit();
});
