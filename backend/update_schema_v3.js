const db = require("./config/db");

const updateSchema = async () => {
    console.log("Updating schema for Phase 3...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // 1. Add payment_status to orders
        try {
            await runQuery("ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'Unpaid'");
            console.log("✅ Added payment_status to orders");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ payment_status already exists in orders");
            else throw e;
        }

        // 2. Add special_request to order_items
        try {
            await runQuery("ALTER TABLE order_items ADD COLUMN special_request TEXT");
            console.log("✅ Added special_request to order_items");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ special_request already exists in order_items");
            else throw e;
        }

        console.log("🎉 Schema Update Complete!");
        process.exit();

    } catch (err) {
        console.error("❌ Schema Update Failed:", err);
        process.exit(1);
    }
};

updateSchema();
