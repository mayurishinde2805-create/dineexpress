const db = require("./config/db");

const updateSchemaV4 = async () => {
    console.log("Updating schema (V4) - Ensuring variant column...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // Add variant to order_items
        try {
            await runQuery("ALTER TABLE order_items ADD COLUMN variant VARCHAR(50)");
            console.log("✅ Added variant to order_items");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ variant already exists in order_items");
            else throw e;
        }

        console.log("🎉 Schema V4 Update Complete!");
        process.exit();

    } catch (err) {
        console.error("❌ Schema V4 Update Failed:", err);
        process.exit(1);
    }
};

updateSchemaV4();
