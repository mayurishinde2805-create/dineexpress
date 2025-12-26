const db = require("../config/db");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/mailer");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { fullname, email, mobile, password } = req.body;

    if (!fullname || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Email exists check
    const [exist] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (exist.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (fullname, email, mobile, password, is_verified) VALUES (?, ?, ?, ?, 0)",
      [fullname, email, mobile, hashedPassword]
    );

    // OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expires]
    );

    await sendEmail(email, otp);

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM otps WHERE otp = ? AND expires_at > NOW()",
      [otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const email = rows[0].email;

    await db.query(
      "UPDATE users SET is_verified = 1 WHERE email = ?",
      [email]
    );

    await db.query("DELETE FROM otps WHERE email = ?", [email]);

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("❌ OTP ERROR:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (users[0].is_verified === 0) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
