require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

const run = async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Reset Admin/Customer password to exactly '123456'
    db.query("UPDATE users SET password=? WHERE email='mayurishinde2805@gmail.com'", [passwordHash], (err) => {
        if (err) console.error("Update error:", err);
        else console.log("✅ mayurishinde2805@gmail.com password reset to 123456");

        // 2. Insert specific Kitchen user kshitijgupta035@gmail.com, completely bypassing mobile checks
        const insertUser = "INSERT INTO users (fullname, email, mobile, password, role, is_verified, kitchen_code) VALUES (?, ?, ?, ?, 'kitchen', 1, ?)";
        // Generate a random mobile carefully so it never collides
        const fakeMobile = "9" + Math.floor(100000000 + Math.random() * 900000000).toString();
        const kitchenCode = "KIT-9999";
        
        db.query(insertUser, ["Kshitij Kitchen", "kshitijgupta035@gmail.com", fakeMobile, passwordHash, kitchenCode], (err) => {
            if (err) console.error("Insert Kitchen error:", err);
            else console.log("✅ kshitijgupta035@gmail.com Kitchen user created. Kitchen Code: KIT-9999, Password: 123456");
            process.exit();
        });
    });
};

run();
