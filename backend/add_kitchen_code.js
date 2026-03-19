const db = require("./config/db");

const addKitchenCodeColumn = async () => {
    console.log("🛠️ Adding 'kitchen_code' to Users Table...");

    // Check if column exists
    const checkSql = "SHOW COLUMNS FROM users LIKE 'kitchen_code'";

    db.query(checkSql, (err, result) => {
        if (err) {
            console.error("Error checking column:", err);
            process.exit(1);
        }

        if (result.length === 0) {
            const sql = "ALTER TABLE users ADD COLUMN kitchen_code VARCHAR(20) DEFAULT NULL";
            db.query(sql, (err) => {
                if (err) {
                    console.error("❌ Failed to add kitchen_code:", err);
                    process.exit(1);
                }
                console.log("✅ 'kitchen_code' column added successfully!");
                process.exit();
            });
        } else {
            console.log("⚠️ 'kitchen_code' column already exists.");
            process.exit();
        }
    });
};

addKitchenCodeColumn();
