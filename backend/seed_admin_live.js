const db = require("./config/db");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
    console.log("👤 Seeding Default Admin Account...");

    const fullname = "DineExpress Admin";
    const email = "admin@dineexpress.com";
    const password = "admin123"; // You can change this later
    const mobile = "9999999999";
    const adminCode = "ADM-1234";

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO users (fullname, email, mobile, password, role, is_verified, admin_code) 
        VALUES (?, ?, ?, ?, 'admin', 1, ?)
        ON DUPLICATE KEY UPDATE password=VALUES(password), admin_code=VALUES(admin_code)
    `;

    db.query(sql, [fullname, email, mobile, hashedPassword, adminCode], (err) => {
        if (err) {
            console.error("❌ Failed to seed admin:", err.message);
        } else {
            console.log("\n✅ Admin Account Created Successfully!");
            console.log("-----------------------------------");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            console.log(`Admin Code: ${adminCode}`);
            console.log("-----------------------------------\n");
        }
        process.exit();
    });
};

seedAdmin();
