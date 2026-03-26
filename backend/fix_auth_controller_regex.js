const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'controllers', 'authController.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace otpSql queries
code = code.replace(/db\.query\(otpSql, \[(.*?)\], \(err\) => \{([\s\S]*?)sendEmail\(email, otp\);([\s\S]*?)\}\);/g, 
  (match, p1, p2, p3) => {
    return `db.query(otpSql, [${p1}], async (err) => {${p2}try {
        await sendEmail(email, otp);${p3}} catch (error) {
        console.error("Mail Error:", error);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`;
});

// Replace the single 'sql' query for forgot password
code = code.replace(/db\.query\(sql, \[email, otp, expires\], \(err\) => \{([\s\S]*?)sendEmail\(email, otp\);([\s\S]*?)\}\);/g, 
  (match, p1, p2) => {
    return `db.query(sql, [email, otp, expires], async (err) => {${p1}try {
        await sendEmail(email, otp);${p2}} catch (error) {
        console.error("Mail Error:", error);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`;
});

fs.writeFileSync(filePath, code);
console.log("Regex replacement done");
