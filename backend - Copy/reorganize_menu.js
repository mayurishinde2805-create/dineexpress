const db = require('./config/db');

const reorganize = async () => {
    try {
        console.log("Starting Menu Reorganization...");

        // 1. RENAME MAIN CATEGORIES
        await query("UPDATE menu SET category = 'Main Course' WHERE category IN ('Main Menu', 'Continental', 'Fusion', 'Continental / Fusion')");

        // 2. MOVE CONTINENTAL/FUSION STARTERS TO STARTERS CATEGORY
        await query("UPDATE menu SET category = 'Starters' WHERE category = 'Main Course' AND (sub_category LIKE '%Starters%' OR name LIKE '%Pakoda%' OR name LIKE '%Tikka%' OR name LIKE '%Fries%' OR name LIKE '%Garlic Bread%')");

        // 3. NORMALIZE SUB-CATEGORIES FOR STARTERS
        await query("UPDATE menu SET sub_category = 'Veg Starters' WHERE category = 'Starters' AND (sub_category IN ('Veg Starters', 'Vegetarian Starters', 'Indian - Veg') OR diet = 'veg')");
        await query("UPDATE menu SET sub_category = 'Non-Veg Starters' WHERE category = 'Starters' AND (sub_category IN ('Non-Veg Starters', 'Non-Vegetarian Starters', 'Indian - Non-Veg') OR diet = 'non-veg')");

        // 4. NORMALIZE SUB-CATEGORIES FOR MAIN COURSE
        await query("UPDATE menu SET sub_category = 'Indian' WHERE category = 'Main Course' AND sub_category LIKE 'Indian%'");
        await query("UPDATE menu SET sub_category = 'North Indian' WHERE category = 'Main Course' AND sub_category LIKE 'North Indian%'");
        await query("UPDATE menu SET sub_category = 'Chinese' WHERE category = 'Main Course' AND sub_category LIKE 'Chinese%'");
        await query("UPDATE menu SET sub_category = 'Rice & Breads' WHERE category = 'Main Course' AND (sub_category LIKE '%Rice%' OR sub_category LIKE '%Breads%' OR name LIKE '%Rice%' OR name LIKE '%Naan%' OR name LIKE '%Roti%')");
        // Continental/Fusion items that became Main Course but had sub_category 'Main Course' or 'Main'
        await query("UPDATE menu SET sub_category = 'Continental' WHERE category = 'Main Course' AND (sub_category IN ('Main Course', 'Pasta & Rice') OR category = 'Continental')");
        await query("UPDATE menu SET sub_category = 'Fusion' WHERE category = 'Main Course' AND sub_category LIKE '%Fusion%'");

        // 5. NORMALIZE SUB-CATEGORIES FOR DESSERTS
        await query("UPDATE menu SET sub_category = 'Ice Cream' WHERE category = 'Desserts' AND sub_category IN ('Ice Cream', 'Ice Creams', 'Sundaes & Combos')");
        await query("UPDATE menu SET sub_category = 'Cakes & Brownies' WHERE category = 'Desserts' AND sub_category IN ('Cakes', 'Brownies')");
        await query("UPDATE menu SET sub_category = 'Specialties' WHERE category = 'Desserts' AND sub_category IN ('Chef''s Special', 'Combos')");
        await query("UPDATE menu SET sub_category = 'Sweets & Bites' WHERE category = 'Desserts' AND sub_category IN ('Indian Sweets', 'Chocolates & Dessert Bites', 'Cookies & Biscuits')");

        // MOVE COLD COFFEE TO DRINKS
        await query("UPDATE menu SET category = 'Drinks', sub_category = 'Coffee' WHERE category = 'Desserts' AND sub_category = 'Cold Coffee'");
        // MOVE MILKSHAKES TO DRINKS
        await query("UPDATE menu SET category = 'Drinks', sub_category = 'Shakes' WHERE category = 'Desserts' AND sub_category = 'Milkshakes'");

        // 6. NORMALIZE SUB-CATEGORIES FOR DRINKS
        await query("UPDATE menu SET sub_category = 'Tea' WHERE category = 'Drinks' AND sub_category LIKE '%Tea%'");
        await query("UPDATE menu SET sub_category = 'Coffee' WHERE category = 'Drinks' AND sub_category LIKE '%Coffee%'");
        await query("UPDATE menu SET sub_category = 'Mocktails' WHERE category = 'Drinks' AND sub_category LIKE '%Mocktails%'");
        await query("UPDATE menu SET sub_category = 'Mocktails' WHERE category = 'Drinks' AND sub_category LIKE '%Cooler%'");
        await query("UPDATE menu SET sub_category = 'Juices' WHERE category = 'Drinks' AND sub_category LIKE '%Juices%'");
        await query("UPDATE menu SET sub_category = 'Shakes' WHERE category = 'Drinks' AND sub_category LIKE '%Shakes%'");
        await query("UPDATE menu SET sub_category = 'Traditional' WHERE category = 'Drinks' AND sub_category IN ('Indian Drinks', 'Healthy Drinks')");

        // 7. HANDLE GENERIC VEG/NON-VEG IN MAIN COURSE
        await query("UPDATE menu SET sub_category = 'Continental' WHERE category = 'Main Course' AND sub_category IN ('Veg', 'Non-Veg')");

        // 8. FINAL CLEANUP OF DIET STRINGS
        await query("UPDATE menu SET diet = 'non-veg' WHERE diet IN ('non-vegetarian', 'Non Veg', 'nonveg')");
        await query("UPDATE menu SET diet = 'veg' WHERE diet IN ('vegetarian', 'Veg', 'veg') OR diet IS NULL");

        console.log("✅ Menu Reorganization Complete!");
        process.exit();
    } catch (err) {
        console.error("❌ Error during reorganization:", err);
        process.exit(1);
    }
};

function query(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

reorganize();
