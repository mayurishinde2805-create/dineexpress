require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

const run = async () => {
    const passwordHash = await bcrypt.hash('Mayuri@123', 10);

    // 1. Update Customer password for exactly 'mayushinde234@gmail.com'
    db.query("UPDATE users SET password=? WHERE email='mayushinde234@gmail.com'", [passwordHash], (err) => {
        if (err) console.error("Update error 1:", err);
        else console.log("✅ mayushinde234@gmail.com password updated to Mayuri@123");

        // 2. Update Kitchen user kshitijgupta035@gmail.com password to Mayuri@123
        const updateKitchen = "UPDATE users SET password=? WHERE email='kshitijgupta035@gmail.com'";
        
        db.query(updateKitchen, [passwordHash], (err) => {
            if (err) console.error("Update Kitchen error:", err);
            else console.log("✅ kshitijgupta035@gmail.com Kitchen password updated to Mayuri@123");
            process.exit();
        });
    });
};

run();
