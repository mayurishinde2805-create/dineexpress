const fs = require('fs');
const path = require('path');
const db = require('./config/db');

/**
 * MEGA RESTORATION SCRIPT V2
 * Uses a more robust extraction method to get items from all files.
 */

const getItemsFromFile = (filename) => {
    try {
        const filePath = path.join(__dirname, filename);
        if (!fs.existsSync(filePath)) return [];
        const content = fs.readFileSync(filePath, 'utf8');

        // Find all objects matching { name: "...", ... }
        // This is a bit risky but we can try to find where arrays start/end
        // Or better: Use a simple script to 'require' or 'eval' the whole file content 
        // after mocking 'db' and 'require'.

        const sandbox = {
            require: (name) => {
                if (name.includes('db')) return { query: () => { } };
                return {};
            },
            console: { log: () => { }, error: () => { } },
            module: { exports: {} },
            db: { query: () => { } }
        };

        // We'll wrap the content to extract variables ending in 'Items' or named 'items' or 'menuItems'
        const wrapped = `
            (function(){
                let foundItems = [];
                ${content.replace(/db\.query\([\s\S]*/g, '')} // Strip the final seed logic
                
                // Collect any top-level arrays that look like item lists
                const vars = [
                    typeof menuItems !== 'undefined' ? menuItems : [],
                    typeof items !== 'undefined' ? items : [],
                    typeof starterItems !== 'undefined' ? starterItems : [],
                    typeof mainItems !== 'undefined' ? mainItems : [],
                    typeof dessertItems !== 'undefined' ? dessertItems : [],
                    typeof drinkItems !== 'undefined' ? drinkItems : [],
                    typeof drinksItems !== 'undefined' ? drinksItems : []
                ];
                vars.forEach(v => {
                    if (Array.isArray(v)) foundItems = foundItems.concat(v);
                });
                return foundItems;
            })()
        `;

        return eval(wrapped);
    } catch (e) {
        console.error(`Error processing ${filename}:`, e.message);
        return [];
    }
};

const seedFiles = [
    'seed_full_restoration_v2.js',
    'seed_final_luxury.js',
    'seed_food_with_variants.js',
    'seed_drinks_with_variants.js',
    'seed_complete_menu.js',
    'seed_master_menu.js',
    'seed_drinks_complete.js',
    'seed_v3_all.js',
    'seed_v4_complete.js',
    'seed_ultimate.js',
    'seed_full_restoration.js'
];

let masterMap = new Map();

seedFiles.forEach(file => {
    const items = getItemsFromFile(file);
    console.log(`- ${file}: Found ${items.length} items`);
    items.forEach(item => {
        if (!item || !item.name) return;
        const nameKey = item.name.trim().toLowerCase();

        // If we don't have it, or current one has more info (like variants), upgrade it
        if (!masterMap.has(nameKey)) {
            masterMap.set(nameKey, item);
        } else {
            const existing = masterMap.get(nameKey);
            // Prefer versions with images or variants or descriptions
            if ((item.image_url && !existing.image_url) ||
                (item.variants && !existing.variants) ||
                (item.description && item.description.length > (existing.description?.length || 0))) {
                masterMap.set(nameKey, { ...existing, ...item });
            }
        }
    });
});

const allItems = Array.from(masterMap.values());
console.log(`\n==============================================`);
console.log(`🚀 MEGA MERGE SUCCESSFUL!`);
console.log(`Total Unique Items Parsed: ${allItems.length}`);
console.log(`==============================================\n`);

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
            i.diet || (i.name.toLowerCase().includes('chicken') || i.name.toLowerCase().includes('fish') || i.name.toLowerCase().includes('mutton') || i.name.toLowerCase().includes('prawn') ? 'non-veg' : 'veg'),
            i.image_url || null,
            (i.variants && typeof i.variants === 'object') ? JSON.stringify(i.variants) : (typeof i.variants === 'string' ? i.variants : null)
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding MEGA RESTORATION:", err);
            } else {
                console.log(`✅ DATABASE UPDATED: ${result.affectedRows} items restored.`);
                console.log("Enjoy your full luxury menu!");
            }
            process.exit();
        });
    });
};

if (allItems.length > 0) {
    seed();
} else {
    console.log("No items found to seed!");
    process.exit(1);
}
