const db = require("./config/db");

const updateSchemaV5 = async () => {
    console.log("Updating schema (V5) - Creating Feedback Table...");

    const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // Create Feedback Table
        const feedbackSql = `
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                user_id INT,
                rating INT CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `;

        await runQuery(feedbackSql);
        console.log("✅ Created feedback table");

        console.log("🎉 Schema V5 Update Complete!");
        process.exit();

    } catch (err) {
        console.error("❌ Schema V5 Update Failed:", err);
        process.exit(1);
    }
};

updateSchemaV5();
