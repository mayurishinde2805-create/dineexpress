const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const db = require('./config/db');

// The original 89 items
const originalData = JSON.parse(fs.readFileSync('./db_dump.json', 'utf8'));

// Full list of validated hyphenated images
const actualImages = [
    "aloo-tikki.png", "black-forest.jpg", "blue-lagoon.jpg", "brownie-&-cake-combo.jpg",
    "butter-chicken.png", "buttermilk-(chaas).jpg", "cappuccino.jpg", "cheese-balls.png",
    "cheese-garlic-bread.png", "chicken-65.png", "chicken-biryani.png", "chicken-burrito.jpg",
    "chicken-lollipop.png", "chicken-malai-tikka.png", "chicken-manchurian-(gravy).png",
    "chicken-shawarma-plate.jpg", "chicken-spring-roll.png", "chicken-tandoori.png",
    "chicken-tikka.png", "chilli-chicken.png", "chilli-paneer.png", "chocolate-brownie.jpg",
    "chocolate-cake.jpg", "chocolate-ice-cream.jpg", "chocolate-shake.jpg", "chole-bhature.png",
    "coconut-water.jpg", "coke.jpg", "crispy-baby-corn.png", "crispy-corn.png", "dahi-kebab.png",
    "dal-makhani.png", "dessert-combo-plate.webp", "double-scoop-ice-cream.jpg",
    "falafel-wrap.jpg", "fish-fingers.png", "french-fries.png", "fruit-punch.jpg",
    "garlic-bread.png", "gulab-jamun.jpg", "hara-bhara-kebab.jpg", "jalebi.jpg",
    "kitkat-shake.jpg", "latte.jpg", "lemon-mint-mojito.jpg", "malai-paneer-tikka.png",
    "mango-shake.jpg", "masala-tea.jpg", "milk-tea.jpg", "mint-cooler.jpg",
    "mixed-fruit-juice.jpg", "mixed-starter-platter.png", "mutton-rogan-josh.png",
    "nachos-with-cheese.png", "non-veg-starter-combo.png", "onion-bhaji.png",
    "orange-juice.png", "oreo-shake.jpg", "palak-paneer.png", "paneer-butter-masala.png",
    "paneer-pakoda.png", "paneer-tikka.jpg", "pepsi.jpg", "pineapple-juice.jpg",
    "potato-wedges.png", "prawns-fry.png", "ras-malai.jpg", "rasgulla.jpg",
    "red-bull.jpg", "red-velvet.jpg", "regular-tea.jpg", "salted-lassi.jpg",
    "samosa.png", "schezwan-fried-rice.png", "seekh-kebab.png", "sprite.jpg",
    "sting.jpg", "sweet-lassi.jpg", "sweet-lime-juice.jpg", "vanilla-ice-cream.jpg",
    "vanilla-shake.jpg", "veg-hakka-noodles.jpg", "veg-manchurian.png", "veg-spring-rolls.png",
    "veg-tacos.png", "virgin-mojito.jpg", "walnut-brownie.jpg", "watermelon-juice.jpg",
    "watermelon-splash.jpg"
];

async function restore() {
    console.log("🛠️ Starting Restoration...");

    // 1. Wipe
    console.log("🔥 Clearing table: menu_items");
    await new Promise((resolve, reject) => {
        db.query("DELETE FROM menu_items", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    console.log("🌱 Inserting 89 Original items...");
    let successCount = 0;

    for (const item of originalData) {
        const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        let matchedImage = actualImages.find(img => img.toLowerCase().replace(/\.[^/.]+$/, "").startsWith(cleanName));

        const sql = `INSERT INTO menu_items (name, price, image_url, model_url, diet, description, category, sub_category) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            item.name, 
            item.price || 200, 
            matchedImage || null, 
            item.model_url || `/models/${cleanName}.glb`, 
            'veg', 
            item.description || item.name, 
            item.category, 
            item.sub_category
        ];

        try {
            await new Promise((resolve, reject) => {
                db.query(sql, values, (err) => {
                    if (err) {
                        console.error(`❌ FAILED: ${item.name}`, err.message);
                        reject(err);
                    } else {
                        successCount++;
                        resolve();
                    }
                });
            });
        } catch (e) {
            // Continue with next item
        }
    }

    console.log(`✅ RESTORED: ${successCount} items to menu_items.`);
    
    // Final check
    db.query("SELECT COUNT(*) as total FROM menu_items", (err, res) => {
        console.log("🚀 FINAL DB COUNT:", res ? res[0].total : "ERROR");
        process.exit(0);
    });
}

restore().catch(err => {
    console.error("🔥 CRITICAL FAILURE:", err);
    process.exit(1);
});
