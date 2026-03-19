const db = require("./config/db");
const fs = require("fs");
const path = require("path");

const publicImagesPath = path.join(__dirname, "../frontend/public/images");

const fixImages = async () => {
    try {
        const files = fs.readdirSync(publicImagesPath).filter(f => !fs.statSync(path.join(publicImagesPath, f)).isDirectory());
        console.log(`Found ${files.length} image files in public/images`);

        db.query("SELECT id, name, image_url, category, sub_category FROM menu", async (err, items) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            console.log(`Auditing ${items.length} menu items...`);
            let updatedCount = 0;

            for (const item of items) {
                let currentUrl = item.image_url || "";
                let filename = currentUrl.replace("/images/", "");

                // Try to find a match if the current one doesn't exist
                let match = files.find(f => f.toLowerCase() === filename.toLowerCase());

                if (!match) {
                    // Try replacing underscores with dashes
                    let dashName = filename.replace(/_/g, "-");
                    match = files.find(f => f.toLowerCase().includes(dashName.toLowerCase().split('.')[0]));
                }

                if (!match) {
                    // Try matching by item name
                    let nameSlug = item.name.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
                    match = files.find(f => f.toLowerCase().includes(nameSlug));
                }

                if (match) {
                    const newUrl = `/images/${match}`;
                    if (currentUrl !== newUrl) {
                        await new Promise((resolve) => {
                            db.query("UPDATE menu SET image_url = ? WHERE id = ?", [newUrl, item.id], (err) => {
                                if (!err) updatedCount++;
                                resolve();
                            });
                        });
                    }
                } else {
                    // Fallback to a generic image based on category if still nothing
                    let fallback = "/images/placeholder.png";
                    const cat = (item.category || "").toLowerCase();
                    if (cat.includes("drink")) fallback = "/images/category/drinks.png";
                    else if (cat.includes("dessert")) fallback = "/images/category/desserts.png";
                    else if (cat.includes("starter")) fallback = "/images/category/starters.png";
                    else fallback = "/images/category/main-menu.png";

                    if (currentUrl !== fallback) {
                        await new Promise((resolve) => {
                            db.query("UPDATE menu SET image_url = ? WHERE id = ?", [fallback, item.id], (err) => {
                                if (!err) updatedCount++;
                                resolve();
                            });
                        });
                    }
                }
            }

            console.log(`✅ Finished. Updated ${updatedCount} item image paths.`);
            process.exit();
        });
    } catch (error) {
        console.error("Critical error:", error);
        process.exit(1);
    }
};

fixImages();
