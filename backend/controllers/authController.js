const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/mailer");

// REGISTER + SEND OTP
exports.register = async (req, res) => {
  const { fullname, email, mobile, password, birthdate } = req.body;

  if (!fullname || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const checkSql = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkSql, [email, mobile], async (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length > 0) {
      const existingUser = result.find(u => u.email === email);
      if (!existingUser) {
        return res.status(400).json({ message: "Mobile number already registered with another account." });
      }
      if (existingUser.is_verified) {
        return res.status(400).json({ message: "User already exists" });
      }
    } else {
      // Create new user if not exists
      const hashedPassword = await bcrypt.hash(password, 10);
      const userSql = "INSERT INTO users (fullname, email, mobile, password, birthdate, is_verified) VALUES (?, ?, ?, ?, ?, 0)";

      const createUser = new Promise((resolve, reject) => {
        db.query(userSql, [fullname, email, mobile, hashedPassword, birthdate || null], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      try {
        await createUser;
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "User creation failed" });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 5 * 60000);
    const otpSql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, ?, ?, ?)";

    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "OTP store failed" });
      sendEmail(email, otp);
      res.json({ message: "OTP sent" });
    });
  });
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const sql = "SELECT * FROM otps WHERE email=? AND otp=? AND expires_at > NOW() ORDER BY id DESC LIMIT 1";

  db.query(sql, [email, otp], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });

    const updateSql = "UPDATE users SET is_verified = 1 WHERE email = ?";
    db.query(updateSql, [email], (err, updateResult) => {
      if (err) return res.status(500).json({ message: "Failed to verify user" });
      if (updateResult.affectedRows === 0) return res.status(400).json({ message: "User record not found. Please register again." });
      res.json({ message: "OTP verified" });
    });
  });
};

// RESEND OTP (Universal)
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];
    const mobile = user.mobile || "0000000000";
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 5 * 60000);

    const otpSql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, ?, ?, ?)";
    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "Failed to generate new OTP" });
      sendEmail(email, otp);
      console.log(`RESEND OTP for ${email}: ${otp}`);
      res.json({ success: true, message: "New OTP sent to your email" });
    });
  });
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    if (!user.is_verified) return res.status(400).json({ message: "Account not verified. Please verify OTP." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role } });
  });
};

// ADMIN REGISTER
exports.registerAdmin = async (req, res) => {
  const { fullname, email, mobile, password } = req.body;
  if (!fullname || !email || !mobile || !password) return res.status(400).json({ message: "All fields required" });

  const checkSql = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkSql, [email, mobile], async (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    const sendAdminOtp = (email, mobile, res) => {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const expires = new Date(Date.now() + 5 * 60000);
      const otpSql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, ?, ?, ?)";
      db.query(otpSql, [email, mobile, otp, expires], (err) => {
        if (err) return res.status(500).json({ message: "OTP failed" });
        sendEmail(email, otp);
        console.log(`ADMIN OTP for ${email}: ${otp}`);
        res.json({ message: "OTP sent" });
      });
    };

    if (result.length > 0) {
      const existingUser = result.find(u => u.email === email);
      if (!existingUser) {
        return res.status(400).json({ message: "Mobile number already registered with another account." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const updateSql = "UPDATE users SET password = ?, fullname = ?, mobile = ? WHERE email = ?";
      db.query(updateSql, [hashedPassword, fullname, mobile, email], (err) => {
        if (err) return res.status(500).json({ message: "Update failed" });
        sendAdminOtp(email, mobile, res);
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userSql = "INSERT INTO users (fullname, email, mobile, password, role, is_verified) VALUES (?, ?, ?, ?, 'admin', 0)";
    db.query(userSql, [fullname, email, mobile, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: "Registration failed" });
      sendAdminOtp(email, mobile, res);
    });
  });
};

// ADMIN VERIFY
exports.verifyAdminOtp = (req, res) => {
  const { email, otp } = req.body;
  const sql = "SELECT * FROM otps WHERE email=? AND otp=? AND expires_at > NOW() ORDER BY id DESC LIMIT 1";
  db.query(sql, [email, otp], (err, result) => {
    if (err || result.length === 0) return res.status(400).json({ message: "Invalid OTP" });
    const adminCode = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
    const updateSql = "UPDATE users SET is_verified=1, admin_code=? WHERE email=?";
    db.query(updateSql, [adminCode, email], (err, updateResult) => {
      if (err) return res.status(500).json({ message: "Verification failed" });
      if (updateResult.affectedRows === 0) return res.status(400).json({ message: "User record not found. Please register again." });
      res.json({ message: "Verified", adminCode });
    });
  });
};

// ADMIN LOGIN
exports.adminLogin = (req, res) => {
  const { adminCode, password } = req.body;

  console.log('\n🔐 Admin Login Attempt:');
  console.log('Received Code:', adminCode);
  console.log('Code Type:', typeof adminCode);
  console.log('Code Length:', adminCode?.length);

  const sql = "SELECT * FROM users WHERE admin_code = ? AND role = 'admin'";
  db.query(sql, [adminCode], async (err, result) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log('Query Result Count:', result.length);
    if (result.length > 0) {
      console.log('Found User:', result[0].email);
      console.log('DB Code:', result[0].admin_code);
      console.log('Codes Match:', result[0].admin_code === adminCode);
    }

    if (result.length === 0) {
      console.log('❌ No user found with code:', adminCode);
      return res.status(400).json({ message: "Invalid Admin Code" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password Match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ message: "Invalid Password" });
    }

    console.log('✅ Login successful for:', user.email);
    res.json({
      message: "Welcome Admin",
      token: "admin-jwt-token-placeholder",
      user: { id: user.id, name: user.fullname, email: user.email, mobile: user.mobile, role: 'admin' }
    });
  });
};

// RESEND ADMIN OTP
exports.resendAdminOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "User not found" });

    const mobile = result[0].mobile;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expires = new Date(Date.now() + 5 * 60000);
    const otpSql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, ?, ?, ?)";
    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "OTP failed" });
      sendEmail(email, otp);
      console.log(`ADMIN RESEND OTP for ${email}: ${otp}`);
      res.json({ message: "OTP resent" });
    });
  });
};

// KITCHEN REGISTER
exports.registerKitchen = async (req, res) => {
  const { fullname, email, mobile, password } = req.body;
  if (!fullname || !email || !mobile || !password) return res.status(400).json({ message: "All fields required" });

  const checkSql = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkSql, [email, mobile], async (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    const sendKitchenOtp = (email, mobile, res) => {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const expires = new Date(Date.now() + 5 * 60000);
      const otpSql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, ?, ?, ?)";
      db.query(otpSql, [email, mobile, otp, expires], (err) => {
        if (err) return res.status(500).json({ message: "OTP failed" });
        sendEmail(email, otp);
        console.log(`KITCHEN OTP for ${email}: ${otp}`);
        res.json({ message: "OTP sent" });
      });
    };

    if (result.length > 0) {
      const existingUser = result.find(u => u.email === email);
      if (!existingUser) {
        return res.status(400).json({ message: "Mobile number already registered with another account." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const updateSql = "UPDATE users SET password = ?, fullname = ?, mobile = ? WHERE email = ?";
      db.query(updateSql, [hashedPassword, fullname, mobile, email], (err) => {
        if (err) return res.status(500).json({ message: "Update failed" });
        sendKitchenOtp(email, mobile, res);
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userSql = "INSERT INTO users (fullname, email, mobile, password, role, is_verified) VALUES (?, ?, ?, ?, 'kitchen', 0)";
    db.query(userSql, [fullname, email, mobile, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: "Registration failed" });
      sendKitchenOtp(email, mobile, res);
    });
  });
};

// KITCHEN VERIFY
exports.verifyKitchenOtp = (req, res) => {
  const { email, otp } = req.body;
  const sql = "SELECT * FROM otps WHERE email=? AND otp=? AND expires_at > NOW() ORDER BY id DESC LIMIT 1";
  db.query(sql, [email, otp], (err, result) => {
    if (err || result.length === 0) return res.status(400).json({ message: "Invalid OTP" });
    const kitchenCode = `KIT-${Math.floor(1000 + Math.random() * 9000)}`;
    const updateSql = "UPDATE users SET is_verified=1, kitchen_code=? WHERE email=?";
    db.query(updateSql, [kitchenCode, email], (err, updateResult) => {
      if (err) return res.status(500).json({ message: "Verification failed" });
      if (updateResult.affectedRows === 0) return res.status(400).json({ message: "User record not found. Please register again." });
      res.json({ message: "Verified", kitchenCode });
    });
  });
};

// KITCHEN LOGIN
exports.kitchenLogin = (req, res) => {
  const { kitchenCode, password } = req.body;

  console.log('\n👨‍🍳 Kitchen Login Attempt:');
  console.log('Received Code:', kitchenCode);
  console.log('Code Type:', typeof kitchenCode);
  console.log('Code Length:', kitchenCode?.length);

  const sql = "SELECT * FROM users WHERE kitchen_code = ? AND role = 'kitchen'";
  db.query(sql, [kitchenCode], async (err, result) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log('Query Result Count:', result.length);
    if (result.length > 0) {
      console.log('Found User:', result[0].email);
      console.log('DB Code:', result[0].kitchen_code);
      console.log('Codes Match:', result[0].kitchen_code === kitchenCode);
    }

    if (result.length === 0) {
      console.log('❌ No user found with code:', kitchenCode);
      return res.status(400).json({ message: "Invalid Kitchen Code" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    console.log('Password Match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ message: "Invalid Password" });
    }

    console.log('✅ Login successful for:', user.email);
    res.json({
      message: "Welcome Kitchen Staff",
      token: "kitchen-jwt-token-placeholder",
      user: { id: user.id, name: user.fullname, email: user.email, mobile: user.mobile, kitchen_code: user.kitchen_code, role: 'kitchen' }
    });
  });
};

// RESEND KITCHEN OTP
exports.resendKitchenOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "User not found" });
    const mobile = result[0].mobile;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expires = new Date(Date.now() + 5 * 60000);
    const otpSql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, ?, ?, ?)";
    db.query(otpSql, [email, mobile, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "OTP failed" });
      sendEmail(email, otp);
      console.log(`KITCHEN RESEND OTP for ${email}: ${otp}`);
      res.json({ message: "OTP resent" });
    });
  });
};

// ==========================
// FORGOT PASSWORD FLOW
// ==========================

// 1. REQUEST OTP
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000); // 4 Digit
    const expires = new Date(Date.now() + 10 * 60000); // 10 mins

    // Store OTP
    const sql = "INSERT INTO otps (email, mobile, otp, expires_at) VALUES (?, '0000000000', ?, ?)";
    db.query(sql, [email, otp, expires], (err) => {
      if (err) return res.status(500).json({ message: "Failed to generate OTP" });

      sendEmail(email, otp);
      console.log(`RESET OTP for ${email}: ${otp}`);
      res.json({ message: "OTP sent to email" });
    });
  });
};

// 2. VERIFY OTP (For UI transition)
exports.verifyResetOtp = (req, res) => {
  const { email, otp } = req.body;
  const sql = "SELECT * FROM otps WHERE email=? AND otp=? AND expires_at > NOW() ORDER BY id DESC LIMIT 1";
  db.query(sql, [email, otp], (err, result) => {
    if (err || result.length === 0) return res.status(400).json({ message: "Invalid or Expired OTP" });
    res.json({ message: "OTP Verified" });
  });
};

// 3. RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: "Password too short" });

  // Verify OTP again to be secure
  const sql = "SELECT * FROM otps WHERE email=? AND otp=? AND expires_at > NOW() ORDER BY id DESC LIMIT 1";
  db.query(sql, [email, otp], async (err, result) => {
    if (err || result.length === 0) return res.status(400).json({ message: "Invalid Session (OTP Expired)" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update User
    const updateSql = "UPDATE users SET password = ? WHERE email = ?";
    db.query(updateSql, [hashedPassword, email], (err) => {
      if (err) return res.status(500).json({ message: "Failed to reset password" });

      // Optional: Delete used OTP
      // db.query("DELETE FROM otps WHERE email=?", [email]);

      res.json({ message: "Password Reset Successfully" });
    });
  });
};

// ==========================
// RECOVER CODE FLOW
// ==========================
exports.recoverCode = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email and Password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND role = ?";
  db.query(sql, [email, role], async (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    if (result.length === 0) return res.status(404).json({ message: "User not found with this email and role" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    let code = "";
    if (role === 'admin') code = user.admin_code;
    else if (role === 'kitchen') code = user.kitchen_code;

    if (!code) {
      // User exists but hasn't completed OTP verification
      return res.status(400).json({
        message: "No code found. Please complete OTP verification first.",
        needsVerification: true,
        email: user.email
      });
    }

    res.json({ message: "Success", code });
  });
};

// TEST EMAIL (For Debugging)
exports.testEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email query param required" });

  console.log(`\n📧 [DIAGNOSTIC] Running Test Email for: ${email}`);
  
  const testOtp = "123456";
  const nodemailer = require("nodemailer");

  // Re-create transporter here for direct debugging
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || "mayurishinde2805@gmail.com",
      pass: process.env.EMAIL_PASS || "cvnevlfnedvklsbo",
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER || "mayurishinde2805@gmail.com",
    to: email,
    subject: "DIAGNOSTIC: DineExpress Test Email",
    text: "If you are reading this, your DineExpress mailer is working perfectly! OTP: 123456",
  }, (err, info) => {
    if (err) {
      console.error("❌ [DIAGNOSTIC ERROR]:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Email Failed", 
        error_name: err.name,
        error_msg: err.message,
        error_code: err.code,
        full_error: err 
      });
    } else {
      console.log("✅ [DIAGNOSTIC SUCCESS]:", info.response);
      return res.json({ 
        success: true, 
        message: "Email Sent Successfully!", 
        response: info.response 
      });
    }
  });
};
