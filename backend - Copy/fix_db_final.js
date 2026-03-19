const db = require("./config/db");

const fixDatabase = async () => {
    console.log("🛠️ Starting Comprehensive Database Fix...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // 1. Ensure USERS table exists
        console.log("1. Checking Users Table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullname VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                mobile VARCHAR(20) UNIQUE,
                password VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Add ROLE column if missing
        console.log("2. Ensuring 'role' column...");
        try {
            await runQuery("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'customer'");
            console.log("   ✅ Added 'role' column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("   ℹ️ 'role' column already exists");
            else throw e;
        }

        // 3. Add ADMIN_CODE column if missing
        console.log("3. Ensuring 'admin_code' column...");
        try {
            await runQuery("ALTER TABLE users ADD COLUMN admin_code VARCHAR(20) UNIQUE DEFAULT NULL");
            console.log("   ✅ Added 'admin_code' column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("   ℹ️ 'admin_code' column already exists");
            else throw e;
        }

        // 4. Add IS_VERIFIED column if missing
        console.log("4. Ensuring 'is_verified' column...");
        try {
            await runQuery("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0");
            console.log("   ✅ Added 'is_verified' column");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("   ℹ️ 'is_verified' column already exists");
            else throw e;
        }

        console.log("✅ Database Fix Complete! You can now register as Admin.");
        process.exit();

    } catch (err) {
        console.error("❌ Fix Failed:", err);
        process.exit(1);
    }
};

fixDatabase();
