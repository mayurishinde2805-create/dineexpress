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

    console.log("=== Checking Drinks Data ===\n");

    db.query('SELECT name, category, sub_category, type FROM menu WHERE category="Drinks"', (err, results) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("Drinks in database:");
        console.log(JSON.stringify(results, null, 2));

        console.log("\n=== Checking ALL Menu Data ===\n");
        db.query('SELECT id, name, category, sub_category, type FROM menu', (err, all) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log("All items:");
            console.log(JSON.stringify(all, null, 2));
            db.end();
        });
    });
});
