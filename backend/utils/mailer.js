const nodemailer = require("nodemailer");

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

const sendEmail = (to, otp) => {
  console.log(`[DEBUG] Attempting to send OTP to: ${to}`);
  transporter.sendMail({
    from: process.env.EMAIL_USER || "mayurishinde2805@gmail.com",
    to,
    subject: "Your DineExpress OTP",
    text: `Your OTP for DineExpress is: ${otp}. This code will expire in 5 minutes.`,
  }, (err, info) => {
    if (err) {
      console.error("❌ [MAILER ERROR]:", err.message);
      console.error("❌ Full Error Object:", JSON.stringify(err));
    } else {
      console.log("✅ [MAIL SENT SUCCESS]:", info.response);
    }
  });
};

module.exports = sendEmail;
