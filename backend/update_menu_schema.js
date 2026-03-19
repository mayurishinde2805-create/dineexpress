const db = require('./config/db');

console.log('🔧 Updating Menu Table Schema...\n');

const queries = [
    "ALTER TABLE menu ADD COLUMN type VARCHAR(100) DEFAULT NULL",
    "ALTER TABLE menu ADD COLUMN diet ENUM('veg', 'non-veg') DEFAULT 'veg'",
    "ALTER TABLE menu CHANGE COLUMN is_available available TINYINT(1) DEFAULT 1"
];

let completed = 0;

queries.forEach(query => {
    db.query(query, (err) => {
        if (err) {
            console.log(`⚠️ Note: ${err.message}`);
        } else {
            console.log(`✅ Success: ${query.split(' ')[2]}`);
        }
        completed++;
        if (completed === queries.length) {
            console.log('\n✅ Schema update finished.');
            process.exit();
        }
    });
});
