const db = require('./config/db');

const reorganize = async () => {
    try {
        console.log("Starting Menu Reorganization V2...");

        // 1. CONSOLIDATE TO 4 PRIMARY CATEGORIES (Rename to 'Main Menu' as per user request)
        // Merge all main food categories into 'Main Menu'
        await query("UPDATE menu SET category = 'Main Menu' WHERE category IN ('Main Course', 'Main Menu', 'Continental', 'Fusion', 'Continental / Fusion')");

        // 2. IDENTIFY AND MOVE STARTERS
        // Move items back to Starters if they have a 'Starters' sub_category or are known starters
        await query(`UPDATE menu SET category = 'Starters' 
                    WHERE (category = 'Main Menu' OR category = 'General') 
                    AND (sub_category LIKE '%Starters%' 
                         OR name LIKE '%Pakoda%' 
                         OR name LIKE '%Tikka%' 
                         OR name LIKE '%Fries%' 
                         OR name LIKE '%Garlic Bread%'
                         OR name LIKE '%Manchurian%'
                         OR name LIKE '%Chilli Chicken%'
                         OR type = 'Tandoor'
                         OR sub_category = 'Veg Starters'
                         OR sub_category = 'Non-Veg Starters'
                    )`);

        // 3. NORMALIZE SUB-CATEGORIES FOR STARTERS (NOT Veg/Non-Veg)
        // Use 'type' to create descriptive sub-categories
        await query("UPDATE menu SET sub_category = 'Indian Starters' WHERE category = 'Starters' AND (type = 'Indian' OR sub_category LIKE '%Indian%')");
        await query("UPDATE menu SET sub_category = 'Chinese Starters' WHERE category = 'Starters' AND (type = 'Chinese' OR sub_category LIKE '%Chinese%')");
        await query("UPDATE menu SET sub_category = 'Tandoor Starters' WHERE category = 'Starters' AND type = 'Tandoor'");
        await query("UPDATE menu SET sub_category = 'Continental Starters' WHERE category = 'Starters' AND (type = 'Continental' OR sub_category LIKE '%Continental%')");

        // Fallback for Starters without a clear type
        await query("UPDATE menu SET sub_category = 'Special Starters' WHERE category = 'Starters' AND sub_category IN ('Veg Starters', 'Non-Veg Starters', 'Veg', 'Non-Veg')");

        // 4. NORMALIZE SUB-CATEGORIES FOR MAIN MENU
        await query("UPDATE menu SET sub_category = 'Indian' WHERE category = 'Main Menu' AND (sub_category LIKE 'Indian%' OR sub_category LIKE '%North Indian%')");
        await query("UPDATE menu SET sub_category = 'Chinese' WHERE category = 'Main Menu' AND sub_category LIKE 'Chinese%'");
        await query("UPDATE menu SET sub_category = 'Continental' WHERE category = 'Main Menu' AND (sub_category LIKE 'Continental%' OR sub_category = 'Mexican')");
        await query("UPDATE menu SET sub_category = 'Fusion' WHERE category = 'Main Menu' AND sub_category LIKE '%Fusion%'");
        await query("UPDATE menu SET sub_category = 'Rice & Breads' WHERE category = 'Main Menu' AND (sub_category LIKE '%Rice%' OR sub_category LIKE '%Breads%' OR name LIKE '%Rice%' OR name LIKE '%Naan%' OR name LIKE '%Roti%' OR name LIKE '%Paratha%')");
        await query("UPDATE menu SET sub_category = 'Arabic' WHERE category = 'Main Menu' AND (sub_category = 'Arabic' OR name LIKE '%Shawarma%' OR name LIKE '%Falafel%')");

        // 5. NORMALIZE SUB-CATEGORIES FOR DESSERTS
        await query("UPDATE menu SET sub_category = 'Ice Cream' WHERE category = 'Desserts' AND sub_category IN ('Ice Cream', 'Ice Creams', 'Sundaes & Combos')");
        await query("UPDATE menu SET sub_category = 'Cakes & Brownies' WHERE category = 'Desserts' AND sub_category IN ('Cakes', 'Brownies')");
        await query("UPDATE menu SET sub_category = 'Specialties' WHERE category = 'Desserts' AND sub_category IN ('Chef''s Special', 'Combos', 'Specialties')");
        await query("UPDATE menu SET sub_category = 'Sweets & Bites' WHERE category = 'Desserts' AND sub_category IN ('Indian Sweets', 'Chocolates & Dessert Bites', 'Cookies & Biscuits', 'Sweets & Bites')");

        // Cross-category fixes for Desserts
        await query("UPDATE menu SET category = 'Drinks', sub_category = 'Coffee' WHERE category = 'Desserts' AND (sub_category = 'Cold Coffee' OR name LIKE '%Coffee%')");
        await query("UPDATE menu SET category = 'Drinks', sub_category = 'Shakes' WHERE category = 'Desserts' AND (sub_category = 'Milkshakes' OR name LIKE '%Shake%')");

        // 6. NORMALIZE SUB-CATEGORIES FOR DRINKS
        await query("UPDATE menu SET sub_category = 'Tea' WHERE category = 'Drinks' AND (name LIKE '%Tea%' OR name LIKE '%Chai%')");
        await query("UPDATE menu SET sub_category = 'Coffee' WHERE category = 'Drinks' AND name LIKE '%Coffee%'");
        await query("UPDATE menu SET sub_category = 'Mocktails' WHERE category = 'Drinks' AND (sub_category LIKE '%Mocktails%' OR name LIKE '%Mojito%' OR name LIKE '%Lagoon%' OR name LIKE '%Cooler%' OR name LIKE '%Splash%')");
        await query("UPDATE menu SET sub_category = 'Juices' WHERE category = 'Drinks' AND (sub_category LIKE '%Juices%' OR name LIKE '%Juice%')");
        await query("UPDATE menu SET sub_category = 'Shakes' WHERE category = 'Drinks' AND (sub_category LIKE '%Shakes%' OR name LIKE '%Shake%')");
        await query("UPDATE menu SET sub_category = 'Healthy & Traditional' WHERE category = 'Drinks' AND (sub_category IN ('Indian Drinks', 'Healthy Drinks', 'Traditional') OR name LIKE '%Lassi%' OR name LIKE '%Buttermilk%' OR name LIKE '%Smoothie%')");
        await query("UPDATE menu SET sub_category = 'Soft Drinks' WHERE category = 'Drinks' AND (sub_category IN ('Carbonated', 'Energy Drinks', 'Soft Drinks') OR name IN ('Coke', 'Pepsi', 'Sprite', 'Fanta', 'Red Bull', 'Monster', 'Sting'))");

        // 7. FINAL DIET CLEANUP
        await query("UPDATE menu SET diet = 'non-veg' WHERE name LIKE '%Chicken%' OR name LIKE '%Fish%' OR name LIKE '%Mutton%' OR name LIKE '%Prawn%' OR name LIKE '%Egg%' OR name LIKE '%Kebab%' OR name LIKE '%Wings%' OR name LIKE '%Burrito%' OR name LIKE '%Shawarma%'");
        await query("UPDATE menu SET diet = 'veg' WHERE diet IS NULL OR diet = 'vegetarian'");

        console.log("✅ Menu Reorganization V2 Complete!");
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
