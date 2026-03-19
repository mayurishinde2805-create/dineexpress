const db = require("./config/db");

const email = "test1767414447715@example.com";

const userSql = "SELECT * FROM users WHERE email = ?";
const otpSql = "SELECT * FROM otps WHERE email = ? ORDER BY id DESC LIMIT 1";

db.query(userSql, [email], (err, users) => {
    if (err) {
        console.error("Error fetching user:", err);
    } else {
        console.log("User:", users[0]);
    }

    db.query(otpSql, [email], (err, otps) => {
        if (err) {
            console.error("Error fetching OTP:", err);
        } else {
            console.log("OTP Record:", otps[0]);
        }
        process.exit();
    });
});
