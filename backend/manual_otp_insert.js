require('dotenv').config();
const db = require('./config/db');

const email = 'mayurishinde2805@gmail.com';
const mobile = '9356394544';
const otp = 9999;
const expires = new Date(Date.now() + 5 * 60000);

const otpSql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, ?, ?, ?)";

db.query(otpSql, [email, mobile, otp, expires], (err, res) => {
    if (err) console.error('❌ INSERT FAILED:', err.message);
    else console.log('✅ INSERT SUCCESS:', res.insertId);
    process.exit();
});
