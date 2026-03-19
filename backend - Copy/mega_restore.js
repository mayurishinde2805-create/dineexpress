const fs = require('fs');
const path = require('path');
const db = require('./config/db');

/**
 * MEGA RESTORATION SCRIPT
 * Merges all unique items from all known seed files to ensure no data is lost.
 */

const extractItems = (filename) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        // Simple regex to find the array of objects
        // Match from [ to ] but carefully
        const match = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (match) {
            // Use eval safely-ish by wrapping in parens
            return eval(`(${match[0]})`);
        }
    } catch (e) {
        console.error(`Failed to extract from ${filename}:`, e.message);
    }
    return [];
};

const seedFiles = [
    'seed_full_restoration_v2.js',
    'seed_final_luxury.js',
    'seed_food_with_variants.js',
    'seed_drinks_with_variants.js',
    'seed_complete_menu.js',
    'seed_master_menu.js',
    'seed_drinks_complete.js'
];

let masterMap = new Map();

seedFiles.forEach(file => {
    const items = extractItems(file);
    console.log(`Read ${items.length} items from ${file}`);
    items.forEach(item => {
        if (!item.name) return;
        // Keep the "best" entry (one with more details if possible)
        const nameKey = item.name.trim().toLowerCase();
        if (!masterMap.has(nameKey) || (item.variants && !masterMap.get(nameKey).variants)) {
            masterMap.set(nameKey, item);
        }
    });
});

const allItems = Array.from(masterMap.values());
console.log(`\n============== MEGA MERGE COMPLETE ==============`);
console.log(`Total Unique Items: ${allItems.length}`);
console.log(`==================================================\n`);

const seed = async () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error("Error clearing menu:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, description, diet, image_url, variants) VALUES ?";
        const values = allItems.map(i => [
            i.name,
            i.category || "General",
            i.sub_category || null,
            i.price || 0,
            i.description || i.name,
            i.diet || (i.category === "Drinks" ? "veg" : "veg"),
            i.image_url || null,
            (i.variants && typeof i.variants === 'object') ? JSON.stringify(i.variants) : (typeof i.variants === 'string' ? i.variants : null)
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding MEGA RESTORATION:", err);
            } else {
                console.log(`🚀 SUCCESS: MEGA RESTORATION COMPLETE!`);
                console.log(`Added ${result.affectedRows} items to the 'menu' table.`);
            }
            process.exit();
        });
    });
};

seed();
