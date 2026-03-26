require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

// List of actual image files we found in frontend/public/images
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

async function repair() {
    console.log("🛠️ [PRODUCTION] Starting Image Filename Repair...");

    db.query("SELECT id, name FROM menu_items", async (err, items) => {
        if (err) {
            console.error("❌ Query Error:", err);
            process.exit(1);
        }

        console.log(`🔍 Found ${items.length} items to check.`);

        for (const item of items) {
            // Clean name for matching (e.g. "Paneer Tikka" -> "paneer-tikka")
            const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            
            // 1. Try exact start match
            let match = actualImages.find(img => img.toLowerCase().replace(/\.[^/.]+$/, "").startsWith(cleanName));

            // 2. Try partial match if not found
            if (!match) {
                const parts = cleanName.split('-');
                if (parts.length > 1) {
                    const firstTwo = parts.slice(0, 2).join('-');
                    match = actualImages.find(img => img.toLowerCase().includes(firstTwo));
                }
            }

            if (match) {
                console.log(`✅ MATCH: "${item.name}" -> ${match}`);
                await new Promise(resolve => {
                    db.query("UPDATE menu_items SET image_url = ? WHERE id = ?", [match, item.id], resolve);
                });
            } else {
                // Secondary check for common variations
                if (item.name.includes("Tea")) {
                    match = actualImages.find(img => img.includes("tea"));
                } else if (item.name.includes("Coffee")) {
                    match = actualImages.find(img => img.includes("coffee") || img.includes("latte") || img.includes("cappuccino"));
                }

                if (match) {
                   console.log(`⚠️ FUZZY MATCH: "${item.name}" -> ${match}`);
                   await new Promise(resolve => {
                       db.query("UPDATE menu_items SET image_url = ? WHERE id = ?", [match, item.id], resolve);
                   });
                } else {
                   console.log(`❌ NO MATCH: "${item.name}"`);
                }
            }
        }

        console.log("\n🚀 [FINISH] Production Image Repair Complete!");
        process.exit(0);
    });
}

repair();
