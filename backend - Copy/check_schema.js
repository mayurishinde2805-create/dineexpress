const db = require("./config/db");

db.query("DESCRIBE users", (err, result) => {
  if (err) {
    console.error("Error describing users:", err);
  } else {
    console.log("Users table schema:", result);
  }
  process.exit();
});
