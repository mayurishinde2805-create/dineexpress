const db = require("./config/db");

const updateSchemaV6 = async () => {
    console.log("Updating schema (V6) - Adding payment_method...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        await runQuery("ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Cash'");
        console.log("✅ Added payment_method column");
        process.exit();

    } catch (err) {
        // If it fails (e.g. duplicate column), we just ignore and exit
        console.error("Schema update might have failed (column might exist):", err.message);
        process.exit(0);
    }
};

updateSchemaV6();
