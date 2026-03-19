const db = require("./config/db");

db.query("SELECT * FROM menu", (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
    process.exit();
});
