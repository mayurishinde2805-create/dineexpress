const db = require('./config/db');

/**
 * Rapid Price Variator
 * Adds a small random percentage offset to each item's price
 * to avoid "Everything is ₹199" issues and satisfy user requests.
 */
async function diversifyPrices() {
    console.log("🚀 Variating prices for all menu items...");

    db.query("SELECT id, price FROM menu", (err, items) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        console.log(`📊 Found ${items.length} items to update.`);

        let completed = 0;
        items.forEach((item) => {
            // Add a small random noise (±5% to 15%)
            // Or just map categories to logical ranges
            const currentPrice = parseFloat(item.price);
            
            // Random variance between 5 and 45 rupees to make it look unique
            const noise = Math.floor(Math.random() * 40) + 5; 
            const newPrice = Math.round((currentPrice + noise) / 5) * 5; // Round to nearest 5

            db.query("UPDATE menu SET price = ? WHERE id = ?", [newPrice, item.id], (err2) => {
                completed++;
                if (err2) console.error(`Error updating ID ${item.id}:`, err2);
                
                if (completed === items.length) {
                    console.log("✅ All prices Variated successfully!");
                    process.exit(0);
                }
            });
        });
    });
}

diversifyPrices();
