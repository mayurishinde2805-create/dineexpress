const db = require("./config/db");
const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "../frontend/public/images");

async function repair() {
    console.log("🛠️ Starting Menu Repair...");

    // Get all image files
    const files = fs.readdirSync(imagesDir).filter(f => !fs.statSync(path.join(imagesDir, f)).isDirectory());
    console.log(`Found ${files.length} images in public/images`);

    db.query("SELECT * FROM menu", async (err, items) => {
        if (err) { console.error(err); process.exit(1); }

        let updated = 0;
        for (const item of items) {
            let updates = {};

            // 1. Fix Image URL
            let currentImg = item.image_url || "";
            let match = null;

            // Try to match item name to file
            const slug = item.name.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
            match = files.find(f => f.toLowerCase().includes(slug));

            if (!match && currentImg) {
                const existing = currentImg.split("/").pop();
                match = files.find(f => f.toLowerCase() === existing.toLowerCase());
            }

            if (match) {
                updates.image_url = `/images/${match}`;
            } else {
                // Category fallbacks
                const cat = item.category.toLowerCase();
                if (cat.includes("drink")) updates.image_url = "/images/blue-lagoon.jpg";
                else if (cat.includes("dessert")) updates.image_url = "/images/dessert-combo-plate.webp";
                else if (cat.includes("starter")) updates.image_url = "/images/mixed-starter-platter.png";
                else updates.image_url = "/images/chicken-shawarma-plate.jpg";
            }

            // 2. Inject Variants if missing
            if (!item.variants || item.variants === "[]" || item.variants === "null") {
                if (item.category === "Drinks") {
                    updates.variants = JSON.stringify([
                        { name: "Regular", price: item.price },
                        { name: "Large", price: Math.round(item.price * 1.4) }
                    ]);
                } else if (item.category === "Desserts" && item.sub_category === "Ice Creams") {
                    updates.variants = JSON.stringify([
                        { name: "Single Scoop", price: item.price },
                        { name: "Double Scoop", price: Math.round(item.price * 1.8) }
                    ]);
                }
            }

            if (Object.keys(updates).length > 0) {
                const keys = Object.keys(updates).map(k => `${k} = ?`).join(", ");
                const params = [...Object.values(updates), item.id];
                await new Promise(r => db.query(`UPDATE menu SET ${keys} WHERE id = ?`, params, r));
                updated++;
            }
        }

        console.log(`✅ Menu Repair Finished. Updated ${updated} items.`);
        process.exit(0);
    });
}

repair();
