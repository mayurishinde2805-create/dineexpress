require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('Testing email with:', process.env.EMAIL_USER);

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'DineExpress OTP TEST',
  text: 'This is a test to verify if the SMTP credentials are working.',
}, (err, info) => {
  if (err) {
    console.error('❌ EMAIL FAILED:', err.message);
  } else {
    console.log('✅ EMAIL SENT:', info.response);
  }
  process.exit();
});
