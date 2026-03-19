const db = require("./config/db");

const updateSchemaV2 = async () => {
    console.log("Starting schema update V2...");

    const runQuery = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // 1. Update MENU table
        console.log("1. Adding columns to menu table...");
        try {
            await runQuery("ALTER TABLE menu ADD COLUMN sub_category VARCHAR(100)");
        } catch (e) { console.log("   - sub_category might exist"); }

        try {
            await runQuery("ALTER TABLE menu ADD COLUMN variants JSON");
            // variants will store something like: [{"name": "Half", "price": 150}, {"name": "Full", "price": 280}]
        } catch (e) { console.log("   - variants might exist"); }

        // 2. Update ORDER_ITEMS table
        console.log("2. Adding variant to order_items...");
        try {
            await runQuery("ALTER TABLE order_items ADD COLUMN variant VARCHAR(50)");
        } catch (e) { console.log("   - variant column might exist"); }

        console.log("🎉 Schema V2 update complete!");
        process.exit();

    } catch (err) {
        console.error("❌ Schema update failed:", err);
        process.exit(1);
    }
};

updateSchemaV2();
