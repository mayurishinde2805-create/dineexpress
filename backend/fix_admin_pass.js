require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

const run = async () => {
    const passwordHash = await bcrypt.hash('Rani@123', 10);

    // Update Admin password for ADM-9045 explicitly ('mayurishinde2805@gmail.com')
    db.query("UPDATE users SET password=? WHERE admin_code='ADM-9045'", [passwordHash], (err) => {
        if (err) console.error("Update admin error:", err);
        else console.log("✅ Admin ADM-9045 password successfully reset to Rani@123");
        process.exit();
    });
};

run();
