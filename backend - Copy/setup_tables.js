const db = require("./config/db");

const setupTables = async () => {
    console.log("🛠️ Setting up Tables Schema...");

    const sql = `
        CREATE TABLE IF NOT EXISTS tables (
            id INT AUTO_INCREMENT PRIMARY KEY,
            table_number VARCHAR(50) UNIQUE NOT NULL,
            capacity INT DEFAULT 4,
            status VARCHAR(50) DEFAULT 'Available', -- Available / Occupied / Reserved
            qr_code TEXT, -- Data URL of QR Code
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Table creation failed:", err);
            process.exit(1);
        }
        console.log("✅ 'tables' Table Ready!");
        process.exit();
    });
};

setupTables();
