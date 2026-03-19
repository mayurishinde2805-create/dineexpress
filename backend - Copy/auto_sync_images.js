const db = require('./config/db');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = 'C:/Users/MAYURI/OneDrive/Desktop/DineExpress/frontend/public/images';

const syncImages = async () => {
    console.log("🚀 Starting automatic image sync...");

    // 1. Get all images from folder
    const files = fs.readdirSync(IMAGES_DIR).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext);
    });

    console.log(`📂 Found ${files.length} images in public/images.`);

    // 2. Fetch all menu items
    db.query("SELECT id, name FROM menu", (err, items) => {
        if (err) {
            console.error("❌ DB Error:", err);
            process.exit(1);
        }

        console.log(`🗄️ Fetched ${items.length} items from database.`);

        let matchedCount = 0;
        let pending = items.length;

        items.forEach(item => {
            const itemName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');

            // Look for matching file
            const matchingFile = files.find(file => {
                const fileName = path.parse(file).name.toLowerCase().replace(/[^a-z0-9]/g, '');
                return fileName === itemName || itemName.includes(fileName) || fileName.includes(itemName);
            });

            if (matchingFile) {
                const imageUrl = `/images/${matchingFile}`;
                db.query(
                    "UPDATE menu SET image_url = ? WHERE id = ?",
                    [imageUrl, item.id],
                    (err) => {
                        if (err) console.error(`   ❌ Error updating ${item.name}:`, err);
                        else {
                            // console.log(`   ✅ Matched: ${item.name} -> ${matchingFile}`);
                            matchedCount++;
                        }

                        pending--;
                        if (pending === 0) finalize();
                    }
                );
            } else {
                pending--;
                if (pending === 0) finalize();
            }
        });

        const finalize = () => {
            console.log(`\n✨ Sync Complete!`);
            console.log(`✅ Matched and updated: ${matchedCount} items.`);
            console.log(`⚠️ Unmatched items: ${items.length - matchedCount}`);
            process.exit(0);
        };
    });
};

syncImages();
