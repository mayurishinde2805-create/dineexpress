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
    db.query('SELECT name, category, sub_category, type FROM menu WHERE category="Starters"', (err, results) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(JSON.stringify(results, null, 2));
        db.end();
    });
});
