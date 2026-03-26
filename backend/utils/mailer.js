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
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  // 1. TRY RESEND (BEST OPTION)
  if (RESEND_API_KEY) {
    console.log(`[DEBUG] Using Resend API for: ${to}`);
    try {
      await axios.post('https://api.resend.com/emails', {
        from: 'DineExpress <onboarding@resend.dev>', // Default for free accounts
        to: [to],
        subject: 'Your DineExpress OTP',
        html: `<p>Your OTP for DineExpress is: <strong>${otp}</strong>. This code will expire in 5 minutes.</p>`
      }, {
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }
      });
      console.log("✅ [RESEND API SUCCESS]");
      return true;
    } catch (err) {
      console.error("❌ [RESEND ERROR]:", err.response?.data || err.message);
    }
  }

  // 2. TRY BREVO (SECOND BEST)
  if (BREVO_API_KEY) {
    console.log(`[DEBUG] Using Brevo API for: ${to}`);
    try {
      await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { name: "DineExpress", email: process.env.EMAIL_USER || "mayurishinde2805@gmail.com" },
        to: [{ email: to }],
        subject: "Your DineExpress OTP",
        htmlContent: `<p>Your OTP for DineExpress is: <strong>${otp}</strong>. This code will expire in 5 minutes.</p>`
      }, {
        headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' }
      });
      console.log("✅ [BREVO API SUCCESS]");
      return true;
    } catch (err) {
      console.error("❌ [BREVO ERROR]:", err.response?.data || err.message);
    }
  }

  // 3. FALLBACK TO SMTP (LIKELY TO FAIL ON RENDER)
  console.log(`[DEBUG] Falling back to SMTP for: ${to}`);
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: process.env.EMAIL_USER || "mayurishinde2805@gmail.com",
      to,
      subject: "Your DineExpress OTP",
      text: `Your OTP for DineExpress is: ${otp}. This code will expire in 5 minutes.`,
    }, (err, info) => {
      if (err) {
        console.error("❌ [SMTP ERROR]:", err.message);
        reject(new Error("All email delivery methods failed."));
      } else {
        console.log("✅ [SMTP SUCCESS]");
        resolve(true);
      }
    });
  });
};

module.exports = sendEmail;
