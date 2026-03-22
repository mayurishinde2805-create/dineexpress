const db = require("./config/db");

const migrateToLive = async () => {
    console.log("🚀 Starting Full Database Migration (Clean Slate)...");

    const dropTables = [
        "DROP TABLE IF EXISTS feedback",
        "DROP TABLE IF EXISTS orders",
        "DROP TABLE IF EXISTS menu",
        "DROP TABLE IF EXISTS users",
        "DROP TABLE IF EXISTS tables",
        "DROP TABLE IF EXISTS otps"
    ];

    const createTables = [
        // 1. Users Table
        `CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'customer', 'waiter', 'chef') DEFAULT 'customer',
            kitchen_code VARCHAR(10),
            birthdate DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // 2. Menu Table (Aligned with seed_master_menu.js)
        `CREATE TABLE menu (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            display_name VARCHAR(255),
            category VARCHAR(100) NOT NULL,
            sub_category VARCHAR(100),
            price DECIMAL(10, 2) NOT NULL,
            image_url TEXT,
            description TEXT,
            is_available BOOLEAN DEFAULT TRUE,
            model_url TEXT,
            variants JSON,
            is_3d_optimized BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // 3. Orders Table
        `CREATE TABLE orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            table_number INT,
            items JSON NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL,
            status ENUM('Pending', 'Preparing', 'Ready', 'Served', 'Cancelled', 'Paid') DEFAULT 'Pending',
            payment_status ENUM('Pending', 'Success', 'Failed') DEFAULT 'Pending',
            razorpay_order_id VARCHAR(255),
            payment_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            served_at TIMESTAMP
        )`,

        // 4. Tables Configuration
        `CREATE TABLE tables (
            id INT AUTO_INCREMENT PRIMARY KEY,
            table_number VARCHAR(50) UNIQUE NOT NULL,
            capacity INT DEFAULT 4,
            status VARCHAR(50) DEFAULT 'Available',
            qr_code TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // 5. Feedback Table
        `CREATE TABLE feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            rating INT CHECK (rating BETWEEN 1 AND 5),
            comments TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        // 6. OTPs Table
        `CREATE TABLE otps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp VARCHAR(6) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    // Drop old tables
    for (let sql of dropTables) {
        await new Promise(resolve => db.query(sql, resolve));
    }
    console.log("🗑️ Old tables cleared.");

    // Create new tables
    for (let sql of createTables) {
        try {
            await new Promise((resolve, reject) => {
                db.query(sql, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log(`✅ Table created successfully.`);
        } catch (err) {
            console.error(`❌ Error creating table:`, err.message);
        }
    }

    console.log("🌟 Migration Completed! Your live database is now perfectly structured.");
    process.exit();
};

migrateToLive();
