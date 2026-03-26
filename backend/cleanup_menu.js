require('dotenv').config();
const db = require('./config/db');

async function cleanup() {
    console.log("🛠️ Starting Final Cleanup...");

    // Remove unwanted categories
    const allowedCategories = ['Starters', 'Main Menu', 'Desserts', 'Drinks'];
    
    db.query("DELETE FROM menu_items WHERE category NOT IN (?)", [allowedCategories], (err) => {
        if (err) console.error("Error deleting categories:", err);
        else console.log("✅ Removed extra categories.");

        // Remove items without images
        db.query("DELETE FROM menu_items WHERE image_url IS NULL OR image_url = ''", (err2) => {
            if (err2) console.error("Error deleting items without images:", err2);
            else console.log("✅ Removed items without images.");

            // Final count
            db.query("SELECT COUNT(*) as total FROM menu_items", (err3, res) => {
                console.log("🚀 FINAL MENU ITEM COUNT:", res ? res[0].total : "ERROR");
                
                // Show a sample of categories
                db.query("SELECT category, COUNT(*) as count FROM menu_items GROUP BY category", (err4, res4) => {
                    console.log("Categories:", res4);
                    process.exit(0);
                });
            });
        });
    });
}

cleanup();
