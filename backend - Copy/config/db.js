const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",     // तुझा MySQL password
  database: "dineexpress",
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected");
  }
});

module.exports = db;
