const db = require('./config/db');

db.query('SELECT * FROM menu LIMIT 5', (err, rows) => {
    if (err) {
        console.error('Error fetching menu:', err);
    } else {
        console.log('Sample Menu Items:');
        rows.forEach(row => {
            console.log(`- ${row.name} (ID: ${row.id}, Category: ${row.category})`);
            console.log(`  Columns: ${Object.keys(row).join(', ')}`);
        });
        console.log(`\nTotal items check...`);
        db.query('SELECT count(*) as count FROM menu', (err, res) => {
            if (!err) console.log(`Total items: ${res[0].count}`);
            process.exit();
        });
    }
});
