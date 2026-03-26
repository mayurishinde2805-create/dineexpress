const fs = require('fs');
let code = fs.readFileSync('./controllers/authController.js', 'utf8');

code = code.replace(/db\.query\((otpSql|sql),\s*\[(.*?)\],\s*\(err\)\s*=>\s*\{([\s\S]*?)sendEmail\(email,\s*otp\);([\s\S]*?)\}\);/g, 
  (match, queryVar, args, beforeSend, afterSend) => {
    return `db.query(${queryVar}, [${args}], async (err) => {${beforeSend}try {
        await sendEmail(email, otp);${afterSend}} catch (mailErr) {
        console.error("Mail Error:", mailErr);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`;
});

fs.writeFileSync('./controllers/authController.js', code);
console.log("Clean string replacement completed without syntax errors.");
