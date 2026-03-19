const db = require("./config/db");

const setupFeedback = async () => {
    console.log("🛠️ Setting up Feedback Schema...");

    const sql = `
        CREATE TABLE IF NOT EXISTS feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            user_id INT NOT NULL,
            rating INT NOT NULL,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Feedback table creation failed:", err);
            process.exit(1);
        }
        console.log("✅ 'feedback' Table Ready!");
        process.exit();
    });
};

setupFeedback();
