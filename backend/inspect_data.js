const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "dineexpress",
});

db.connect((err) => {
    if (err) {
        console.error("❌ DB connection failed:", err.message);
        process.exit(1);
    }
    console.log("✅ MySQL connected");

    db.query("SELECT DISTINCT category, sub_category, type FROM menu", (err, results) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("--- Unique Categories, Sub-Categories, and Types ---");
        console.log(JSON.stringify(results, null, 2));

        db.query("SELECT COUNT(*) as count, category, sub_category FROM menu GROUP BY category, sub_category", (err, counts) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log("\n--- Item counts per category/sub_category ---");
            console.log(JSON.stringify(counts, null, 2));
            db.end();
        });
    });
});
