const db = require("./config/db");

const ensureOtps = async () => {
    console.log("🛠️ Checking OTPS Table...");

    const query = `
        CREATE TABLE IF NOT EXISTS otps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255),
            mobile VARCHAR(20),
            otp VARCHAR(10),
            expires_at DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("❌ Failed to create OTPS table:", err);
            process.exit(1);
        }
        console.log("✅ OTPS Table is Ready!");
        process.exit();
    });
};

ensureOtps();
