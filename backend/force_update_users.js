require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

const run = async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Reset Admin/Customer password to exactly '123456'
    db.query("UPDATE users SET password=? WHERE email='mayushinde2805@gmail.com'", [passwordHash], (err) => {
        if (err) console.error("Update error 1:", err);
        else console.log("✅ mayushinde2805@gmail.com password reset to 123456");

        // 2. Update Kitchen user kshitijgupta035@gmail.com, force it to 'kitchen', is_verified=1, and inject code
        const updateKitchen = "UPDATE users SET password=?, role='kitchen', is_verified=1, kitchen_code='KIT-9999' WHERE email='kshitijgupta035@gmail.com'";
        
        db.query(updateKitchen, [passwordHash], (err) => {
            if (err) console.error("Update Kitchen error:", err);
            else console.log("✅ kshitijgupta035@gmail.com Kitchen user forcefully verified. Kitchen Code: KIT-9999, Password: 123456");
            process.exit();
        });
    });
};

run();
