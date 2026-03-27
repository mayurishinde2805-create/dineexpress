const db = require('./config/db');

/**
 * Rapid Price Variator
 * Adds a small random percentage offset to each item's price
 * to avoid "Everything is ₹199" issues and satisfy user requests.
 */
exports.diversifyPrices = (callback) => {
    console.log("🚀 Variating prices for all menu items...");

    db.query("SELECT id, price FROM menu", (err, items) => {
        if (err) {
            console.error(err);
            if (callback) callback(err);
            return;
        }

        console.log(`📊 Found ${items.length} items to update.`);
        if (items.length === 0) {
            if (callback) callback(null);
            return;
        }

        let completed = 0;
        items.forEach((item) => {
            const currentPrice = parseFloat(item.price);
            const noise = Math.floor(Math.random() * 40) + 5; 
            const newPrice = Math.round((currentPrice + noise) / 5) * 5; 

            db.query("UPDATE menu SET price = ? WHERE id = ?", [newPrice, item.id], (err2) => {
                completed++;
                if (err2) console.error(`Error updating ID ${item.id}:`, err2);
                
                if (completed === items.length) {
                    console.log("✅ All prices Variated successfully!");
                    if (callback) callback(null);
                }
            });
        });
    });
}

if (require.main === module) {
    exports.diversifyPrices();
}

