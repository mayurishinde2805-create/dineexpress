const db = require("./config/db");

db.query("SELECT name, image_url, category, sub_category FROM menu WHERE name IN ('Idli Sambar', 'Uttapam', 'Masala Dosa', 'Hara Bhara Kebab')", (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
    process.exit();
});
