const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'controllers', 'authController.js');
let code = fs.readFileSync(filePath, 'utf8');

// The goal is to replace `db.query(..., (err) => { ... sendEmail(email, otp); ... });` 
// with `db.query(..., async (err) => { ... try { await sendEmail(email, otp); ... } catch(e) { ... } });`

// Split the code and replace line by line for the specific blocks we identified
const blocksToReplace = [
  {
    search: `    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "OTP store failed" });
      sendEmail(email, otp);
      res.json({ message: "OTP sent" });
    });`,
    replace: `    db.query(otpSql, [email, mobile, otp, expires], async (err) => {
      if (err) return res.status(500).json({ message: "OTP store failed" });
      try {
        await sendEmail(email, otp);
        res.json({ message: "OTP sent" });
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`
  },
  {
    search: `    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "Failed to generate new OTP" });
      sendEmail(email, otp);
      console.log(\`RESEND OTP for \${email}: \${otp}\`);
      res.json({ success: true, message: "New OTP sent to your email" });
    });`,
    replace: `    db.query(otpSql, [email, mobile, otp, expires], async (err) => {
      if (err) return res.status(500).json({ message: "Failed to generate new OTP" });
      try {
        await sendEmail(email, otp);
        console.log(\`RESEND OTP for \${email}: \${otp}\`);
        res.json({ success: true, message: "New OTP sent to your email" });
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`
  },
  {
    search: `      db.query(otpSql, [email, mobile, otp, expires], (err) => {
        if (err) return res.status(500).json({ message: "OTP failed" });
        sendEmail(email, otp);
        console.log(\`ADMIN OTP for \${email}: \${otp}\`);
        res.json({ message: "OTP sent" });
      });`,
    replace: `      db.query(otpSql, [email, mobile, otp, expires], async (err) => {
        if (err) return res.status(500).json({ message: "OTP failed" });
        try {
          await sendEmail(email, otp);
          console.log(\`ADMIN OTP for \${email}: \${otp}\`);
          res.json({ message: "OTP sent" });
        } catch (mailErr) {
          console.error("Mail Error:", mailErr);
          res.status(500).json({ message: "Failed to send OTP email" });
        }
      });`
  },
  {
    search: `    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "OTP failed" });
      sendEmail(email, otp);
      console.log(\`ADMIN RESEND OTP for \${email}: \${otp}\`);
      res.json({ message: "OTP resent" });
    });`,
    replace: `    db.query(otpSql, [email, mobile, otp, expires], async (err) => {
      if (err) return res.status(500).json({ message: "OTP failed" });
      try {
        await sendEmail(email, otp);
        console.log(\`ADMIN RESEND OTP for \${email}: \${otp}\`);
        res.json({ message: "OTP resent" });
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`
  },
  {
    search: `      db.query(otpSql, [email, mobile, otp, expires], (err) => {
        if (err) return res.status(500).json({ message: "OTP failed" });
        sendEmail(email, otp);
        console.log(\`KITCHEN OTP for \${email}: \${otp}\`);
        res.json({ message: "OTP sent" });
      });`,
    replace: `      db.query(otpSql, [email, mobile, otp, expires], async (err) => {
        if (err) return res.status(500).json({ message: "OTP failed" });
        try {
          await sendEmail(email, otp);
          console.log(\`KITCHEN OTP for \${email}: \${otp}\`);
          res.json({ message: "OTP sent" });
        } catch (mailErr) {
          console.error("Mail Error:", mailErr);
          res.status(500).json({ message: "Failed to send OTP email" });
        }
      });`
  },
  {
    search: `    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "OTP failed" });
      sendEmail(email, otp);
      console.log(\`KITCHEN RESEND OTP for \${email}: \${otp}\`);
      res.json({ message: "OTP resent" });
    });`,
    replace: `    db.query(otpSql, [email, mobile, otp, expires], async (err) => {
      if (err) return res.status(500).json({ message: "OTP failed" });
      try {
        await sendEmail(email, otp);
        console.log(\`KITCHEN RESEND OTP for \${email}: \${otp}\`);
        res.json({ message: "OTP resent" });
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`
  },
  {
    search: `    db.query(sql, [email, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "Failed to generate OTP" });

      sendEmail(email, otp);
      console.log(\`RESET OTP for \${email}: \${otp}\`);
      res.json({ message: "OTP sent to email" });
    });`,
    replace: `    db.query(sql, [email, otp, expires], async (err) => {
      if (err) return res.status(500).json({ message: "Failed to generate OTP" });
      try {
        await sendEmail(email, otp);
        console.log(\`RESET OTP for \${email}: \${otp}\`);
        res.json({ message: "OTP sent to email" });
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });`
  }
];

let replacedCount = 0;
for (const block of blocksToReplace) {
  if (code.includes(block.search)) {
    code = code.replace(block.search, block.replace);
    replacedCount++;
  } else {
    console.log("Could not find block:", block.search.substring(0, 50) + "...");
  }
}

fs.writeFileSync(filePath, code);
console.log('Successfully replaced ' + replacedCount + ' blocks in authController.js');
