const db = require('./config/db');

console.log('🔧 Reverting Menu Table Schema to Original naming...\n');

const queries = [
    "ALTER TABLE menu CHANGE COLUMN available is_available TINYINT(1) DEFAULT 1",
    // Ensure diet and type are there since seed script uses diet
    "ALTER TABLE menu MODIFY COLUMN type VARCHAR(100) DEFAULT NULL",
    "ALTER TABLE menu MODIFY COLUMN diet ENUM('veg', 'non-veg') DEFAULT 'veg'"
];

let completed = 0;

queries.forEach(query => {
    db.query(query, (err) => {
        if (err) {
            console.log(`⚠️ Note: ${err.message}`);
        } else {
            console.log(`✅ Success: ${query}`);
        }
        completed++;
        if (completed === queries.length) {
            console.log('\n✅ Schema reversion finished.');
            process.exit();
        }
    });
});
