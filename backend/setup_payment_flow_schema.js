const db = require("./config/db");

const setupSchema = async () => {
    console.log("🛠️ Setting up Secure Payment & Order Flow Schema...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // 1. ORDERS Table
        console.log("1. Checking 'orders' table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                table_number VARCHAR(50),
                total_amount DECIMAL(10,2),
                payment_method VARCHAR(50), -- CASH / ONLINE
                payment_status VARCHAR(50) DEFAULT 'Pending', -- PENDING / PAID / FAILED
                order_status VARCHAR(50) DEFAULT 'Placed',    -- PLACED / PREPARING / READY / SERVED
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        // Ensure columns exist (if table already existed)
        // We assume typical setup, but let's be safe later if needed.

        // 2. ORDER_ITEMS Table (Standard)
        console.log("2. Checking 'order_items' table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                item_id INT,
                quantity INT,
                price DECIMAL(10,2),
                variant VARCHAR(50),
                special_request TEXT,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        // 3. PAYMENTS Table (New)
        console.log("3. Creating 'payments' table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                payment_method VARCHAR(50),      -- Cart / Online
                razorpay_order_id VARCHAR(100),
                razorpay_payment_id VARCHAR(100),
                razorpay_signature VARCHAR(255),
                payment_status VARCHAR(50),
                verified_by VARCHAR(50) DEFAULT 'SYSTEM', -- SYSTEM / ADMIN
                verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        // 4. KITCHEN_ORDERS Table (New - for specific kitchen status tracking if separated)
        console.log("4. Creating 'kitchen_orders' table...");
        await runQuery(`
            CREATE TABLE IF NOT EXISTS kitchen_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT UNIQUE,
                kitchen_status VARCHAR(50) DEFAULT 'New', -- NEW / PREPARING / READY
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        console.log("✅ Schema Setup Complete!");
        process.exit();

    } catch (err) {
        console.error("❌ Schema Setup Failed:", err);
        process.exit(1);
    }
};

setupSchema();
