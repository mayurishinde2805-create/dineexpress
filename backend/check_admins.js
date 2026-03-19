const db = require("./config/db");

db.query("SELECT id, fullname, email, role, admin_code, is_verified FROM users WHERE role = 'admin'", (err, results) => {
    if (err) {
        console.error("Error fetching admins:", err);
        process.exit(1);
    }
    console.log("Found Admins:", JSON.stringify(results, null, 2));
    process.exit(0);
});
