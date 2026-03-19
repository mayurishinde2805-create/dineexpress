const db = require("./config/db");

const restoreDB = async () => {
    console.log("🛠️ Restoring DineExpress Database...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        console.log("1. Creating Users Table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullname VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                mobile VARCHAR(20) UNIQUE,
                password VARCHAR(255),
                role VARCHAR(50) DEFAULT 'customer',
                is_verified BOOLEAN DEFAULT 0,
                admin_code VARCHAR(20) UNIQUE DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("2. Creating OTPS Table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS otps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255),
                mobile VARCHAR(20),
                otp VARCHAR(10),
                expires_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("3. Creating Menu Table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS menu (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                description TEXT,
                price DECIMAL(10,2),
                category VARCHAR(100),
                sub_category VARCHAR(100),
                image_url VARCHAR(255),
                variants JSON,
                is_available BOOLEAN DEFAULT 1
            )
        `);

        console.log("4. Creating Orders Table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                table_number VARCHAR(50),
                total_amount DECIMAL(10,2),
                status VARCHAR(50) DEFAULT 'Pending',
                payment_status VARCHAR(50) DEFAULT 'Pending',
                payment_mode VARCHAR(50) DEFAULT 'Cash',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        console.log("5. Creating Order Items Table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                item_id INT,
                quantity INT,
                price DECIMAL(10,2),
                variant VARCHAR(50),
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        console.log("6. Creating Feedback Table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                user_id INT,
                rating INT,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Database Restored Successfully!");
        process.exit();

    } catch (err) {
        console.error("❌ Restore Failed:", err);
        process.exit(1);
    }
};

restoreDB();
