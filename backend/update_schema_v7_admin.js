const db = require("./config/db");

const updateSchemaV7 = async () => {
    console.log("Updating schema (V7) - Adding admin_code to users...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // Add admin_code column
        try {
            await runQuery("ALTER TABLE users ADD COLUMN admin_code VARCHAR(20) UNIQUE DEFAULT NULL");
            console.log("✅ Added admin_code column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ admin_code column already exists");
            else throw e;
        }

        console.log("🎉 Schema V7 Update Complete!");
        process.exit();

    } catch (err) {
        console.error("❌ Schema V7 Update Failed:", err);
        process.exit(1);
    }
};

updateSchemaV7();
