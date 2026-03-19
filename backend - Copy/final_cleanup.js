const db = require('./config/db');
const q = (sql) => new Promise((resolve, reject) => db.query(sql, (err, res) => err ? reject(err) : resolve(res)));

async function run() {
    try {
        console.log("Finalizing Sub-categories...");
        await q("UPDATE menu SET sub_category = 'Special Starters' WHERE category = 'Starters' AND sub_category IN ('Starters', 'Vegetarian Starters', 'Non-Vegetarian Starters', 'Chef''s Special Starters')");
        await q("UPDATE menu SET sub_category = 'Continental' WHERE category = 'Main Menu' AND sub_category IN ('Main Course', 'Veg', 'Non-Veg')");

        // Merge Drinks sub-categories to be cleaner
        await q("UPDATE menu SET sub_category = 'Coffee' WHERE category = 'Drinks' AND sub_category IN ('Classic Coffee', 'Creamy Iced Coffee', 'Iced Coffee', 'Milk Coffee')");

        console.log("✅ Final Cleanup Done");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
