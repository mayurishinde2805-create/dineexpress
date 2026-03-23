const nodemailer = require("nodemailer");
const axios = require("axios");

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

const sendEmail = async (to, otp) => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (BREVO_API_KEY) {
    console.log(`[DEBUG] Using Brevo API for: ${to}`);
    try {
      await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: "DineExpress", email: process.env.EMAIL_USER || "mayurishinde2805@gmail.com" },
        to: [{ email: to }],
        subject: "Your DineExpress OTP",
        textContent: `Your OTP for DineExpress is: ${otp}. This code will expire in 5 minutes.`,
        htmlContent: `<p>Your OTP for DineExpress is: <strong>${otp}</strong>. This code will expire in 5 minutes.</p>`
      }, {
        headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' }
      });
      console.log("✅ [BREVO API SUCCESS]: Email sent to", to);
      return true;
    } catch (err) {
      console.error("❌ [BREVO API ERROR]:", err.response?.data || err.message);
      return false;
    }
  } else {
    console.log(`[DEBUG] Attempting SMTP for: ${to} (Fallback)`);
    return new Promise((resolve) => {
      transporter.sendMail({
        from: process.env.EMAIL_USER || "mayurishinde2805@gmail.com",
        to,
        subject: "Your DineExpress OTP",
        text: `Your OTP for DineExpress is: ${otp}. This code will expire in 5 minutes.`,
      }, (err, info) => {
        if (err) {
          console.error("❌ [SMTP MAILER ERROR]:", err.message);
          resolve(false);
        } else {
          console.log("✅ [SMTP MAIL SENT SUCCESS]:", info.response);
          resolve(true);
        }
      });
    });
  }
};

module.exports = sendEmail;
