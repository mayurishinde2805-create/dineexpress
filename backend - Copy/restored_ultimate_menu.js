const fs = require('fs');
const path = require('path');
const db = require('./config/db');

/**
 * RESTORED ULTIMATE MENU
 * Combines Food and Drinks from the most complete sources.
 */

const getArrayFromJS = (filename, varNameRegex) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        const match = content.match(new RegExp(`const ${varNameRegex} = (\\[[\\s\\S]*?\\]);`));
        if (match) {
            // Safe eval of the array only
            return eval(match[1]);
        }
    } catch (e) {
        console.error(`Error in ${filename}:`, e.message);
    }
    return [];
};

const foodItems = getArrayFromJS('seed_food_with_variants.js', 'menuItems');
const drinkItems = getArrayFromJS('seed_drinks_complete.js', 'drinksItems');
const luxuryItems = getArrayFromJS('seed_final_luxury.js', 'menuItems');
const completeItems = getArrayFromJS('seed_complete_menu.js', 'menuItems');

// Restoration V2 has multiple arrays and complex structure.
// I'll extract them individually.
const v2Starters = getArrayFromJS('seed_full_restoration_v2.js', 'starterItems');
const v2Main = getArrayFromJS('seed_full_restoration_v2.js', 'mainItems');
const v2Desserts = getArrayFromJS('seed_full_restoration_v2.js', 'dessertItems');
const v2Drinks = getArrayFromJS('seed_full_restoration_v2.js', 'drinkItems');

const extraConti = getArrayFromJS('seed_continental_fusion_v1.js', 'menuItems');
const extraDesserts = getArrayFromJS('seed_desserts_v2.js', 'menuItems');
const premiumItems = getArrayFromJS('seed_premium_menu.js', 'items'); // Note: some use 'items'

let masterMap = new Map();

// Add all items, de-duplicating by name
[
    ...foodItems, ...drinkItems, ...luxuryItems, ...completeItems,
    ...v2Starters, ...v2Main, ...v2Desserts, ...v2Drinks,
    ...extraConti, ...extraDesserts, ...premiumItems
].forEach(item => {
    if (!item.name) return;
    const name = item.name.trim();
    const key = name.toLowerCase();

    if (!masterMap.has(key)) {
        masterMap.set(key, item);
    } else {
        // Preference logic: keep the one with variants or image
        const existing = masterMap.get(key);
        if ((item.variants && !existing.variants) || (item.image_url && !existing.image_url)) {
            masterMap.set(key, item);
        }
    }
});

const allItems = Array.from(masterMap.values());

console.log(`Summary:`);
console.log(`- Food: ${foodItems.length}`);
console.log(`- Drinks: ${drinkItems.length}`);
console.log(`- Luxury Extra: ${luxuryItems.length}`);
console.log(`- Total Unique: ${allItems.length}`);

const seed = async () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error("Error clearing menu:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, type, price, description, diet, image_url, variants) VALUES ?";
        const values = allItems.map(i => [
            i.name,
            i.category || "General",
            i.sub_category || null,
            i.type || null,
            i.price || 0,
            i.description || i.name,
            i.diet || (i.name.toLowerCase().includes('chicken') || i.name.toLowerCase().includes('fish') || i.name.toLowerCase().includes('mutton') || i.name.toLowerCase().includes('prawn') ? 'non-veg' : 'veg'),
            i.image_url || null,
            (i.variants && typeof i.variants === 'object') ? JSON.stringify(i.variants) : (typeof i.variants === 'string' ? i.variants : null)
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding ULTIMATE menu:", err);
            } else {
                console.log(`\n✅ SUCCESS: ${result.affectedRows} items restored!`);
                console.log("Your menu is now full and luxury.");
            }
            process.exit();
        });
    });
};

if (allItems.length > 0) {
    seed();
} else {
    console.log("No items found. Check file paths and regex.");
    process.exit(1);
}
