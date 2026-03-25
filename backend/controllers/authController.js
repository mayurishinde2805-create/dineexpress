const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/mailer");
const nodemailer = require("nodemailer");
const axios = require("axios");

// BASIC HELLO TEST
exports.helloTest = (req, res) => {
  res.json({ message: "Auth Controller is working!" });
};

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

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  console.log(`\n📧 [DIAGNOSTIC] Running Test Email for: ${email}`);

  // 1. TEST RESEND
  if (RESEND_API_KEY) {
    console.log("[DIAGNOSTIC] Using Resend API Path");
    try {
      const response = await axios.post('https://api.resend.com/emails', {
        from: 'DineExpress <onboarding@resend.dev>',
        to: [email],
        subject: 'DIAGNOSTIC: DineExpress Resend Test',
        html: '<p>If you are reading this, your DineExpress <strong>RESEND API</strong> is working!</p>'
      }, {
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }
      });
      
      return res.json({ 
        success: true, 
        method: "RESEND_API",
        message: "Email Sent Successfully via Resend!", 
        response: response.data 
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        method: "RESEND_API",
        message: "Resend API Failed", 
        error_details: err.response?.data || err.message 
      });
    }
  }

  // 2. TEST BREVO
  if (BREVO_API_KEY) {
    console.log("[DIAGNOSTIC] Using Brevo API Path");
    try {
      const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: "DineExpress", email: process.env.EMAIL_USER || "mayurishinde2805@gmail.com" },
        to: [{ email: email }],
        subject: "DIAGNOSTIC: DineExpress Brevo Test",
        textContent: "If you are reading this, your DineExpress BREVO API is working perfectly!",
        htmlContent: "<p>If you are reading this, your DineExpress <strong>BREVO API</strong> is working perfectly!</p>"
      }, {
        headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' }
      });
      
      return res.json({ 
        success: true, 
        method: "BREVO_API",
        message: "Email Sent Successfully via Brevo!", 
        response: response.data 
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        method: "BREVO_API",
        message: "Brevo API Failed", 
        error_details: err.response?.data || err.message 
      });
    }
  }

  // 3. TEST SMTP FALLBACK
  console.log("[DIAGNOSTIC] Using SMTP Fallback Path");
  const transporter = nodemailer.createTransport({
    service: "gmail",
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
    subject: "DIAGNOSTIC: DineExpress SMTP Test",
    text: "Testing SMTP fallback. This will likely time out on Render.",
  }, (err, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        method: "SMTP_FALLBACK",
        message: "SMTP Failed (Blocked on Render)", 
        error_msg: err.message
      });
    } else {
      return res.json({ 
        success: true, 
        method: "SMTP_FALLBACK",
        message: "SMTP Sent Successfully!", 
        response: info.response 
      });
    }
  });
};
exports.setupDb = async (req, res) => {
  console.log("🛠️ [DIAGNOSTIC] Running Database Table Setup...");
  
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      mobile VARCHAR(20),
      password VARCHAR(255),
      birthdate DATE,
      role ENUM('customer', 'admin', 'kitchen') DEFAULT 'customer',
      is_verified BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS otps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255),
      mobile VARCHAR(20),
      otp INT,
      expires_at DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `DROP TABLE IF EXISTS menu_items`,
    `CREATE TABLE menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      name_mr VARCHAR(255),
      name_hi VARCHAR(255),
      description TEXT,
      description_mr TEXT,
      description_hi TEXT,
      price DECIMAL(10,2),
      category VARCHAR(100),
      category_mr VARCHAR(100),
      category_hi VARCHAR(100),
      sub_category VARCHAR(100),
      sub_category_mr VARCHAR(100),
      sub_category_hi VARCHAR(100),
      image_url VARCHAR(255),
      diet ENUM('veg', 'non-veg', 'egg'),
      variants TEXT,
      variants_mr TEXT,
      variants_hi TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      table_no INT,
      total_amount DECIMAL(10,2),
      status ENUM('Placed', 'Preparing', 'Ready', 'Served', 'Cancelled') DEFAULT 'Placed',
      payment_method VARCHAR(50),
      payment_status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      menu_item_id INT,
      quantity INT,
      price DECIMAL(10,2),
      variant VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS waiter_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      table_no INT,
      status ENUM('pending', 'responded') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  try {
    for (const sql of queries) {
      await new Promise((resolve, reject) => {
        db.query(sql, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    res.json({ success: true, message: "All tables verified and created successfully!" });
  } catch (err) {
    console.error("❌ [SETUP DB ERROR]:", err.message);
    res.status(500).json({ success: false, message: "Table setup failed", error: err.message });
  }
};

exports.checkEnv = (req, res) => {
  const mysqlUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  let maskedUrl = "NONE";
  if (mysqlUrl) {
    const parts = mysqlUrl.split('@');
    if (parts.length > 1) {
      maskedUrl = "mysql://****:****@" + parts[1];
    } else {
      maskedUrl = mysqlUrl.substring(0, 15) + "...";
    }
  }

  res.json({
    mysql_url_exists: !!mysqlUrl,
    mysql_url_masked: maskedUrl,
    db_host: process.env.DB_HOST || "NONE",
    db_user: process.env.DB_USER || "NONE",
    node_env: process.env.NODE_ENV || "development",
    message: "Check your Render Logs for [DB] Patching message to confirm host replacement."
  });
};

exports.seedMenu = async (req, res) => {
  console.log("🌱 [DIAGNOSTIC] Seeding Sample Menu Data...");
  const sampleItems = [
    { name: "Paneer Tikka", d_name: "पनीर टिक्का", price: 250, cat: "Starters", d_cat: "Starters", sub: "Veg Starters", d_sub: "व्हेज स्टार्टर्स", diet: "veg" },
    { name: "Chicken Biryani", d_name: "चिकन बिर्याणी", price: 350, cat: "Main Menu", d_cat: "Main Menu", sub: "Non-Veg", d_sub: "नॉन-व्हेज", diet: "non-veg" },
    { name: "Gulab Jamun", d_name: "गुलाब जामुन", price: 120, cat: "Desserts", d_cat: "Desserts", sub: "Sweets", d_sub: "मिठाई", diet: "veg" },
    { name: "Cold Coffee", d_name: "कोल्ड कॉफी", price: 150, cat: "Drinks", d_cat: "Drinks", sub: "Beverages", d_sub: "पेय", diet: "veg" }
  ];

  try {
    for (const item of sampleItems) {
      const sql = "INSERT INTO menu_items (name, display_name, price, category, display_category, sub_category, display_sub_category, diet) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      await new Promise((resolve, reject) => {
        db.query(sql, [item.name, item.d_name, item.price, item.cat, item.d_cat, item.sub, item.d_sub, item.diet], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    res.json({ success: true, message: "Sample Menu Data seeded successfully! Please refresh your Menu page." });
  } catch (err) {
    console.error("❌ [SEED MENU ERROR]:", err.message);
    res.status(500).json({ success: false, message: "Seeding failed", error: err.message });
  }
};

// --- ULTIMATE PRODUCTION RESTORATION (MARATHI SUPPORT) ---
exports.restoreFullMenu = async (req, res) => {
  console.log("🚀 [ULTIMATE RESTORATION] Restoring Full Menu from JSON with Marathi Support...");
  const fs = require('fs');
  const path = require('path');
  
  const translationDict = {
    "Starters": "स्टार्टर्स", "Main Menu": "मुख्य मेनू", "Desserts": "मिठाई", "Drinks": "पेय",
    "Veg Starters": "व्हे़ज स्टार्टर्स", "Non-Veg Starters": "नॉन-व्हे़ज स्टार्टर्स",
    "Indian": "भारतीय", "Chinese": "चायनीज", "Cakes": "केक", "Ice Cream": "आईस्क्रीम",
    "Coffee": "कॉफी", "Tea": "चहा", "Soft Drinks": "कोल्ड ड्रिंक्स", "Mexican": "मेक्सिकन",
    "Arabic": "अरबी", "Continental": "काेंटिनेंटल", "Fusion": "फ्यूजन"
  };

  const translate = (txt) => translationDict[txt] || txt;

  try {
    const dataPath = path.join(__dirname, '../full_menu_data.json');
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ success: false, message: "Restoration data file not found on server." });
    }

    const fullItems = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    await new Promise((resolve, reject) => {
      db.query("DELETE FROM menu_items", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    for (const i of fullItems) {
      const sql = `INSERT INTO menu_items 
        (name, name_mr, category, category_mr, sub_category, sub_category_mr, price, diet, description, description_mr, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      await new Promise((resolve, reject) => {
        db.query(sql, [
          i.name, translate(i.name), 
          i.category, translate(i.category), 
          i.sub_category, translate(i.sub_category), 
          i.price, i.diet || "veg", 
          i.description || i.name, translate(i.description || i.name),
          i.image_url || null
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    res.json({ success: true, message: "ULTIMATE MENU RESTORATION COMPLETE!", count: fullItems.length });
  } catch (err) {
    console.error("❌ [RESTORE ERROR]:", err.message);
    res.status(500).json({ success: false, message: "Restoration failed", error: err.message });
  }
};