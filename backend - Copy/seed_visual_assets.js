const db = require('./config/db');

const imageMapping = {
    "Paneer": "https://images.unsplash.com/photo-1567184109171-969974513936?q=80&w=800&auto=format&fit=crop",
    "Chicken": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop",
    "Aloo": "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=800&auto=format&fit=crop",
    "Fish": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
    "Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop",
    "Manchurian": "https://images.unsplash.com/photo-1512058560366-cd24270086cd?q=80&w=800&auto=format&fit=crop",
    "Noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
    "Rice": "https://images.unsplash.com/photo-1512058560366-cd24270086cd?q=80&w=800&auto=format&fit=crop",
    "Pasta": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800&auto=format&fit=crop",
    "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    "Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    "Rolls": "https://images.unsplash.com/photo-1534422298391-e4f8c170db0a?q=80&w=800&auto=format&fit=crop",
    "Dessert": "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop",
    "Cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    "Brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
    "Ice Cream": "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=800&auto=format&fit=crop",
    "Coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
    "Tea": "https://images.unsplash.com/photo-1544787210-2211d7c3becf?q=80&w=800&auto=format&fit=crop",
    "Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop"
};

const getAssetUrls = (name) => {
    let imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"; // Default

    for (const [key, url] of Object.entries(imageMapping)) {
        if (name.includes(key)) {
            imageUrl = url;
            break;
        }
    }

    // Model path naming convention: /models/{slugified-name}.glb
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const modelUrl = `/models/${slug}.glb`;

    return { imageUrl, modelUrl };
};

const updateAssets = async () => {
    console.log("🚀 Starting visual assets seeding...");

    db.query("SELECT id, name FROM menu", (err, items) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        let completed = 0;
        if (items.length === 0) process.exit();

        items.forEach(item => {
            const { imageUrl, modelUrl } = getAssetUrls(item.name);

            db.query(
                "UPDATE menu SET image_url = ?, model_url = ? WHERE id = ?",
                [imageUrl, modelUrl, item.id],
                (err) => {
                    completed++;
                    if (err) console.error(`Error updating item ${item.name}:`, err);

                    if (completed === items.length) {
                        console.log(`✅ Visual assets updated for ${items.length} items.`);
                        process.exit();
                    }
                }
            );
        });
    });
};

updateAssets();
