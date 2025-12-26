const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 🔑 Windows + Node 24 fix
      },
    });

    await transporter.sendMail({
      from: `"DineExpress" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP - DineExpress",
      html: `
        <div style="font-family:Arial">
          <h2>DineExpress OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("📧 OTP email sent to:", email);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    throw err; // VERY IMPORTANT
  }
};

module.exports = sendEmail;
