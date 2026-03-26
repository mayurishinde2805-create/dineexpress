require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'mayushinde234@gmail.com',
  subject: 'DineExpress OTP TEST (Local)',
  text: 'Testing SMTP with rejectUnauthorized: false',
}, (err, info) => {
  if (err) {
    console.error('❌ EMAIL FAILED:', err.message);
  } else {
    console.log('✅ EMAIL SENT:', info.response);
  }
  process.exit();
});
